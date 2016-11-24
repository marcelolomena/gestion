var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.documentoscotizacion.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idtipodocumento: req.body.idtipodocumento,
                nombrecorto: req.body.idtipodocumento,
                descripcionlarga: req.session.passport.user,
                nombreresponsable: 0,
                nombrearchivo: '',
                borrado: 1
            }).then(function (documentoscotizacion) {
                res.json({ id: documentoscotizacion.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });
            break;
        case "edit":
            models.documentoscotizacion.update({
                idtipodocumento: req.body.idtipodocumento,
                nombrecorto: req.body.idtipodocumento,
                descripcionlarga: req.session.passport.user,
                nombreresponsable: 0,
                nombrearchivo: ''
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (documentoscotizacion) {
                    res.json({ id: documentoscotizacion.id, message: 'Exito', success: true });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ id: 0, message: err.message, success: false });
                });
            break;
        case "del":
            models.documentoscotizacion.destroy({
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
                res.json({ id: 0, message: err.message, success: false });
            });

            break;
    }
}


exports.list = function (req, res) {

    //var id = req.params.id;
    logger.debug("ID DOC : " + req.params.id)
    logger.debug("PAGE : " + req.query.page)
    //documentoscotizacion

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;


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


    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
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

        var awaitParent = new Promise(function (resolve, reject) {

            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'parent') {
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
                logger.debug("idDetail : " + idDetail)
                models.documentoscotizacion.update({
                    nombrearchivo: filename
                }, {
                        where: {
                            id: idDetail
                        }
                    }).then(function (documentoscotizacion) {
                        //res.json({ id: documentoscotizacion.id, message: 'Exito', success: true });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({ id: 0, message: err.message, success: false });
                    });

            }).catch(function (err) {
                res.json({ error_code: 1, message: err.message, success: false });
                logger.error(err)
            });


        });


        busboy.on('finish', function () {
            logger.debug("Finalizo la transferencia del archivo")

            res.json({ error_code: 0, message: 'Archivo guardado', success: true });
        });

        return req.pipe(busboy);
    }

}