'use strict';
var models = require('../../models');
var base = require('./lic-controller');

var entity = models.compra;
entity.belongsTo(models.estructuracui, { foreignKey: 'idCui' });
entity.belongsTo(models.moneda, { foreignKey: 'idMoneda' });
entity.belongsTo(models.proveedor, { foreignKey: 'idProveedor' });

function map(req) {
    return {
        id: req.body.id || 0,
        idProducto: req.body.idProducto || req.params.pId,
        contrato: req.body.contrato,
        ordenCompra: req.body.ordenCompra,
        idCui: req.body.idCui,
        sap: req.body.sap,
        idProveedor: req.body.idProveedor,
        fechaCompra: req.body.fechaCompra,
        fechaExpiracion: req.body.fechaExpiracion,
        licCompradas: req.body.licCompradas,
        canSoporte: req.body.canSoporte,
        idMoneda: req.body.idMoneda,
        valorLicencia: req.body.valorLicencia,
        valorSoporte: req.body.valorSoporte,
        fechaRenovaSoporte: req.body.fechaRenovaSoporte,
        factura: req.body.factura,
        comprador: req.body.comprador,
        correoComprador: req.body.correoComprador
    }
}
function mapper(data){
    return data;
}

var includes = [
    {
        model: models.estructuracui
    }, {
        model: models.moneda
    }, {
        model: models.proveedor
    }
];

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idProducto', includes, mapper);
}
function list(req, res) {
    base.list(req, res, entity,  includes, mapper);
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
    listChilds: listChilds,
    action: action
};