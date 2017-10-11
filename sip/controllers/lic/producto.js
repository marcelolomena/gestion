'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.producto;
entity.belongsTo(models.fabricante, { foreignKey: 'idFabricante' });
entity.belongsTo(models.clasificacion, { foreignKey: 'idClasificacion' });
entity.belongsTo(models.tipoInstalacion, { foreignKey: 'idTipoInstalacion' });
entity.belongsTo(models.tipoLicenciamiento, { foreignKey: 'idTipoLicenciamiento' });
function map(req) {
    return {
        id: req.body.id || 0,
        idFabricante: req.body.idFabricante,
        nombre: req.body.nombre,
        idTipoInstalacion: req.body.idTipoInstalacion,
        idClasificacion: req.body.idClasificacion,
        idTipoLicenciamiento: req.body.idTipoLicenciamiento,
        licStock: req.body.licStock,
        licOcupadas: req.body.licOcupadas,
        alertaRenovacion: req.body.alertaRenovacion,
        utilidad: req.body.utilidad,
        comentarios: req.body.comentarios,
        licTramite: req.body.licTramite
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idFabricante: item.idFabricante,
            nombre: item.nombre,
            idTipoInstalacion: item.idTipoInstalacion,
            idClasificacion: item.idClasificacion,
            idTipoLicenciamiento: item.idTipoLicenciamiento,
            licStock: item.licStock,
            licOcupadas: item.licOcupadas,
            // alertaRenovacion: item.alertaRenovacion ? 'Al día' : 'Vencida',
            // utilidad: item.utilidad,
            comentarios: item.comentarios,
            fabricante: { nombre: item.fabricante.nombre },
            clasificacion: { nombre: item.clasificacion.nombre },
            tipoInstalacion: { nombre: item.tipoInstalacion.nombre },
            tipoLicenciamiento: { nombre: item.tipoLicenciamiento.nombre },
            licTramite: item.licTramite,
        }
    });
}
var includes = [
    {
        model: models.fabricante
    }, {
        model: models.clasificacion
    }, {
        model: models.tipoInstalacion
    }, {
        model: models.tipoLicenciamiento
    }
];

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.nombre
        };
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
    action: action,
    listAll: listAll
}