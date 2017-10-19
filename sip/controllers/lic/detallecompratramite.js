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
entity.belongsTo(models.fabricante, {
    foreignKey: 'idFabricante'
});

function map(req) {
    return {
        id: req.body.id || 0,
        idCompraTramite: req.body.idCompraTramite || req.params.pId,
        otroProducto: req.body.otroProducto,
        otroFabricante: req.body.otroFabricante,
        fechaInicio: base.toDate(req.body.fechaInicio),
        fechaTermino: base.toDate(req.body.fechaTermino),
        fechaControl: base.toDate(req.body.fechaControl),
        monto: parseInt(req.body.monto || 0),
        idMoneda: req.body.idMoneda,
        comentario: req.body.comentario,
        nombre: req.body.nombre,
        numero: req.body.numero,
        idProducto: req.body.idProducto,
        idFabricante: req.body.idFabricante,
        estado: req.body.estado
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
            },
            fabricante: {
                nombre: item.fabricante.nombre
            },
            estado: item.estado
        }
    });
}
var includes = [{
    model: models.moneda
},
{
    model: models.producto
},
{
    model: models.fabricante
}

];

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idCompraTramite', includes, mapper);
}
function mapProducto(data) { 
    return {nombre:data.nombre, idFabricante:data.idFabricante, licTramite:data.numero};
}

function mapfabricante(data) {
    return { nombre: data.otroFabricante };
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            var data = map(req);
            var productoM = models.producto;
            if (!req.body.idProducto) {
                return base.createP(productoM, mapProducto(data))
                    .then(function (created) {
                        data.idProducto = created.id;
                        return base.create(entity, data, res);
                    }).catch(function (err) {
                        logger.error(productoM.name + ':create, ' + err);
                        return res.json({ error: 1, glosa: err.message });
                    });
            } else {
                return base.create(entity, data, res);
            }
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