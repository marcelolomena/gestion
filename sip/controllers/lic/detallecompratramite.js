'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var prod = require('./producto');
var _ = require('lodash');
var logger = require('../../utils/logger');

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
        id: req.body.id,
        idCompraTramite: req.body.idCompraTramite || req.params.pId,
        otroProducto: req.body.otroProducto,
        otroFabricante: req.body.otroFabricante,
        fechaInicio: base.toDate(req.body.fechaInicio),
        fechaTermino: base.toDate(req.body.fechaTermino),
        fechaControl: base.toDate(req.body.fechaControl),
        monto: parseInt(req.body.monto || 0),
        idMoneda: parseInt(req.body.idMoneda),
        comentario: req.body.comentario,
        numero: req.body.numero ? parseInt(req.body.numero) : 0,
        idProducto: req.body.idProducto ? parseInt(req.body.idProducto) : null,
        idFabricante: req.body.idFabricante ? parseInt(req.body.idFabricante) : null,
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
            otroProducto: item.otroProducto,
            otroFabricante: item.otroFabricante,
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
    return {
        nombre: data.otroProducto,
        idFabricante: data.idFabricante,
        licTramite: data.numero
    };
}

function mapFabricante(data) {
    return {
        nombre: data.otroFabricante
    };
}

function saveProducto(data, res) {
    if (!data.idProducto) {
        base.createP(models.producto, mapProducto(data))
            .then(function (created) {
                data.idProducto = created.id;
                addDetalle(data, res);
            }).catch(function (err) {
                logger.error(models.producto.name + ':create, ' + err);
                return res.json({
                    error: 1,
                    glosa: err.message
                });
            });
    } else {
        addDetalle(data, res);
    }
}

function addDetalle(data, res) {
    // prod.getProductoLicTramite(data, res)
    // .then(function(numero){
    //     numero.lictramite = numero.lictramite + data.numero;
    //     base.update(models.producto, numero, res)
    //     base.createP(entity, data)
    // })
    


    // var cosa = prod.getProductoLicTramite(data, res)
    // var cosa2 = cosa;
    // prod.getProductoLicTramite(data, res)
    // .then(function(numero){
    //     numero.licTramite = numero.licTramite + data.numero;
    //     base.update(models.producto, numero, res)
    //     base.createP(entity, data)
    // })
    
    base.createP(entity, data)
        .then(function (created) {
            return models.producto.findById(data.idProducto)
                .then(function (item) {
                    item.licTramite = item.licTramite + data.numero;
                    return base.update(models.producto, item, res);
                })
        }).catch(function (err) {
            logger.error(entity.name + ':create, ' + err);
            return res.json({
                error: 1,
                glosa: err.message
            });
        });
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            var data = map(req);
            if (!data.idFabricante) {
                base.createP(models.fabricante, mapFabricante(data))
                    .then(function (created) {
                        data.idFabricante = created.id;
                        saveProducto(data, res);
                    }).catch(function (err) {
                        logger.error(models.fabricante.name + ':create, ' + err);
                        return res.json({
                            error: 1,
                            glosa: err.message
                        });
                    });
            } else {
                saveProducto(data, res);
            }
            break;
        case 'edit':
            // var data = map(req);
            // var lictramiteactualizado = data.numero;
            // return models.detalleCompraTramite.findById(data.idDetalleCompraTramite)
            //     .then(function (item) {
            //         item.licTramite = lictramiteactualizado - item.numero;
            //         return models.producto.findById(data.idProducto)
            //             .then(function (items) {
            //                 items.licTramite = items.licTramite + data.numero;
            //                 base.update(models.producto, items, res);
            //             })
            //     })
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

module.exports = {
    listChilds: listChilds,
    action: action
}