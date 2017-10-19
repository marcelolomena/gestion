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
        fechaInicio: base.toDate(req.body.fechaInicio),
        fechaTermino: base.toDate(req.body.fechaTermino),
        fechaControl: base.toDate(req.body.fechaControl),
        idMoneda: parseInt(req.body.idMoneda),
        monto: parseInt(req.body.monto || 0),
        cantidad: req.body.cantidad ? parseInt(req.body.cantidad) : 0,
        comentario: req.body.comentario,
        numsolicitud: req.body.numsolicitud ? parseInt(req.body.numsolicitud) : null,
        otroProducto: req.body.otroProducto,
        otroFabricante: req.body.otroFabricante,
        idTipoInstalacion: req.body.idTipoInstalacion,
        idClasificacion: req.body.idClasificacion,
        idTipoLicenciamiento: req.body.idTipoLicenciamiento
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
            proveedor: { nombre: item.proveedor.razonsocial },
            idFabricante: item.idFabricante,
            fabricante: { nombre: item.fabricante.nombre },
            idProducto: item.idProducto,
            producto: { nombre: item.producto.nombre },
            fechaInicio: base.fromDate(item.fechaInicio),
            fechaTermino: base.fromDate(item.fechaTermino),
            fechaControl: base.fromDate(item.fechaControl),
            idMoneda: item.idMoneda,
            moneda: { nombre: item.moneda.moneda },
            monto: item.monto,
            cantidad: item.cantidad,
            comprador: item.comprador,
            comentario: item.comentario,
            fecha: base.fromDate(item.fecha),
            numsolicitud: item.numsolicitud
        };
    });
}

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idRecepcion', includes, mapper);
}
function mapfabricante(data) {
    return { nombre: data.otroFabricante };
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
function saveProducto(data, res) {
    if (data.idProducto == null) {
        base.createP(models.producto, mapProducto(data))
            .then(function (created) {
                data.idProducto = created.id;
                addDetalle(data, res);
            }).catch(function (err) {
                logger.error(models.producto.name + ':create, ' + err);
                return res.json({ error: 1, glosa: err.message });
            });
    } else {
        addDetalle(data, res);
    }
}
function addDetalle(data, res) {
    base.createP(entity, data)
        .then(function (created) {
            return models.producto.findById(data.idProducto)
                .then(function (item) {
                    item.licStock = item.licStock + data.cantidad;
                    return base.update(models.producto, item, res);
                })
        }).catch(function (err) {
            logger.error(entity.name + ':create, ' + err);
            return res.json({ error: 1, glosa: err.message });
        });


}
function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            var data = map(req);
            if (data.idFabricante == null) {
                base.createP(models.fabricante, mapFabricante(data))
                    .then(function (created) {
                        data.idFabricante = created.id;
                        saveProducto(data, res);
                    }).catch(function (err) {
                        logger.error(models.fabricante.name + ':create, ' + err);
                        return res.json({ error: 1, glosa: err.message });
                    });
            } else {
                saveProducto(data, res);
            }
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function upload(req, res) {
    if (req.method === 'POST') {
        var busboy = new Busboy({ headers: req.headers });
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
            var saveTo = path.join(__dirname, '../../', 'docs', filename);
            file.pipe(fs.createWriteStream(saveTo));
            awaitParent.then(function (idParent) {
                var dir = path.join(__dirname, '../../', 'public/docs/' + idParent);
                checkDirectorySync(dir);
                var dest = path.join(__dirname, '../../', 'public/docs/' + idParent, filename);
                copyFile(saveTo, dest)
                awaitId.then(function (idDetail) {
                    models.documentoscotizacion.update({
                        nombrearchivo: filename
                    }, {
                            where: {
                                id: idDetail
                            }
                        }).then(function (documentoscotizacion) {
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                }).catch(function (err) {
                    res.json({ error_code: 1, message: err.message, success: false });
                    logger.error(err)
                });
            }).catch(function (err) {
                res.json({ error_code: 1, message: err.message, success: false });
                logger.error(err)
            });
        });

        busboy.on('finish', function () {
            logger.debug("Finalizo la transferencia del archivo")
            res.json({ error_code: 0, message: 'Archivo guardado', success: true });
        });

        return req.pipe(busboy);
    }

};

function listDetalleCompras(req, res) {
    var ntt = models.detalleCompraTramite;
    base.listChilds(req, res, ntt, 'idCompraTramite', [{
        model: models.producto
    }], function (data) {
        var result = [];
        _.each(data, function (item) {
            if (item.estado === 1) {
                var row = {
                    id: item.id,
                    nombre: item.producto.nombre,
                    idFabricante: item.idFabricante,
                    idProducto: item.idProducto,
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
    upload: upload,
    listDetalleCompras: listDetalleCompras
}