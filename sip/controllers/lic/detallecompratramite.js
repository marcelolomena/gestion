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
        id: parseInt(req.body.id) || 0,
        idCompraTramite: req.body.idCompraTramite || req.params.pId,
        otroProducto: req.body.otroProducto ? req.body.otroProducto : null,
        otroFabricante: req.body.otroFabricante ? req.body.otroFabricante : null,
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
        licTramite: 0
    };
}

function mapFabricante(data) {
    return {
        nombre: data.otroFabricante,
        idProducto: data.idProducto
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

    base.createP(entity, data)
        .then(function (created) {
            base.findById(models.producto, data.idProducto)
                .then(function (item) {
                    return base.update(models.producto, {
                        id: data.idProducto,
                        licTramite: item.licTramite + data.numero
                    }, res);
                }).catch(function (err) {
                    logger.error('producto.LicTramite, ' + err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
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
    var data = map(req);
    switch (req.body.oper) {
        case 'add':
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
                return saveProducto(data, res);
            }
            break;
        case 'edit':
            base.findById(entity, req.body.id)
                .then(function (detalle) {
                    base.updateP(entity, data)
                        .then(function (updated) {
                            if (data.estado == 0) {
                                base.findById(models.producto, detalle.idProducto)
                                    .then(function (item) {
                                        return base.update(models.producto, {
                                            id: detalle.idProducto,
                                            licTramite: item.licTramite - data.numero
                                        }, res);
                                    }).catch(function (err) {
                                        logger.error('producto.LicTramite Upd, ' + err);
                                        return res.json({
                                            error: 1,
                                            glosa: err.message
                                        });
                                    });
                            } else {

                                return res.json({
                                    error: 1,
                                    glosa: err.message
                                });
                            }
                        }).catch(function (err) {
                            logger.error(entity.name + ':destroy, ' + err);
                            return res.json({
                                success: false,
                                glosa: err.message
                            });
                        });
                }).catch(function (err) {
                    logger.error(entity.name + ' by Id, ' + err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
            break;
        case 'del':
            return base.findById(entity, req.body.id)
                .then(function (detalle) {
                    if (detalle.estado == 0) {
                        return base.destroyP(entity, detalle.id)
                            .then(function (deleted) {
                                return base.findById(models.producto, detalle.idProducto)
                                    .then(function (item) {
                                        return base.update(models.producto, {
                                            id: detalle.idProducto,
                                            // licTramite: item.licTramite + detalle.numero
                                        }, res);
                                    }).catch(function (err) {
                                        logger.error('producto.LicTramite Upd, ' + err);
                                        return res.json({
                                            error: 1,
                                            glosa: err.message
                                        });
                                    })
                            })
                            .catch(function (err) {
                                logger.error(entity.name + ':destroy, ' + err);
                                return res.json({
                                    success: false,
                                    glosa: err.message
                                });
                            });
                    } else {
                        return base.destroyP(entity, detalle.id)
                            .then(function (deleted) {
                                return base.findById(models.producto, detalle.idProducto)
                                    .then(function (item) {
                                        return base.update(models.producto, {
                                            id: detalle.idProducto,
                                            licTramite: item.licTramite - detalle.numero
                                        }, res);
                                    }).catch(function (err) {
                                        logger.error('producto.LicTramite Upd, ' + err);
                                        return res.json({
                                            error: 1,
                                            glosa: err.message
                                        });
                                    })
                            })
                            .catch(function (err) {
                                logger.error(entity.name + ':destroy, ' + err);
                                return res.json({
                                    success: false,
                                    glosa: err.message
                                });
                            });
                    }
                })
                .catch(function (err) {
                    logger.error(entity.name + 'by Id, ' + err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
            break;
    }
}


// function (req, res){
//     function existeOtroFabricante(req, res) {
//         var nombre = req.params.otroFabricante;
//         entity.findOne({
//                 where: {
//                     nombre: nombre
//                 },
//                 attributes: ['nombre']
//             })
//             .then(function (result) {
//                 return res.json({
//                     error_code: 0,
//                     nombre: result.nombre
//                 });
//             })
//             .catch(function (err) {
//                 return res.json({
//                     error_code: 1
//                 });
//             });
//     }


// }

// function existeRecepcion(req, res) {
//     var ntt = models.detalleCompraTramite;
//     base.listChilds(req, res, ntt, 'idCompraTramite', [{
//         model: models.producto,
//         include: [{
//             model: models.clasificacion
//         }, {
//             model: models.tipoInstalacion
//         }, {
//             model: models.tipoLicenciamiento
//         }]
//     }], function (data) {
//         var result = [];
//         _.each(data, function (item) {
//             if (item.estado === 1) {
//                 var row = {
//                     id: item.id,
//                     nombre: item.producto.nombre,
//                     idFabricante: item.idFabricante,
//                     idProducto: item.idProducto,
//                     idClasificacion: item.producto.idClasificacion,
//                     idTipoInstalacion: item.producto.idTipoInstalacion,
//                     idTipoLicenciamiento: item.producto.idTipoLicenciamiento,
//                     fechaInicio: base.fromDate(item.fechaInicio),
//                     fechaTermino: base.fromDate(item.fechaTermino),
//                     fechaControl: base.fromDate(item.fechaControl),
//                     idMoneda: item.idMoneda,
//                     monto: item.monto,
//                     cantidad: item.numero,
//                     comentario: item.comentario
//                 };
//                 result.push(row);
//             }
//         });
//         return result;
//     })
// }

function existeRecepcion(req, res) {
    var ntt = models.detalleRecepcion;
    base.listChilds(req, res, ntt, 'numsolicitud', [{
        model: models.producto,
        model: models.fabricante,
        model: models.moneda
    }], function (data) {
         return data;
    })
}

module.exports = {
    listChilds: listChilds,
    action: action,
    existeRecepcion: existeRecepcion
}