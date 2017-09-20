'use strict';
var models = require('../../models');
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
    base.list(req, res, entity, [], function (data) {
        return data;
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