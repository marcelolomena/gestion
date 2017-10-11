'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.detalleCompraTramite;
entity.belongsTo(models.moneda, {
    foreignKey: 'idMoneda'
});
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});

function map(req) {
    return {
        id: req.body.id || 0,
        idCompraTramite: req.body.idCompraTramite || req.params.pId,
        nombre: req.body.nombre,
        fechaInicio: base.toDate(req.body.fechaInicio),
        fechaTermino: base.toDate(req.body.fechaTermino),
        fechaControl: base.toDate(req.body.fechaControl),
        monto: req.body.monto,
        idMoneda: req.body.idMoneda,
        comentario: req.body.comentario,
        nombre: req.body.nombre,
        numero: req.body.numero,
        idProducto: req.body.idProducto
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            fechaInicio: base.fromDate(item.fechaInicio),
            fechaTermino: base.fromDate(item.fechaTermino),
            fechaControl: base.fromDate(item.fechaControl),
            monto: item.monto,
            idMoneda: item.idMoneda,
            comentario: item.comentario,
            numsolicitud: item.numsolicitud,
            nombrenew: item.nombre,
            numero: item.numero,
            moneda: {
                nombre: item.moneda.moneda
            },
            producto: {
                nombre: item.producto.nombre
            }
        }
    });
}
var includes = [{
        model: models.moneda
    },
    {
        model: models.producto
    }

];

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