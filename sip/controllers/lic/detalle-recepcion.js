'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

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
        idRecepcion: req.body.idRecepcion || req.params.pId,
        nombre:req.body.nombre,
        idProveedor: parseInt(req.body.idProveedor),
        sap: parseInt(req.body.sap),
        cui: parseInt(req.body.cui),
        numContrato: parseInt(req.body.numContrato),
        ordenCompra: parseInt(req.body.ordenCompra),
        idProducto: req.body.idProducto,
        idFabricante: req.body.idFabricante,
        fechaInicio: base.toDate(req.body.fechaInicio),
        fechaTermino: base.toDate(req.body.fechaTermino),
        fechaControl: base.toDate(req.body.fechaControl),
        idMoneda: req.body.idMoneda,
        monto: req.body.monto,
        cantidad: req.body.cantidad,
        comentario: req.body.comentario,
        numSolicitud: req.body.comentario,
        comprador:req.body.comprador
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idProveedor: item.idProveedor,
            proveedor: { nombre: item.proveedor.razonsocial },
            idFabricante: item.idFabricante,
            fabricante: { nombre: item.fabricante.nombre },
            idProducto: item.idProducto,
            producto: { nombre: item.producto.nombre },
            idMoneda: item.idMoneda,
            moneda: { nombre: item.moneda.nombre },
            sap: item.sap,
            cui: item.cui,
            numContrato: item.numContrato,
            ordenCompra: item.ordenCompra,
            nombre: item.nombre,
            comprador: item.comprador,
            fecha: item.fecha
        };
    });
}


function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idRecepcion', includes, mapper);
}

function mapProducto(data) {
    return { nombre: data.nombre, idFabricante: data.idFabricante };
}
function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            var data = map(req);
            var productoM = models.producto;
            if (!req.body.idProducto) {
                base.createP(productoM, mapProducto(data))
                    .then(function (created) {
                        data.idProducto = created.id;
                        return base.create(entity, data, res);
                    }).catch(function (err) {
                        logger.error(productoM.name + ':create, ' + err);
                        return res.json({ error: 1, glosa: err.message });
                    });
            } else {
                return base.create(entity, map(req), res);
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
module.exports = {
    listChilds: listChilds,
    action: action,
    upload: upload
}