'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.compraTramite;
entity.belongsTo(models.proveedor, {
    foreignKey: 'idProveedor'
});
entity.belongsTo(models.estructuracuibch, {
    foreignKey: 'cui', targetKey: 'cui'
});
var includes = [{
        model: models.proveedor
    },
    {
        model: models.estructuracuibch
    }
];

function map(req) {
    return {
        id: req.body.id,
        nombre: req.body.nombre,
        idProveedor: parseInt(req.body.idProveedor),
        numContrato: req.body.numContrato ? parseInt(req.body.numContrato) : null,
        ordenCompra: req.body.ordenCompra ? parseInt(req.body.ordenCompra) : null,
        comprador: req.body.comprador,
        origen: req.body.origen,
        borrado: 1,
        cui: req.body.idCui ? parseInt(req.body.idCui) : null,
        sap: req.body.sap ? parseInt(req.body.sap) : null,
        estado: 1,
        comentario: req.body.comentario
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        var result = {
            id: item.id,
            nombre: item.nombre,
            idProveedor: item.idProveedor,
            numContrato: item.numContrato,
            ordenCompra: item.ordenCompra,
            comprador: item.comprador,
            origen: item.origen,
            idCui: item.cui,
            sap: item.sap,
            nombreCui: item.estructuracuibch ? item.estructuracuibch.unidad : '',
            proveedor: {
                nombre: item.proveedor.razonsocial
            },
            estado: item.estado ? 'En Trámite' : 'Recepcionado',
            comentario: item.comentario
        };
        return result;

    });
}


function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idCompraTramite', includes, mapper);
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