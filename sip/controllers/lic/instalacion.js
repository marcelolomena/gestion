'use strict';
var models = require('../../models');
var utilSeq = require('../../utils/seq');
var logger = require('../../utils/logger');
var base = require('./lic-controller');


var entity = models.instalacion;
function map(req) {
    return {
        id: req.body.id || 0,
        idFabricante: req.body.idFabricante,
        idTipoInstalacion: req.body.idTipoInstalacion,
        idClasificacion: req.body.idClasificacion,
        idTipoLicenciamiento: req.body.idTipoLicenciamiento,
        licStock: req.body.licStock,
        licDisponible: req.body.licDisponible,
        idAlertaRenovacion: req.body.idAlertaRenovacion,
        utilidad: req.body.utilidad,
        comentarios: req.body.comentarios,
        software: req.body.software,
        borrado: req.body.borrado || 1
    }
}

function list(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'numerorfp';
    var sord = req.query.sord || 'desc';

    var orden = entity.name + '.' + sidx + ' ' + sord;
    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            // models.solicitudcotizacion.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
            // models.solicitudcotizacion.belongsTo(models.programa, { foreignKey: 'program_id' });
            // models.solicitudcotizacion.belongsTo(models.user, { as: 'tecnico', foreignKey: 'idtecnico' });
            // models.solicitudcotizacion.belongsTo(models.valores, { as: 'clasificacion', foreignKey: 'idclasificacionsolicitud' });
            // models.solicitudcotizacion.belongsTo(models.user, { as: 'negociador', foreignKey: 'idnegociador' });
            // models.solicitudcotizacion.belongsTo(models.tipoclausula, { foreignKey: 'idtipo' });
            // models.solicitudcotizacion.belongsTo(models.valores, { as: 'grupo', foreignKey: 'idgrupo' });
            entity.count({
                // where: filter_one
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                entity.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    // where: filter_one,
                    // include: [{
                    //     model: models.estructuracui, where: filter_two
                    // }, {
                    //     model: models.programa
                    // }, {
                    //     model: models.user, as: 'tecnico', where: filter_three
                    // }, {
                    //     model: models.valores, as: 'clasificacion'
                    // }, {
                    //     model: models.user, as: 'negociador', where: filter_four
                    // }, {
                    //     model: models.tipoclausula
                    // }, {
                    //     model: models.valores, as: 'grupo'
                    // }
                    // ]
                }).then(function (data) {
                    return res.json({ records: records, total: total, page: page, rows: data });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}


module.exports = {
    list: list,
    action: action
};