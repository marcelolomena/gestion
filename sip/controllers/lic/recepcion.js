'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.recepcion;
entity.belongsTo(models.proveedor, { foreignKey: 'idProveedor' });
entity.belongsTo(models.moneda, { foreignKey: 'idMoneda' });

function map(req) {
    return {
        id: parseInt(req.body.id) || 0,
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return item;
    });
}
var includes = [
    {
        model: models.proveedor
    }, {
        model: models.moneda
    }
];

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
    list: list,
    action: action,
    upload: upload
}