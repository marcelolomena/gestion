var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.documentoscotizacion.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idtipodocumento: req.body.idtipodocumento,
                uid: req.session.passport.user,
                nombrecorto: req.body.nombrecorto,
                descripcionlarga: req.body.descripcionlarga,
                nombreresponsable: req.body.nombreresponsable,
                nombrearchivo: '',
                borrado: 1
            }).then(function (documentoscotizacion) {

                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'documentoscotizacion',
                    documentoscotizacion.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.documentoscotizacion,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: documentoscotizacion.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: documentoscotizacion.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });

            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false });
            });
            break;
        case "edit":

            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'documentoscotizacion',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.documentoscotizacion,
                function (err, data) {
                    if (!err) {
                        models.documentoscotizacion.update({
                            idtipodocumento: req.body.idtipodocumento,
                            uid: req.session.passport.user,
                            nombrecorto: req.body.nombrecorto,
                            descripcionlarga: req.body.descripcionlarga,
                            nombreresponsable: req.body.nombreresponsable,
                            nombrearchivo: ''
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (documentoscotizacion) {
                                res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });

            break;
        case "del":

            models.documentoscotizacion.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (documentoscotizacion) {
                //console.dir(documentoscotizacion)
                //logger.debug("--->>>" + documentoscotizacion[0].nombrearchivo)
                //logger.debug("--->>>" + documentoscotizacion[0].nombrearchivo.trim().length)
                if (documentoscotizacion[0].nombrearchivo.trim().length > 0) {
                    var filedoc = path.join(__dirname, '../../', 'public/docs/' + req.body.idsolicitudcotizacion, documentoscotizacion[0].nombrearchivo);
                    //logger.debug(filedoc)
                    fs.stat(filedoc, function (err, stats) {
                        //logger.debug(stats);

                        if (err) {
                            return logger.error(err);
                        }

                        fs.unlink(filedoc, function (err) {
                            if (err) return logger.error(err);
                            //logger.debug('file deleted successfully');
                        });
                    });
                }

                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'documentoscotizacion',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.documentoscotizacion,
                    function (err, data) {
                        if (!err) {
                            models.documentoscotizacion.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });

            }).catch(function (err) {
                logger.error(err);
                res.json({ message: err.message, success: false });
            });

            break;
    }
}

exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.documentoscotizacion.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.documentoscotizacion.belongsTo(models.valores, { foreignKey: 'idtipodocumento' });
            models.documentoscotizacion.belongsTo(models.user, { foreignKey: 'uid' });
            models.documentoscotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.documentoscotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.solicitudcotizacion
                    }, { model: models.valores }, { model: models.user }
                    ]
                }).then(function (documentoscotizacion) {
                    return res.json({ records: records, total: total, page: page, rows: documentoscotizacion });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.upload = function (req, res) {

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

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {//manejador upload archivo

            var saveTo = path.join(__dirname, '../../', 'docs', filename);
            //logger.debug("actual : " + saveTo)
            file.pipe(fs.createWriteStream(saveTo));

            awaitParent.then(function (idParent) {

                var dir = path.join(__dirname, '../../', 'public/docs/' + idParent);//path al archivo
                checkDirectorySync(dir);
                var dest = path.join(__dirname, '../../', 'public/docs/' + idParent, filename);
                copyFile(saveTo, dest)

                awaitId.then(function (idDetail) {
                    //logger.debug("idDetail : " + idDetail)
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

}