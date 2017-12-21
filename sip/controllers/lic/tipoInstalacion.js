'use strict';

var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');

function action(req, res) {
    var action = req.body.oper;
    switch (action) {
        case "add":
            models.tipoInstalacion.create({
                nombre: req.body.nombre,
                borrado: 1
            }).then(function (tipoinstal) {
                return res.json({
                    id: tipoinstal.id,
                    message: 'Inicio carga',
                    success: true
                });
            }).catch(function (err) {
                logger.error(err)
                return res.json({
                    id: tipoinstal.id,
                    message: 'Falla',
                    success: false
                });
            });
            break;
        case "edit":
            models.tipoInstalacion.update({
                nombre: req.body.nombre
            }, {
                where: {
                    id: req.body.id
                }
            }).then(function (clase) {
                res.json({
                    id: req.body.id,
                    message: 'Inicio carga',
                    success: true
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    message: err.message,
                    success: false
                });
            });
            break;
        case "del":
            models.tipoInstalacion.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({
                    error: 0,
                    glosa: ''
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    error: 1,
                    glosa: err.message
                });
            });
            break;
    }
}

function list(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "[nombre]";

    if (!sord)
        sord = "asc";

    var orden = "[tipoinstalacion]." + sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (data) {
            //logger.debug(data)
            models.tipoInstalacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.tipoInstalacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (tipoinsta) {
                    //logger.debug(solicitudcotizacion)
                    res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: tipoinsta
                    });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({
                        error_code: 1
                    });
                });
            })
        }
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
            var saveTo = path.join(__dirname, '../../docs/', 'tipoinstalacion', filename);
            file.pipe(fs.createWriteStream(saveTo));
            var dir = path.join(__dirname, '../../', 'public/docs/tipoinstalacion');
            checkDirectorySync(dir);
            var dest = path.join(__dirname, '../../', 'public/docs/tipoinstalacion', filename);
            copyFile(saveTo, dest)
            awaitId.then(function (idDetail) {
                models.tipoInstalacion.update({
                    nombrearchivo: filename
                }, {
                    where: {
                        id: idDetail
                    }
                }).then(function (instalac) {}).catch(function (err) {
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

function tiposInstalacion(req, res) {
    models.sequelize.query("SELECT * " +
        "FROM lic.tipoinstalacion ").spread(function (rows) {
        return res.json(rows);
    });
}

module.exports = {
    list: list,
    action: action,
    upload: upload,
    tiposInstalacion: tiposInstalacion
};