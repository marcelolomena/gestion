'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.compraTramite;
entity.belongsTo(models.proveedor, { foreignKey: 'idProveedor' });
function map(req) {
    return {
        id: req.body.id || 0,
        nombre: req.body.nombre,
        idProveedor: req.body.idProveedor,
        numContrato: req.body.numContrato,
        comprador: req.body.comprador,
        origen: req.body.origen,
        borrado: 1
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            nombre: item.nombre,
            idProveedor: item.idProveedor,
            numContrato: item.numContrato,
            comprador: item.comprador,
            origen: item.origen,
            proveedor: { nombre: item.proveedor.nombre }
        }
    });
}
var includes = [
    {
        model: models.proveedor
    }
];

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