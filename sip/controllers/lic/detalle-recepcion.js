'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');

var entity = models.detalleRecepcion;
entity.belongsTo(models.proveedor, {
    foreignKey: 'idProveedor'
});
entity.belongsTo(models.fabricante, {
    foreignKey: 'idFabricante'
});
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.moneda, {
    foreignKey: 'idMoneda'
});
entity.belongsTo(models.compra, {
    foreignKey: 'idCompra'
});
// entity.belongsTo(models.estructuracuibch, { foreignKey: 'idCui' });
var includes = [{
        model: models.proveedor
    }, {
        model: models.fabricante
    }, {
        model: models.producto,
        include: [{
            model: models.clasificacion
        }, {
            model: models.tipoInstalacion
        }, {
            model: models.tipoLicenciamiento
        }]
    }, {
        model: models.moneda
    }, {
        model: models.compra
    }
    // , {
    //     model: models.estructuracuibch
    // }
];

function map(req) {
    return {
        id: parseInt(req.body.id) || 0,
        idRecepcion: parseInt(req.body.idRecepcion || req.params.pId),
        nombre: req.body.nombre,
        sap: req.body.sap ? parseInt(req.body.sap) : null,
        cui: req.body.idCui ? parseInt(req.body.idCui) : null,
        numContrato: req.body.numContrato ? parseInt(req.body.numContrato) : null,
        ordenCompra: req.body.ordenCompra ? parseInt(req.body.ordenCompra) : null,
        idProveedor: parseInt(req.body.idProveedor),
        idProducto: req.body.idProducto ? parseInt(req.body.idProducto) : null,
        idFabricante: req.body.idFabricante ? parseInt(req.body.idFabricante) : null,
        fechaInicio: req.body.fechaInicio,
        fechaTermino: req.body.fechaTermino,
        fechaControl: req.body.fechaControl,
        idMoneda: parseInt(req.body.idMoneda),
        monto: parseInt(req.body.monto || 0),
        montoSoporte: parseInt(req.body.montoSoporte || 0),
        cantidad: req.body.cantidad ? parseInt(req.body.cantidad) : 0,
        comentario: req.body.comentario,
        numsolicitud: req.body.numsolicitud ? parseInt(req.body.numsolicitud) : null,
        otroProducto: req.body.otroProducto,
        otroFabricante: req.body.otroFabricante,
        idTipoInstalacion: req.body.idTipoInstalacion,
        idClasificacion: req.body.idClasificacion,
        idTipoLicenciamiento: req.body.idTipoLicenciamiento,
        ilimitado: req.body.ilimitado === 'true',
        factura: req.body.factura,
        comprador: req.body.comprador,
        mailComprador: req.body.mailComprador,
        idCompra: req.body.idCompra,
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idRecepcion: item.idRecepcion,
            idCompraTrameite: item.idCompraTrameite,
            sap: item.sap,
            idCui: item.cui,
            numContrato: item.numContrato,
            ordenCompra: item.ordenCompra,
            idProveedor: item.idProveedor,
            proveedor: {
                nombre: item.proveedor.razonsocial
            },
            idFabricante: item.idFabricante,
            fabricante: {
                nombre: item.fabricante.nombre
            },
            idProducto: item.idProducto,
            producto: {
                nombre: item.producto.nombre
            },
            idTipoInstalacion: item.producto.idTipoInstalacion,
            tipoInstalacion: {
                nombre: item.producto.tipoInstalacion ? item.producto.tipoInstalacion.nombre : ''
            },
            idClasificacion: item.producto.idClasificacion,
            clasificacion: {
                nombre: item.producto.clasificacion ? item.producto.clasificacion.nombre : ''
            },
            idTipoLicenciamiento: item.producto.idTipoLicenciamiento,
            tipoLicenciamiento: {
                nombre: item.producto.tipoLicenciamiento ? item.producto.tipoLicenciamiento.nombre : ''
            },
            fechaInicio: base.fromDate(item.fechaInicio),
            fechaTermino: base.fromDate(item.fechaTermino),
            fechaControl: base.fromDate(item.fechaControl),
            idMoneda: item.idMoneda,
            moneda: {
                nombre: item.moneda.moneda
            },
            monto: item.monto,
            montoSoporte: item.montoSoporte,
            cantidad: item.cantidad,
            comprador: item.comprador,
            mailComprador: item.mailComprador,
            comentario: item.comentario,
            fecha: base.fromDate(item.fecha),
            numsolicitud: item.numsolicitud,
            ilimitado: item.ilimitado,
            factura: item.factura,
            idCompra: item.idCompra
        };
    });
}

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idRecepcion', includes, mapper);
}

