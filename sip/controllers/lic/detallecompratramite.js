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
entity.belongsTo(models.producto, { foreignKey: 'idProducto'});
function map(req) {
    return {
        id: req.body.id || 0,
        idCompraTramite: req.body.idCompraTramite,
        nombre: req.body.nombre,
        fechaInicio: req.body.fechaInicio,
        fechaTermino: req.body.fechaTermino,
        fechaControl: req.body.fechaControl,
        monto: req.body.monto,
        idMoneda: req.body.idMoneda,
        numsolicitud: req.body.numsolicitud,
        nombre: req.body.nombre,
        numero: req.body.numero,
        idProducto: req.body.idProducto
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idCompraTramite: item.idCompraTramite,
            fechaInicio: item.fechaInicio,
            fechaTermino: item.fechaTermino,
            fechaControl: item.fechaControl,
            monto: item.monto,
            idMoneda: item.idMoneda,
            comentario: item.comentario,
            numsolicitud: item.numsolicitud,
            nombre: item.nombre,
            numero: item.numero,
            compraTramite: {
                nombre: item.compraTramite.nombre
            },
            moneda: {
                nombre: item.moneda.nombre
            },
            producto: {
                nombre: item.producto.nombre
            }
        }
    });
}
var includes = [{
    model: models.compraTramite,
    model: models.moneda,
    model: models.producto
}];


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
    listChilds: listChilds,
    action: action
}