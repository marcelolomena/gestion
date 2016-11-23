var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');


/*
exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.solicitudcotizacion.create({
        idcui: req.body.idcui,
        idtecnico: req.body.idtecnico,
        tipocontrato: req.body.tipocontrato,
        program_id: req.body.program_id,
        codigoart: req.body.codigoart,
        sap: req.body.sap,
        descripcion: req.body.descripcion,
        codigosolicitud: req.body.codigosolicitud,
        clasificacionsolicitud: req.body.clasificacionsolicitud,
        idnegociador: req.body.idnegociador,
        correonegociador: req.body.correonegociador,
        fononegociador: req.body.fononegociador,
        numerorfp: req.body.numerorfp,
        fechaenviorfp: req.body.fechaenviorfp,
        nombreinterlocutor1: req.body.nombreinterlocutor1,
        correointerlocutor1: req.body.correointerlocutor1,
        fonointerlocutor1: req.body.fonointerlocutor1,
        nombreinterlocutor2: req.body.nombreinterlocutor2,
        correointerlocutor2: req.body.correointerlocutor2,
        fonointerlocutor2: req.body.fonointerlocutor2,
        borrado: 1
      }).then(function (solicitudcotizacion) {
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.solicitudcotizacion.update({
        idcui: req.body.idcui,
        idtecnico: req.body.idtecnico,
        tipocontrato: req.body.tipocontrato,
        program_id: req.body.program_id,
        codigoart: req.body.codigoart,
        sap: req.body.sap,
        descripcion: req.body.descripcion,
        codigosolicitud: req.body.codigosolicitud,
        clasificacionsolicitud: req.body.clasificacionsolicitud,
        idnegociador: req.body.idnegociador,
        correonegociador: req.body.correonegociador,
        fononegociador: req.body.fononegociador,
        numerorfp: req.body.numerorfp,
        fechaenviorfp: req.body.fechaenviorfp,
        nombreinterlocutor1: req.body.nombreinterlocutor1,
        correointerlocutor1: req.body.correointerlocutor1,
        fonointerlocutor1: req.body.fonointerlocutor1,
        nombreinterlocutor2: req.body.nombreinterlocutor2,
        correointerlocutor2: req.body.correointerlocutor2,
        fonointerlocutor2: req.body.fonointerlocutor2
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contrato) {
          res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.solicitudcotizacion.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;

  }
}
*/

exports.list = function (req, res) {

    var id = req.params.id;
    logger.debug("ID DOC : " + id)
    //documentoscotizacion

    var page = 1
    var rows = 10
    var filters = req.params.filters
    /*
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
  
    if (!sidx)
      sidx = "descripcion";
  
    if (!sord)
      sord = "asc";
  
    var orden = "[solicitudcotizacion]." + sidx + " " + sord;
    */

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)

            models.documentoscotizacion.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.documentoscotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.documentoscotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    //atributes: ['id', 'idsolicitudcotizacion'],
                    where: data,
                    include: [{
                        model: models.solicitudcotizacion
                    }
                    ]
                }).then(function (documentoscotizacion) {
                    //logger.debug(solicitudcotizacion)
                    res.json({ records: records, total: total, page: page, rows: documentoscotizacion });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};


exports.save = function (req, res) {

    models.documentoscotizacion.create({
        idsolicitudcotizacion: req.body.id,
        idtipodocumento: req.body.idtipodocumento,
        nombrecorto: req.body.idtipodocumento,
        descripcionlarga: req.session.passport.user,
        nombreresponsable: 0,
        nombrearchivo: '',
        borrado: 1
    }).then(function (documentoscotizacion) {
        res.json({ id: documentoscotizacion.id, message: 'Exito', success: true });
    }).catch(function (err) {
        logger.error(err)
        res.json({ id: 0, message: err.message, success: false });
    });
}

exports.upload = function (req, res) {

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

            var saveTo = path.join(__dirname, '../../', 'docs', filename);//path al archivo

            file.pipe(fs.createWriteStream(saveTo)); //aqui lo guarda

            awaitId.then(function (idDetail) {

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