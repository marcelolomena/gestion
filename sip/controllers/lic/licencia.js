'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.producto;
function map(req) {
    return {
        id: req.body.id || 0,
        idFabricante: req.body.idFabricante,
        nombre :req.body.nombre,
        idTipoInstalacion: req.body.idTipoInstalacion,
        idClasificacion: req.body.idClasificacion,
        idTipoLicenciamiento: req.body.idTipoLicenciamiento,
        licStock: req.body.licStock,
        licOcupadas: req.body.licOcupadas,
        alertaRenovacion: req.body.alertaRenovacion,
        utilidad: req.body.utilidad,
        comentarios: req.body.comentarios
    }
}

function list(req, res) {

    entity.belongsTo(models.fabricante, { foreignKey: 'idFabricante' });
    entity.belongsTo(models.clasificacion, { foreignKey: 'idClasificacion' });
    entity.belongsTo(models.tipoInstalacion, { foreignKey: 'idTipoInstalacion' });
    entity.belongsTo(models.tipoLicenciamiento, { foreignKey: 'idTipoLicenciamiento' });

    var includes = [{
        model: models.fabricante
    }, {
        model: models.clasificacion
    }, {
        model: models.tipoInstalacion
    }, {
        model: models.tipoLicenciamiento
    }];

    base.list(req, res, entity, includes, function (data) {
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
}