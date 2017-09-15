'use strict';
var models = require('../../models');
// var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require('../../utils/logger');
var base = require('./lic-controller');


var entity = models.licencia;
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
    var sidx = req.query.sidx || 'id';
    var sord = req.query.sord || 'desc';
    var orden = entity.name + '.' + sidx + ' ' + sord;
    var whereClause = base.where(filters);

    entity.belongsTo(models.fabricante, { foreignKey: 'idFabricante' });
    entity.belongsTo(models.clasificacion, { foreignKey: 'idClasificacion' });
    entity.belongsTo(models.tipoInstalacion, { foreignKey: 'idTipoInstalacion' });
    entity.belongsTo(models.tipoLicenciamiento, { foreignKey: 'idTipoLicenciamiento' });

    entity.count({
        where: whereClause
    })
    .then(function (records) {
        var total = Math.ceil(records / rows);
    entity.findAll({
        offset: parseInt(rows * (page - 1)),
        limit: parseInt(rows),
        order: orden,
        where: whereClause,
        include: [{
            model: models.fabricante
        }, {
            model: models.clasificacion
        }, {
            model: models.tipoInstalacion
        }, {
            model: models.tipoLicenciamiento
        }]
    })
    .then(function (data) {
        return res.json({ records: records, total: total, page: page, rows: data });
    })
    })
    .catch(function (err) {
        logger.error(err.message);
        res.json({ error_code: 1 });
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
}