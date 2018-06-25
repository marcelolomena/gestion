'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

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
}];

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
        idRenovado: req.body.idRenovado ? parseInt(req.body.idRenovado) : 0,
        fichaTecnica: req.body.fichaTecnica
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
            idCompra: item.idCompra,
            compra: {
                nombre: item.compra.idCompra
            },
            fichaTecnica: item.fichaTecnica
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
        idTipoLicenciamiento: data.idTipoLicenciamiento,
        idDetalleRecepcion: data.idDetalleRecepcion
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
        fechaCompra: data.fechaInicio,
        fechaExpiracion: data.fechaTermino,
        licCompradas: data.cantidad,
        cantidadSoporte: data.cantidadSoporte,
        idMoneda: data.idMoneda,
        valorLicencia: data.monto,
        valorSoporte: data.montoSoporte,
        fechaRenovaSoporte: data.fechaControl,
        factura: data.factura,
        comprador: data.comprador,
        correoComprador: data.mailComprador,
        idCompra: data.idCompra,
        alertaRenovacion: data.alertaRenovacion,
        comentario: data.comentario,
        perpetua: 0,
        idRenovado: data.idRenovado
    };
}

function saveProducto(data, res) {
    if (!data.idProducto) {
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
    if (!data.idCompra) {
        data.fechaInicio = base.strToDateDB(data.fechaInicio);
        data.fechaTermino = base.strToDateDB(data.fechaTermino);
        data.fechaControl = base.strToDateDB(data.fechaControl);
        data.alertaRenovacion = 'bAl Dia';
        return base.createP(models.compra, mapCompra(data))
            .then(function (createdd) {
                data.idCompra = createdd.id;
                models.sequelize.query('EXECUTE lic.alertaRenoSoporteCON ' + data.idProducto + ';');
                return addDetalle(data, res);
            }).catch(function (err) {
                logger.error('compra.Stock Upd, ' + err);
                return res.json({
                    error: 1,
                    glosa: err.message
                });
            })
    } else {
        return base.createP(entity, data)
            .then(function (created) {
                data.id = created.id;
                return base.findById(models.producto, data.idProducto)
                    .then(function (item) {
                        var prdData = {
                            id: data.idProducto,
                            ilimitado: data.ilimitado,
                            idClasificacion: data.idClasificacion,
                            idTipoInstalacion: data.idTipoInstalacion,
                            idTipoLicenciamiento: data.idTipoLicenciamiento,
                            idDetalleRecepcion: data.id
                        };
                        if (!prdData.ilimitado) {
                            prdData.licStock = parseInt(item.licStock) + parseInt(data.cantidad);
                        }
                        return base.update(models.producto, prdData, res);
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
            break;
        case 'edit':
            data.fechaInicio = base.strToDateDB(data.fechaInicio);
            data.fechaTermino = base.strToDateDB(data.fechaTermino);
            data.fechaControl = base.strToDateDB(data.fechaControl);
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
                                                        id: detalle.idCompra,
                                                        alertarenovacion: null
                                                    };
                                                    updcData.alertaRenovacion = 'bAl Dia';
                                                    updcData.licCompradas = items.licCompradas - detalle.cantidad + data.cantidad
                                                    base.update(models.compra, updcData, res);
                                                    models.sequelize.query('EXECUTE lic.alertaRenoSoporteCON ' + updData.id + ';');
                                                    return base.update(models.producto, updData, res);

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
            break;
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
                                                    models.sequelize.query('EXECUTE lic.alertaRenoSoporteCON ' + detalle.idProducto + ';');
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
            break;
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

function prodRenovar(req, res) {
    if (req.params.pId == 0) {
        models.compra.belongsTo(models.producto, {
            foreignKey: 'idProducto'
        });
        models.compra.findAll({
            attributes: ['id', 'fechaCompra', 'ordenCompra'],
            order: 'id ASC',
            where: {
                idRenovado: 0
            },
            include: [{
                model: models.producto
            }]
        }).then(function (com) {
            return res.json(com);
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });
    } else {
        models.compra.belongsTo(models.producto, {
            foreignKey: 'idProducto'
        });
        models.compra.findAll({
            attributes: ['id', 'fechaCompra', 'ordenCompra'],
            order: 'id ASC',
            where: {
                idProducto: req.params.pId,
                idRenovado: 0
            },
            include: [{
                model: models.producto
            }]
        }).then(function (com) {
            return res.json(com);
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });
    }
}

function upload(req, res) {
    if (req.method === 'POST') {
        var busboy = new Busboy({
            headers: req.headers
        });
        var awaitId = new Promise(function (resolve, reject) {
            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'id') {
                    try {
                        resolve(val)
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    return;
                }
            });
        });

        var awaitParent = new Promise(function (resolve, reject) {
            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'parent') {
                    try {
                        resolve(val)
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    return;
                }
            });
        });

        function copyFile(source, target) {
            return new Promise(function (resolve, reject) {
                var rd = fs.createReadStream(source);
                rd.on('error', rejectCleanup);
                var wr = fs.createWriteStream(target);
                wr.on('error', rejectCleanup);

                function rejectCleanup(err) {
                    rd.destroy();
                    wr.end();
                    reject(err);
                }
                wr.on('finish', resolve);
                rd.pipe(wr);
            });
        }

        function checkDirectorySync(directory) {
            try {
                fs.statSync(directory);
            } catch (e) {
                fs.mkdirSync(directory);
            }
        }

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var numero = Math.floor((Math.random() * 10000) + 1);
            var saveTo = path.join(__dirname, '../../docs/lic/', 'fichas', numero + filename);
            file.pipe(fs.createWriteStream(saveTo));
            var dir = path.join(__dirname, '../../', 'public/docs/lic/fichas');
            checkDirectorySync(dir);
            var dest = path.join(__dirname, '../../', 'public/docs/lic/fichas', numero + filename);
            copyFile(saveTo, dest)
            awaitId.then(function (idDetail) {
                models.detalleRecepcion.update({
                    fichaTecnica: numero + filename
                }, {
                        where: {
                            id: idDetail
                        }
                    }).then(function (detallrecepcio) { }).catch(function (err) {
                        logger.error(err)
                        res.json({
                            id: 0,
                            message: err.message,
                            success: false
                        });
                    });
            }).catch(function (err) {
                res.json({
                    error_code: 1,
                    message: err.message,
                    success: false
                });
                logger.error(err)
            });

        });

        busboy.on('finish', function () {
            logger.debug("Finalizo la transferencia del archivo")
            res.json({
                error_code: 0,
                message: 'Archivo guardado',
                success: true
            });
        });

        return req.pipe(busboy);
    }
}

module.exports = {
    listChilds: listChilds,
    action: action,
    listProductChilds: listProductChilds,
    listDetalleCompras: listDetalleCompras,
    prodRenovar: prodRenovar,
    upload: upload
}