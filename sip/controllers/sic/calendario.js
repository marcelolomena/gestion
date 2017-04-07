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
    var fechaesperada = req.body.fechanueva;
    var fechareal = req.body.fechanuevar;

       /* if (req.body.fechaesperada != "") {
            var d = new Date(req.body.fechaesperada)
            logger.debug("la fecha rql antes: " + d)

            //d.setUTCHours(1)
            logger.debug("la fecha rql convertida: " + d)
            var dformat = [d.getDate(),
            d.getMonth() + 1,
            d.getFullYear()].join('-') + ' ' +
                [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

            var fechaintermedia = new Date(dformat + ' UTC')

            fechaesperada = fechaintermedia

            logger.debug("la fecha rql despues: " + fechaesperada)
        }
        if (req.body.fechareal != "") {
            var d2 = new Date(req.body.fechareal)
            logger.debug("la fecha rql antes: " + d2)

            //d2.setUTCHours(1)
            logger.debug("la fecha rql convertida: " + d2)
            var dformat2 = [d2.getDate(),
            d2.getMonth() + 1,
            d2.getFullYear()].join('-') + ' ' +
                [d2.getHours(),
                d2.getMinutes(),
                d2.getSeconds()].join(':');

            var fechaintermedia2 = new Date(dformat2 + ' UTC')

            fechareal = fechaintermedia2

            logger.debug("la fecha rql despues: " + fechareal)

        }*/
    

    logger.debug("la fecha 1: " + fechaesperada)
    logger.debug("la fecha 2: " + fechareal)
    switch (action) {
        case "add":
            models.calendariosolicitud.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                descripcion: req.body.descripcion,
                fechaesperada: fechaesperada,
                observacion: req.body.observacion,
                idtiporesponsable: req.body.idtiporesponsable,
                borrado: 1,
                fechareal: fechareal
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
                return res.json({ id: serviciosrequeridos.id, parent: req.body.idsolicitudcotizacion, message: 'Insertando', success: true });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ id: 0, message: err.message, success: false });
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
                            fechaesperada: fechaesperada,
                            observacion: req.body.observacion,
                            idtiporesponsable: req.body.idtiporesponsable,
                            fechareal: fechareal,
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (serviciosrequeridos) {

                                return res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ id: 0, message: err.message, success: false });
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
                            return res.json({ error: 0, glosa: '' });

                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({ id: 0, message: err.message, success: false });
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
                    order: 'fechareal desc',
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
            return res.json(rows);
        });

};


