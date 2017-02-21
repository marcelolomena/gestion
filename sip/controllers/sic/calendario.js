var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var bitacora = require("../../utils/bitacora");
var co = require('co');

exports.action = function (req, res) {
    var action = req.body.oper;
    var fechatermino;

    if (action != "del") {
        if (req.body.fechatermino != "")
            fechatermino = req.body.fechatermino.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.calendariosolicitud.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                descripcion: req.body.descripcion,
                fechatermino: fechatermino,
                observacion: req.body.observacion,
                idtiporesponsable: req.body.idtiporesponsable,
                borrado: 1
            }).then(function (serviciosrequeridos) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'calendariosolicitud',
                    serviciosrequeridos.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.calendariosolicitud,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
                res.json({ id: serviciosrequeridos.id, parent: req.body.idsolicitudcotizacion, message: 'Insertando', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });
            break;
        case "edit":

            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'calendariosolicitud',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.calendariosolicitud, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.calendariosolicitud.update({
                            descripcion: req.body.descripcion,
                            fechatermino: fechatermino,
                            observacion: req.body.observacion,
                            idtiporesponsable: req.body.idtiporesponsable,
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (serviciosrequeridos) {

                                res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }

                });


            break;
        case "del":


            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'calendariosolicitud',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.calendariosolicitud, function (err, data) {
                    if (data) {

                        models.calendariosolicitud.destroy({
                            where: {
                                id: req.body.id
                            }
                        }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted

                            if (rowDeleted === 1) {


                                logger.debug('Deleted successfully');
                            }
                            res.json({ error: 0, glosa: '' });

                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }

                });




            break;
    }
}


exports.list = function (req, res) {

    var id = req.params.id;
    logger.debug("ID SERV : " + id)
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

            models.calendariosolicitud.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.calendariosolicitud.belongsTo(models.valores, { foreignKey: 'idtiporesponsable' });
            models.calendariosolicitud.count({
                where: {
                    idsolicitudcotizacion: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.calendariosolicitud.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idsolicitudcotizacion: id
                    },
                    order: 'fechatermino desc',
                    include: [
                        {
                            model: models.valores
                        }
                    ]
                }).then(function (serviciosrequeridos) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({ records: records, total: total, page: page, rows: serviciosrequeridos });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });

};

exports.gettiporesponsable = function (req, res) {

    var sql = "select * from sic.valores where tipo='tiporesponsable' " +
        "and borrado=1 order by nombre";

    sequelize.query(sql)
        .spread(function (rows) {
            res.json(rows);
        });

};


