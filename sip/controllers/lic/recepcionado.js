'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.recepcionado;
entity.belongsTo(models.detalleCompraTramite, {
    foreignKey: 'idDetalleCompraTramite'
});


function map(req) {
    return {
        id: req.body.id || 0,
        idDetalleCompraTramite: req.body.idDetalleCompraTramite || req.params.pId,
        
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id
        }
    });
}
var includes = [{
    model: models.detalleCompraTramite
}
];

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idDetalleCompraTramite', includes, mapper);
}

function mapProducto(data) { 
    return {nombre:data.nombre, idFabricante:data.idFabricante, licTramite:data.numero};
}

function listRecepcionados(req, res) {
    var ntt = models.detalleRecepcion;
    base.listChilds(req, res, ntt, 'numsolicitud', [{
        model: models.producto
    }], function (data) {
        var result = [];
        _.each(data, function (item) {
            
                var row = {
                    id: item.id,
                    nombre: item.producto.nombre
                };
                result.push(row);
        });
        return result;
    })
}

module.exports = {
    listChilds: listChilds,
    listRecepcionados: listRecepcionados
}