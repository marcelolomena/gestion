var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var async = require('async');
var csv = require('csv');
var co = require('co');
var bulk = require("../utils/bulk");

exports.list = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "id";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, id,archivo, fechaarchivo, frecuencia,tipocarga, '' fileToUpload " +
    "FROM sip.logcargas " +
    " where borrado = 1 ORDER BY id asc) " +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

  if (filters) {
    var jsonObj = JSON.parse(filters);

    if (JSON.stringify(jsonObj.rules) != '[]') {

      jsonObj.rules.forEach(function (item) {

        if (item.op === 'cn')
          condition += item.field + " like '%" + item.data + "%' AND"
      });

      var sql = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        "as resultNum, id,archivo, fechaarchivo, frecuencia,tipocarga, '' fileToUpload " +
        "FROM sip.logcargas " +
        "WHERE borrado = 1 and " + condition.substring(0, condition.length - 4) + " ORDER BY id asc) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.logcargas.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {

            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.logcargas.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.logcargas.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};


exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {

    case "add":
      var proveedor

      if (req.body.razonsocial == 0)
      { provedor = 'NULL' }
      else
      { proveedor = req.body.razonsocial }

      models.plantillapresupuesto.create({
        idcui: req.body.parent_id,
        idservicio: req.body.idservicio,
        idproveedor: proveedor,
        borrado: 1
      }).then(function (plantilla) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.plantillapresupuesto.update({
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantilla) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.plantillapresupuesto.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;

  }

};

exports.detallecarga = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "fechaproceso";

  if (!sord)
    sord = "desc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idlogcargas",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.detallecargas.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.detallecargas.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (dcargas) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: dcargas });
        }).catch(function (err) {
          logger.error(e)
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.guardar = function (req, res) {

  models.detallecargas.create({
    idlogcargas: req.body.id,
    fechaarchivo: new Date(),
    fechaproceso: new Date(),
    usuario: req.session.passport.user,
    nroregistros: 0,
    nombre1: '',
    control1: 'inicio de carga',
    nombre2: '',
    control2: '',
    borrado: 1
  }).then(function (detallecargas) {
    res.json({ error_code: 0, id: detallecargas.id, message: 'inicio carga', success: true });
  }).catch(function (err) {
    logger.error(err)
    res.json({ error_code: 1, id: 0, message: err, success: false });
  });

}

exports.archivo = function (req, res) {

  if (req.method === 'POST') {

    var busboy = new Busboy({ headers: req.headers });

    var awaitId = new Promise(function (resolve, reject) {

      busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        if (fieldname === 'id') {
          try {
            resolve(val)
          } catch (err) {
            return reject(err);
          }
        } else {
          return;
        }
      });
    });

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {//manejador upload archivo

      var saveTo = path.join(__dirname, '..', 'temp', filename);//path al archivo

      file.pipe(fs.createWriteStream(saveTo)); //aqui lo guarda

      var input = fs.createReadStream(saveTo); //ahora lo lee

      var parser = csv.parse({
        columns: true,
        relax: true,
        delimiter: ';'
      }); //parser CSV

      awaitId.then(function (idDetail) {

        var carrusel = [];

        parser.on('readable', function () {
          while (line = parser.read()) {
            carrusel.push(line);
            /*
            var length = carrusel.push(line);
            if (length % 1000 == 0) {
              logger.debug(length);
            }*/
          }
        });

        parser.on('error', function (err) {
          logger.error(err.message);
        });/*error*/

        parser.on('end', function (count) {

          co(function* () {
            models.detallecargas.belongsTo(models.logcargas, { foreignKey: 'idlogcargas' });
            var carga = yield models.detallecargas.findAll({
              limit: 1,
              where: { id: idDetail },
              include: [{
                model: models.logcargas
              }]
            }).catch(function (err) {
              logger.error(err);
            });

            //logger.debug(carga[0].dataValues.logcarga.dataValues.archivo)

            var table = carga[0].dataValues.logcarga.dataValues.archivo//Troya
            var deleted = carga[0].dataValues.logcarga.dataValues.tipocarga//Reemplaza o Incremental

            bulk.bulkLoad(table.split(" ").join(""), carrusel, idDetail, saveTo, deleted, function (err, data) {
              if (err) {
                logger.debug("->>> " + err)
              } else {
                logger.debug("->>> " + data)
                res.json({ error_code: 0, message: 'termino la carga de troya', success: true });
              }
            })

          }).catch(function (err) {//co(*)
            logger.error(err)
          })

        });/*end*/

      }).catch(function (err) {
        logger.error(err)
      });


      input.pipe(parser);

    });


    busboy.on('finish', function () {
      logger.debug("Finalizo la transferencia del archivo")
      //res.json({ error_code: 0, message: 'termino la carga de troya', success: true });
    });

    return req.pipe(busboy);
  }

}

