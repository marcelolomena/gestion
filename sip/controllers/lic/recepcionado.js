'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.recepcionado;
entity.belongsTo(models.detalleCompraTramite, {
    foreignKey: 'idDetalleCompraTramite'
});
entity.belongsTo(models.fabricante, {
    foreignKey: 'idfabricante'
});

var includes = [
    {
        model: models.proveedor
    },
    {
        model: models.fabricante
    },
    {
        model: models.producto
    },
    {
        model: models.moneda
    }
];


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
        model: models.producto,
        model: models.fabricante,
        model: models.moneda
    }], function (data) {
        var result = [];
        _.each(data, function (item) {
            
                var row = {
                    id: item.id,
                    producto: item.nombre,
                    idFabricante: item.idFabricante,
                    fechaInicio: base.fromDate(item.fechaInicio),
                    fechaTermino: base.fromDate(item.fechaTermino),
                    fechaControl: base.fromDate(item.fechaControl),
                    idMoneda: item.moneda.moneda,
                    monto: item.monto,
                    cantidad: item.numero,
                    comentario: item.comentario
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