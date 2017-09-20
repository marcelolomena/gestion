'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.compra;
function map(req) {
    return {
        id: req.body.id || 0,
        idLicencia: req.body.idLicencia,
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

function list(req, res) {

    entity.belongsTo(models.estructuracui, { foreignKey: 'idCui' });
    entity.belongsTo(models.moneda, { foreignKey: 'idMoneda' });
    entity.belongsTo(models.proveedor, { foreignKey: 'idProveedor' });

    var includes = [{
        model: models.estructuracui
    }, {
        model: models.moneda
    }, {
        model: models.proveedor
    }];

    base.list(req, res, entity,includes, function (data) {
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