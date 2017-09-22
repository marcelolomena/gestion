'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.producto;
entity.belongsTo(models.fabricante, { foreignKey: 'idFabricante' });
entity.belongsTo(models.clasificacion, { foreignKey: 'idClasificacion' });
entity.belongsTo(models.tipoInstalacion, { foreignKey: 'idTipoInstalacion' });
entity.belongsTo(models.tipoLicenciamiento, { foreignKey: 'idTipoLicenciamiento' });
entity.hasMany(models.compra, { sourceKey: 'id', foreignKey: 'idProducto' })
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
        comentarios: req.body.comentarios
    }
}
function mapper(data) {
    var result = [];
    _.each(data, function (item) {
        if (item.compras) {
            _.each(item.compras, function (sItem) {
                result.push( {
                    id: sItem.id,
                    contrato: sItem.contrato,
                    ordenCompra: sItem.ordenCompra,
                    idCui: sItem.idCui,
                    sap: sItem.sap,
                    idFabricante: item.idFabricante,
                    idProveedor: sItem.idProveedor,
                    nombre: item.nombre,
                    idTipoInstalacion: item.idTipoInstalacion,
                    idClasificacion: item.idClasificacion,
                    idTipoLicenciamiento: item.idTipoLicenciamiento,
                    licStock: item.licStock,
                    licOcupadas: item.licOcupadas,
                    fechaCompra: sItem.fechaCompra,
                    fechaExpiracion: sItem.fechaExpiracion,
                    licCompradas: sItem.licCompradas,
                    cantidadSoporte: sItem.cantidadSoporte,
                    idMoneda: sItem.idMoneda,
                    valorLicencia: sItem.valorLicencia,
                    valorSoporte: sItem.valorSoporte,
                    fechaRenovaSoporte: sItem.fechaRenovaSoporte,
                    factura: sItem.factura,
                    comprador: sItem.comprador,
                    correoComprador: sItem.correoComprador,

                    alertaRenovacion: item.alertaRenovacion ? 'Al día' : 'Vencida',
                    utilidad: item.utilidad,
                    comentarios: item.comentarios,
                    fabricante: { nombre: item.fabricante.nombre },
                    clasificacion: { nombre: item.clasificacion.nombre },
                    tipoInstalacion: { nombre: item.tipoInstalacion.nombre },
                    tipoLicenciamiento: { nombre: item.tipoLicenciamiento.nombre },
                    moneda: { nombre: sItem.moneda.moneda },
                    estructuracui: { nombre: sItem.estructuracui ? sItem.estructuracui.cui : ''},
                    proveedor: { nombre: sItem.proveedor.razonsocial }
                });
            });
        }
    });
    return result;
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
    }, {
        model: models.compra,
        include: [
            {
                model: models.estructuracui
            }, {
                model: models.moneda
            }, {
                model: models.proveedor
            }
        ]
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
    action: action
}