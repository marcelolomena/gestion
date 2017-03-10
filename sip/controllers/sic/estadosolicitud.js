var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;
    if (action != "del") {
        if (req.body.fecha != "" )
            fecha = req.body.fecha.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.estadosolicitud.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idcolor: req.body.idcolor,
                comentario: req.body.comentario,
                fecha: fecha,
                borrado: 1
            }).then(function (estadosolicitud) {

                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'estadosolicitud',
                    estadosolicitud.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.estadosolicitud,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: estadosolicitud.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: estadosolicitud.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });

            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false });
            });
            break;
        case "edit":

            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'estadosolicitud',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.estadosolicitud,
                function (err, data) {
                    if (!err) {
                        models.estadosolicitud.update({
                            idtipodocumento: req.body.idtipodocumento,
                            idcolor: req.body.idcolor,
                            comentario: req.body.comentario,
                            fecha: fecha,
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (estadosolicitud) {
                                res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });

            break;
        case "del":

            models.estadosolicitud.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (estadosolicitud) {

                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'estadosolicitud',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.estadosolicitud,
                    function (err, data) {
                        if (!err) {
                            models.estadosolicitud.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });

            }).catch(function (err) {
                logger.error(err);
                res.json({ message: err.message, success: false });
            });

            break;
    }
}

exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "fecha";

    if (!sord)
        sord = "desc";

    var orden = "[estadosolicitud]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.estadosolicitud.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.estadosolicitud.belongsTo(models.valores, { foreignKey: 'idcolor' });
            models.estadosolicitud.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.estadosolicitud.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.solicitudcotizacion
                    }, { model: models.valores }
                    ]
                }).then(function (estadosolicitud) {
                    return res.json({ records: records, total: total, page: page, rows: estadosolicitud });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};