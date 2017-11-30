'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.recepcion;
entity.belongsTo(models.proveedor, { foreignKey: 'idProveedor' });
entity.belongsTo(models.estructuracuibch, { foreignKey: 'cui', targetKey: 'cui' });
entity.belongsTo(models.presupuestoenvuelo, { foreignKey: 'sap', targetKey: 'sap' });
var includes = [
    {
        model: models.proveedor
    }, {
        model: models.estructuracuibch
    }, {
        model: models.presupuestoenvuelo
    }
];

function map(req) {
    return {
        id: parseInt(req.body.id) || 0,
        nombre: req.body.nombre,
        sap: req.body.sap ? parseInt(req.body.sap) : null,
        cui: req.body.idCui ? parseInt(req.body.idCui) : null,
        numContrato: req.body.numContrato ? parseInt(req.body.numContrato) : null,
        ordenCompra: req.body.ordenCompra ? parseInt(req.body.ordenCompra) : null,
        idProveedor: parseInt(req.body.idProveedor),
        comprador: req.body.comprador,
        comentario: req.body.comentario,
        fecha: req.body.fecha || base.now(),
        idCompraTramite : req.body.idCompraTramite ? parseInt(req.body.idCompraTramite) : null
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            nombre: item.nombre,
            sap: item.sap,
            nombreSap: item.presupuestoenvuelo ? item.presupuestoenvuelo.nombreproyecto : '',
            idCui: item.cui,
            nombreCui: item.estructuracuibch ? item.estructuracuibch.unidad : '',
            numContrato: item.numContrato,
            ordenCompra: item.ordenCompra,
            idProveedor: item.idProveedor,
            proveedor: { nombre: item.proveedor.razonsocial },
            comprador: item.comprador,
            comentario: item.comentario,
            fecha: item.fecha,
            idCompraTramite: item.idCompraTramite
        };
    });
}
function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}
function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            var pp = map(req);
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function listCompras(req, res) {
    var ntt = models.compraTramite;
    base.list(req, res, ntt, [{
        model: models.proveedor
    },{
        model: models.estructuracuibch 
    }], function (data) {
        var result = [];
        _.each(data, function (item) {
            if (item.estado === 1) {
                result.push({
                    id: item.id,
                    nombre: item.nombre,
                    sap: item.sap,
                    idCui: item.cui,
                    numContrato: item.numContrato,
                    ordenCompra: item.ordenCompra,
                    idProveedor: item.idProveedor,
                    comprador: item.comprador,
                    comentario: item.comentario
                });
            }
        });
        return result;
    })
}
module.exports = {
    list: list,
    action: action,
    listCompras: listCompras
}