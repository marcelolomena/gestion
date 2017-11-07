'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.reserva;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.estructuracuibch, {
    foreignKey: 'idCui'
});
entity.hasMany(models.compra, {
    sourceKey: 'id',
    foreignKey: 'idProducto'
});


var includes = [{
        model: models.producto
    }, {
        model: models.estructuracuibch
    },
    {
        model: models.compra
    }
];

function map(req) {
    return {
        id: req.body.id || 0,
        idProducto: req.body.idProducto || req.params.pId,
        numero: req.body.numero,
        fechaEstimada: base.toDate(req.body.fechaEstimada),
        idCui: req.body.idCui,
        comentario: req.body.comentario,
        estado: req.body.estado
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idProducto: item.idProducto,
            producto: {
                nombre: item.producto.nombre
            },
            numero: item.numero,
            fechaEstimada: base.fromDate(item.fechaEstimada),
            idCui: item.idCui,
            cui: {
                cui: item.estructuracuibch.cui,
                unidad: item.estructuracuibch.unidad,
                
                cuipadre: item.estructuracuibch.cuipadre
            },
            comentario: item.comentario,
            estado: item.estado ? 'Pendiente' : 'Reservado'
        }
    });
}

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
};