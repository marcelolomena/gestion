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
    sidx = "horafin";

  if (!sord)
    sord = "desc";

  var orden = "[Contrato]." + sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.cargadte.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.cargadte.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
                      model: models.proveedor
                    },{
                      model: models.contactoproveedor
                    }
          ]
        }).then(function (contratos) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

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


exports.guardar = function (req, res) {
  logger.debug(req.body.fechaarchivo)

  models.logcargas.update({
    fechaarchivo: req.body.fechaarchivo.split("-").reverse().join("-"),
  }, {
      where: { id: req.body.id }
    }).then(function (logcargas) {

      models.detallecargas.create({
        idlogcargas: req.body.id,
        fechaarchivo: req.body.fechaarchivo.split("-").reverse().join("-"),
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

    }).catch(function (err) {
      logger.error(err);
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

      awaitId.then(function (idDetail) {

        var carrusel = [];

        var input = fs.createReadStream(saveTo, 'utf8'); //ahora lo lee

        input.on('error', function (err) {
          logger.error(err);
          res.json({ error_code: 1, message: err, success: false });
        });

        var parser = csv.parse({
          delimiter: ';',
          columns: true,
          relax: true,
          relax_column_count: true,
          skip_empty_lines: true,
          trim: true
        }); //parser CSV       

        input.pipe(parser);

        parser.on('readable', function () {
          var line
          while (line = parser.read()) {
            carrusel.push(line);
           }
        });

        parser.on('error', function (err) {
          logger.error(err);
          res.json({ error_code: 1, message: err, success: false });
        });/*error*/

        //parser.on('end', function (count) {
        parser.on('finish', function () {
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
            var dateLoad = carga[0].dataValues.logcarga.dataValues.fechaarchivo//Reemplaza o Incremental

            bulk.bulkLoad(table.split(" ").join(""), carrusel, idDetail, saveTo, deleted, dateLoad, function (err, data) {
              if (err) {
                logger.error("->>> " + err)
                res.json({ error_code: 1, message: err, success: false });
              } else {
                logger.debug("->>> " + data)
                res.json({ error_code: 0, message: data, success: true });
              }
            })

          }).catch(function (err) {//co(*)
            res.json({ error_code: 1, message: err, success: false });
            logger.error(err)
          })

        });/*end*/

        //parser.end();

      }).catch(function (err) {
        res.json({ error_code: 1, message: err, success: false });
        logger.error(err)
      });

    });


    busboy.on('finish', function () {
      logger.debug("Finalizo la transferencia del archivo")
    });

    return req.pipe(busboy);
  }

}