function listProductChilds(req, res) {
    base.listChilds(req, res, entity, 'idProducto', includes, mapper);
}

function mapfabricante(data) {
    return {
        nombre: data.otroFabricante
    };
}

function mapProducto(data) {
    return {
        nombre: data.otroProducto,
        idFabricante: data.idFabricante,
        idTipoInstalacion: data.idTipoInstalacion,
        idClasificacion: data.idClasificacion,
        idTipoLicenciamiento: data.idTipoLicenciamiento
    };
}

function mapCompra(data) {
    return {
        idProducto: data.idProducto,
        contrato: data.numContrato,
        ordenCompra: data.ordenCompra,
        idCui: data.cui,
        sap: data.sap,
        idProveedor: data.idProveedor,
        fechaCompra: base.strToDateDB(data.fechaInicio),
        fechaExpiracion: base.strToDateDB(data.fechaTermino),
        licCompradas: data.cantidad,
        cantidadSoporte: data.cantidadSoporte,
        idMoneda: data.idMoneda,
        valorLicencia: data.monto,
        valorSoporte: data.montoSoporte,
        fechaRenovaSoporte: base.strToDateDB(data.fechaControl),
        factura: data.factura,
        comprador: data.comprador,
        correoComprador: data.mailComprador,
        idCompra: data.idCompra
    };
}

function saveProducto(data, res) {
    if (data.idProducto == null) {
        return base.createP(models.producto, mapProducto(data))
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
        return addDetalle(data, res);
    }
}

