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

    switch (action) {
        case "add":
            models.participanteproveedor.create({
                idsolicitudcotizacion: req.body.parent_id,
                idproveedor: req.body.idproveedor,
                nombre: req.body.nombre,
                cargo: req.body.cargo,
                borrado: 1
            }).then(function (foro) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'participanteproveedor',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.participanteproveedor,
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
            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'participanteproveedor',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.participanteproveedor,
                function (err, data) {
                    if (!err) {
                        models.participanteproveedor.update({

                            nombre: req.body.nombre,
                            cargo: req.body.cargo
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
            models.participanteproveedor.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (respuesta) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'participanteproveedor',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.participanteproveedor,
                    function (err, data) {
                        if (!err) {
                            models.participanteproveedor.destroy({
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
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.participanteproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.participanteproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.participanteproveedor.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.participanteproveedor.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }]

                }).then(function (participanteproveedor) {
                    return res.json({ records: records, total: total, page: page, rows: participanteproveedor });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};