'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var secuencia = require("../../utils/secuencia");

var entity = models.instalacion;

function list(req, res) {
    var id = req.params.id;
    var usuario = req.session.passport.user;
    var page = 1
    var rows = 10
    var filters = req.params.filters
    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            entity.belongsTo(models.producto, {
                foreignKey: 'idProducto'
            });
            entity.belongsTo(models.user, {
                foreignKey: 'idUsuario'
            });
            entity.belongsTo(models.tipoInstalacion, {
                foreignKey: 'idTipoInstalacion'
            });
            entity.count({
                where: {
                    idUsuario: usuario
                },
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                entity.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: ['estado'],
                    where: {
                        idUsuario: usuario
                    },
                    include: [{
                        model: models.producto
                    }, {
                        model: models.user
                    }]
                }).then(function (instal) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: instal
                    });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error_code: 1
                    });
                });
            })
        }
    });
}

function misAutorizaciones(req, res) {
    models.sequelize.query("select a.idproducto, b.nombre " +
        "from lic.reserva a " +
        "join lic.producto b on a.idproducto = b.id " +
        "where a.idusuario = " + req.session.passport.user + " and a.estado = 'Autorizado'").spread(function (rows) {
        return res.json(rows);
    });
}

function miscodigos(req, res) {
    var idproduct = req.params.idProducto;
    models.sequelize.query("select codautoriza " +
        "from lic.reserva " +
        "where idproducto = " + idproduct).spread(function (rows) {
        return res.json(rows);
    });
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
            var saveTo = path.join(__dirname, '../../', 'docs', filename);
            file.pipe(fs.createWriteStream(saveTo));
            awaitParent.then(function (idParent) {
                var dir = path.join(__dirname, '../../', 'public/docs/' + idParent);
                checkDirectorySync(dir);
                var dest = path.join(__dirname, '../../', 'public/docs/' + idParent, filename);
                copyFile(saveTo, dest)
                awaitId.then(function (idDetail) {
                    models.instalacion.update({
                        nombrearchivo: filename
                    }, {
                        where: {
                            id: idDetail
                        }
                    }).then(function (instalacionn) {}).catch(function (err) {
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
    list: list,
    misAutorizaciones: misAutorizaciones,
    miscodigos: miscodigos,
    upload: upload
};