function addDetalle(data, res) {
    if (data.idCompra == null) {
        return base.createP(models.compra, mapCompra(data))
            .then(function (createdd) {
                data.idCompra = createdd.id;
                addDetalle(data, res);
            }).catch(function (err) {
                logger.error('compra.Stock Upd, ' + err);
                return res.json({
                    error: 1,
                    glosa: err.message
                });
            })
    } else {
        data.fechaInicio = base.strToDateDB(data.fechaInicio);
        data.fechaTermino = base.strToDateDB(data.fechaTermino);
        data.fechaControl = base.strToDateDB(data.fechaControl);

        var hoy = "" + new Date().toISOString();

        return base.createP(entity, data)
            .then(function (created) {
                return base.findById(models.producto, data.idProducto)
                    .then(function (item) {
                        var f1 = data.fechaControl;
                        var f2 = data.fechaTermino;
                        var f1compare = f1.replace(/-/g, "")
                        var f2compare = f2.replace(/-/g, "")
                        var fhoycompare = hoy.substr(0, 10).replace(/-/g, "");
                        var prdData = {
                            id: data.idProducto,
                            ilimitado: data.ilimitado,
                            alertaRenovacion: null
                        };
                        if (!prdData.ilimitado) {
                            prdData.licStock = parseInt(item.licStock) + parseInt(data.cantidad);
                        }
                        if (item.idClasificacion) {
                            prdData.idClasificacion = data.idClasificacion;
                        }
                        if (item.idTipoInstalacion) {
                            prdData.idTipoInstalacion = data.idTipoInstalacion;
                        }
                        if (item.idTipoLicenciamiento) {
                            prdData.idTipoLicenciamiento = data.idTipoLicenciamiento;
                        }
                        if (f1compare < fhoycompare) {
                            if (f2compare < fhoycompare) {
                                models.parametro.findAll({
                                    where: {
                                        tipo: 'alertarenosoporte',
                                        nombre: 'Vencida'
                                    }
                                }).then(function (alerta) {

                                    if (alerta.length != 0) {
                                        prdData.alertaRenovacion = alerta[0].dataValues.id;
                                        return base.update(models.producto, prdData, res);
                                    }
                                });
                            } else {
                                models.parametro.findAll({
                                    where: {
                                        tipo: 'alertarenosoporte',
                                        nombre: 'Renovar'
                                    }
                                }).then(function (alerta) {
                                    if (alerta.length != 0) {
                                        prdData.alertaRenovacion = alerta[0].dataValues.id;
                                        return base.update(models.producto, prdData, res);
                                    }
                                });
                            }
                        } else {
                            models.parametro.findAll({
                                where: {
                                    tipo: 'alertarenosoporte',
                                    nombre: 'Al Día'
                                }
                            }).then(function (alerta) {
                                if (alerta.length != 0) {
                                    prdData.alertaRenovacion = alerta[0].dataValues.id;
                                    return base.update(models.producto, prdData, res);
                                }
                            });
                        }

                    }).catch(function (err) {
                        logger.error('producto.Stock Upd, ' + err);
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
}

function action(req, res) {
    var data = map(req);
    switch (req.body.oper) {
        case 'add':
            if (data.idFabricante == null) {
                return base.createP(models.fabricante, mapFabricante(data))
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
        case 'edit':
            data.fechaInicio = base.strToDateDB(data.fechaInicio);
            data.fechaTermino = base.strToDateDB(data.fechaTermino);
            data.fechaControl = base.strToDateDB(data.fechaControl);
            var hoy = "" + new Date().toISOString();
            var f1 = data.fechaControl;
            var f2 = data.fechaTermino;
            var f1compare = f1.replace(/-/g, "")
            var f2compare = f2.replace(/-/g, "")
            var fhoycompare = hoy.substr(0, 10).replace(/-/g, "");
            return base.findById(entity, req.body.id)
                .then(function (detalle) {
                    return base.updateP(entity, data)
                        .then(function (updated) {
                            return base.findById(models.producto, detalle.idProducto)
                                .then(function (item) {
                                    var updData = {
                                        id: detalle.idProducto,
                                        ilimitado: data.ilimitado
                                    };
                                    if (!updData.ilimitado) {
                                        updData.licStock = item.licStock - detalle.cantidad + data.cantidad
                                    }

                                    return base.findById(models.compra, detalle.idCompra)
                                        .then(function (items) {
                                            return base.findById(models.compra, detalle.idCompra)
                                                .then(function (items) {
                                                    var updcData = {
                                                        id: detalle.idCompra
                                                    };
                                                    updcData.licCompradas = items.licCompradas - detalle.cantidad + data.cantidad
                                                    base.update(models.compra, updcData, res);

                                                    if (f1compare < fhoycompare) {
                                                        if (f2compare < fhoycompare) {
                                                            models.parametro.findAll({
                                                                where: {
                                                                    tipo: 'alertarenosoporte',
                                                                    nombre: 'Vencida'
                                                                }
                                                            }).then(function (alerta) {
                            
                                                                if (alerta.length != 0) {
                                                                    updData.alertaRenovacion = alerta[0].dataValues.id;
                                                                    return base.update(models.producto, updData, res);
                                                                }
                                                            });
                                                        } else {
                                                            models.parametro.findAll({
                                                                where: {
                                                                    tipo: 'alertarenosoporte',
                                                                    nombre: 'Renovar'
                                                                }
                                                            }).then(function (alerta) {
                                                                if (alerta.length != 0) {
                                                                    updData.alertaRenovacion = alerta[0].dataValues.id;
                                                                    return base.update(models.producto, updData, res);
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        models.parametro.findAll({
                                                            where: {
                                                                tipo: 'alertarenosoporte',
                                                                nombre: 'Al Día'
                                                            }
                                                        }).then(function (alerta) {
                                                            if (alerta.length != 0) {
                                                                updData.alertaRenovacion = alerta[0].dataValues.id;
                                                                return base.update(models.producto, updData, res);
                                                            }
                                                        });
                                                    }
                                                    // return base.update(models.producto, updData, res);
                                                }).catch(function (err) {
                                                    logger.error('producto.Stock Upd, ' + err);
                                                    return res.json({
                                                        error: 1,
                                                        glosa: err.message
                                                    });
                                                });
                                        }).catch(function (err) {
                                            logger.error('compra.licCompradas Updc, ' + err);
                                            return res.json({
                                                error: 1,
                                                glosa: err.message
                                            });
                                        });
                                }).catch(function (err) {
                                    logger.error('producto.Stock Upd, ' + err);
                                    return res.json({
                                        error: 1,
                                        glosa: err.message
                                    });
                                });
                        }).catch(function (err) {
                            logger.error(entity.name + ':destroy, ' + err);
                            return res.json({
                                success: false,
                                glosa: err.message
                            });
                        });
                }).catch(function (err) {
                    logger.error(entity.name + 'by Id, ' + err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
        case 'del':
            return base.findById(entity, req.body.id)
                .then(function (detalle) {
                    return base.destroyP(entity, detalle.id)
                        .then(function (deleted) {
                            return base.findById(models.compra, detalle.idCompra)
                                .then(function (items) {
                                    return base.destroyP(models.compra, items.id)
                                        .then(function (deleteed) {
                                            return base.findById(models.producto, detalle.idProducto)
                                                .then(function (item) {
                                                    return base.update(models.producto, {
                                                        id: detalle.idProducto,
                                                        licStock: item.licStock - detalle.cantidad
                                                    }, res);
                                                }).catch(function (err) {
                                                    logger.error('producto.Stock Upd, ' + err);
                                                    return res.json({
                                                        error: 1,
                                                        glosa: err.message
                                                    });
                                                })
                                        }).catch(function (err) {
                                            logger.error(entity.name + ':destroy, ' + err);
                                            return res.json({
                                                success: false,
                                                glosa: err.message
                                            });
                                        });
                                }).catch(function (err) {
                                    logger.error('compra.Stock Upd, ' + err);
                                    return res.json({
                                        error: 1,
                                        glosa: err.message
                                    });
                                });
                        }).catch(function (err) {
                            logger.error(entity.name + ':destroy, ' + err);
                            return res.json({
                                success: false,
                                glosa: err.message
                            });
                        });
                }).catch(function (err) {
                    logger.error(entity.name + 'by Id, ' + err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
    }
}

function listDetalleCompras(req, res) {
    var ntt = models.detalleCompraTramite;
    base.listChilds(req, res, ntt, 'idCompraTramite', [{
        model: models.producto,
        include: [{
            model: models.clasificacion
        }, {
            model: models.tipoInstalacion
        }, {
            model: models.tipoLicenciamiento
        }]
    }], function (data) {
        var result = [];
        _.each(data, function (item) {
            if (item.estado === 1) {
                var row = {
                    id: item.id,
                    nombre: item.producto.nombre,
                    idFabricante: item.idFabricante,
                    idProducto: item.idProducto,
                    idClasificacion: item.producto.idClasificacion,
                    idTipoInstalacion: item.producto.idTipoInstalacion,
                    idTipoLicenciamiento: item.producto.idTipoLicenciamiento,
                    fechaInicio: base.fromDate(item.fechaInicio),
                    fechaTermino: base.fromDate(item.fechaTermino),
                    fechaControl: base.fromDate(item.fechaControl),
                    idMoneda: item.idMoneda,
                    monto: item.monto,
                    cantidad: item.numero,
                    comentario: item.comentario
                };
                result.push(row);
            }
        });
        return result;
    })
}
module.exports = {
    listChilds: listChilds,
    action: action,
    listProductChilds: listProductChilds,
    listDetalleCompras: listDetalleCompras
}