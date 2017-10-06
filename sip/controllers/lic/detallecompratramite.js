'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.detalleCompraTramite;
entity.belongsTo(models.compraTramite, {
    foreignKey: 'idCompraTramite'
});
entity.belongsTo(models.moneda, {
    foreignKey: 'idMoneda'
});

function map(req) {
    return {
        id: req.body.id || 0,
        idCompraTramite: req.body.idCompraTramite,
        cui: req.body.cui || null,
        sap: req.body.sap || null,
        nombre: req.body.nombre,
        fechaInicio: req.body.fechaInicio,
        fechaTermino: req.body.fechaTermino,
        fechaControl: req.body.fechaControl,
        monto: req.body.monto,
        idMoneda: req.body.idMoneda,
        comentario: req.body.comentario
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idCompraTramite: item.idCompraTramite,
            cui: item.cui || null,
            sap: item.sap || null,
            nombre: item.nombre,
            fechaInicio: item.fechaInicio,
            fechaTermino: item.fechaTermino,
            fechaControl: item.fechaControl,
            monto: item.monto,
            idMoneda: item.idMoneda,
            comentario: item.comentario,
            compraTramite: {
                nombre: item.compraTramite.nombre
            },
            moneda: {
                nombre: item.moneda.nombre
            }
        }
    });
}
var includes = [{
    model: models.compraTramite,
    model: models.moneda
}];

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
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
    // action: action
}