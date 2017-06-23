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

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.solicitudcontrato.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.solicitudcontrato.belongsTo(models.serviciosrequeridos, { foreignKey: 'idserviciorequerido' });
            models.serviciosrequeridos.belongsTo(models.servicio, { foreignKey: 'idservicio' });
            models.solicitudcontrato.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.solicitudcontrato.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.solicitudcontrato.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    },
                    {
                        model: models.serviciosrequeridos,
                        include: [{
                            model: models.servicio
                        }]
                    }
                    ]

                }).then(function (solicitudcontrato) {
                    return res.json({ records: records, total: total, page: page, rows: solicitudcontrato });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.action = function (req, res) {
    var action = req.body.oper;
    var costototal = req.body.costototal

    var fecha = req.body.fechaadjudicacion

    if (action != "del") {
        if (fecha != "")
            fecha = fecha.split("-").reverse().join("-")
    }
    switch (action) {
        case "edit":
            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'solicitudcontrato',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.solicitudcontrato,
                function (err, data) {
                    if (!err) {
                        models.solicitudcontrato.update({

                            descripcion: req.body.descripcion
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (solicitudcontrato) {
                                return res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });
            break;
    }
}


exports.guardarcontrato = function (req, res) {

    var idsolicitudcontrato = req.params.id
    console.log(idsolicitudcontrato)
    return models.solicitudcontrato.findOne({
        //attributes: ['id', 'descripcion', 'numerorfp'],
        where: { id: idsolicitudcontrato }
    }).then(function (solicitudcontrato) {
        sequelize.query('EXECUTE sic.laviejaconfiable2 ' + idsolicitudcontrato)
    }).catch(function (err) {
        logger.error(err.message);
        console.log("Error al buscar Solicitud:" + err)
        throw new Error(err);
    });
}


