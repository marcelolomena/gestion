var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var nodeExcel = require('excel-export');
var async = require('async');
var csv = require('csv');
var co = require('co');
var bulk = require("../../utils/bulk");
var nodeExcel = require('excel-export');

exports.action = function (req, res) {
    var action = req.body.oper;

    if (action != "del") {
        if (req.body.fecha != "")
            fecha = req.body.fecha.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.cotizacionservicio.create({
                idserviciorequerido: req.body.parent_id,
                idproveedor: req.body.idproveedor,
                idmoneda: req.body.idmoneda,
                fecha: fecha,
                comentario: req.body.comentario,
                borrado: 1
            }).then(function (foro) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'cotizacionservicio',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.cotizacionservicio,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    }
                )
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false })
            });
            break;
        case "edit":
            bitacora.registrarhijo(
                req.body.idsolicitudcotizacion,
                'cotizacionservicio',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.cotizacionservicio,
                function (err, data) {
                    if (!err) {
                        models.cotizacionservicio.update({
                            fecha: fecha,
                            comentario: req.body.comentario,
                            idmoneda: req.body.idmoneda
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (respuestaforo) {
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
            models.cotizacionservicio.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (respuesta) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'cotizacionservicio',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.cotizacionservicio,
                    function (err, data) {
                        if (!err) {
                            models.cotizacionservicio.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            })
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
        "field": "idserviciorequerido",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.cotizacionservicio.belongsTo(models.serviciosrequeridos, { foreignKey: 'idserviciorequerido' });
            models.cotizacionservicio.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.cotizacionservicio.belongsTo(models.moneda, { foreignKey: 'idmoneda' });
            models.cotizacionservicio.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.cotizacionservicio.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }, {
                        model: models.moneda
                    }]

                }).then(function (cotizacionservicio) {
                    return res.json({ records: records, total: total, page: page, rows: cotizacionservicio });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.proveedoressugeridosservicio = function (req, res) {

    var id = req.params.id;
    var sql = "select c.id, c.razonsocial from sic.proveedorsugerido a " +
        "join sip.proveedor c on c.id = a.idproveedor " +
        "where a.idserviciorequerido=" + id + "; "

    sequelize.query(sql)
        .spread(function (rows) {
            res.json(rows);
        });

};

exports.actionflujo = function (req, res) {
    var action = req.body.oper;
    var costoorigen = req.body.costoorigen
    logger.debug("costo origen: "+costoorigen)

    if (action != "del") {
        if (costoorigen != "")
            costoorigen = costoorigen.split(".").join("").replace(",", ".")
    }


    switch (action) {
        case "add":
            models.flujocotizacion.create({
                idcotizacion: req.body.parent_id,
                periodo: req.body.periodo,
                glosaitem: req.body.glosaitem,
                costoorigen: costoorigen,
                borrado: 1
            }).then(function (foro) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'flujocotizacion',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.flujocotizacion,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    }
                )
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false })
            });
            break;
        case "edit":
            bitacora.registrarhijo(
                req.body.idsolicitudcotizacion,
                'flujocotizacion',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.flujocotizacion,
                function (err, data) {
                    if (!err) {
                        models.flujocotizacion.update({
                            periodo: req.body.periodo,
                            glosaitem: req.body.glosaitem,
                            costoorigen: costoorigen,
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (respuestaforo) {
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
            models.flujocotizacion.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (respuesta) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'flujocotizacion',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.flujocotizacion,
                    function (err, data) {
                        if (!err) {
                            models.flujocotizacion.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            })
            break;
    }
}


exports.listflujo = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.flujocotizacion.belongsTo(models.cotizacionservicio, { foreignKey: 'idcotizacion' });
            models.flujocotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.flujocotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data

                }).then(function (cotizacionservicio) {
                    return res.json({ records: records, total: total, page: page, rows: cotizacionservicio });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
