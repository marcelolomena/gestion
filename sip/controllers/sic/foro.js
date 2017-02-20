var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var bitacora = require("../../utils/bitacora");
var co = require('co');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.preguntaforo.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                glosapregunta: req.body.glosapregunta,
                usuariopregunta: req.session.passport.user,
                fechapregunta: new Date(),
                borrado: 1
            }).then(function (foro) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'foro',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.preguntaforo,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });
            break;
        case "edit":
            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'foro',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.preguntaforo,
                function (err, data) {
                    if (!err) {
                        models.preguntaforo.update({

                            glosapregunta: req.body.glosapregunta
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (preguntaforo) {
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
            models.preguntaforo.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (preguntaforo) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'foro',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.preguntaforo,
                    function (err, data) {
                        if (!err) {
                            models.preguntaforo.destroy({
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
            });
            break;
    }
}



exports.actionrespuesta = function (req, res) {
    var action = req.body.oper;
    var idpreguntaforo = req.params.id;
    var idsolicitudcotizacion = req.params.idpadre;

    if (action == "add" || action == "edit") {
        var iddocto = req.body.iddocumento;
        if (iddocto == 0) {
            iddocto = null;
        }
    }

    switch (action) {
        case "add":
            models.respuestaforo.create({
                idpreguntaforo: idpreguntaforo,
                glosarespuesta: req.body.glosarespuesta,
                usuariorespuesta: req.session.passport.user,
                iddocumento: iddocto,
                fecha: new Date(),
                borrado: 1
            }).then(function (foro) {
                bitacora.registrar(
                    idsolicitudcotizacion,
                    'foro',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.respuestaforo,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: foro.id, parent: idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: foro.id, parent: idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    }
                )
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false })
            });
            break;
        case "edit":
            models.respuestaforo.update({
                glosarespuesta: req.body.glosarespuesta,
                iddocumento: iddocto
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (clase) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });
            break;


        case "del":
            models.respuestaforo.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                return res.json({ success: true, glosa: 'Deleted successfully' });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ success: false, glosa: err.message });
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
            models.preguntaforo.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntaforo.belongsTo(models.user, { foreignKey: 'usuariopregunta' });
            models.preguntaforo.count({
                where: data

            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntaforo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [
                        {
                            model: models.user
                        }
                    ]
                }).then(function (preguntaforo) {
                    return res.json({ records: records, total: total, page: page, rows: preguntaforo });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.listarespuestaforo = function (req, res) {

    var id = req.params.id;

    var page = 1
    var rows = 10
    var filters = req.params.filters

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.respuestaforo.belongsTo(models.preguntaforo, { foreignKey: 'idpreguntaforo' });
            models.respuestaforo.belongsTo(models.user, { foreignKey: 'usuariorespuesta' });
            models.respuestaforo.belongsTo(models.documentoscotizacion, { foreignKey: 'iddocumento' });
            models.respuestaforo.count({
                where: {
                    idpreguntaforo: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.respuestaforo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idpreguntaforo: id
                    },
                    include: [
                        {
                            model: models.user
                        },
                        {
                            model: models.documentoscotizacion
                        },

                    ]
                }).then(function (respuestaforo) {
                    //logger.debug(solicitudcotizacion)
                    res.json({ records: records, total: total, page: page, rows: respuestaforo });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
exports.docrespuesta = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'SELECT a.id, a.nombrecorto ' +
        'FROM sic.documentoscotizacion a ' +
        'join sic.solicitudcotizacion b on a.idsolicitudcotizacion=b.id ' +
        'where b.id=:id',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.forousuario = function (req, res) {

    var idforo = req.params.idforo;
    var idusuario = req.session.passport.user;

    sequelize.query(
        'SELECT usuariopregunta ' +
        'FROM sic.preguntaforo ' +
        'where id=:idforo',
        { replacements: { idforo: idforo }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        if (valores[0].usuariopregunta == idusuario) {
            return res.json({ validado: 1 })
        } else {
            return res.json({ validado: 0 })
        }
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}
exports.respuestausuario = function (req, res) {

    var idforo = req.params.idforo;
    var idusuario = req.session.passport.user;

    sequelize.query(
        'SELECT usuariorespuesta ' +
        'FROM sic.respuestaforo ' +
        'where id=:idforo',
        { replacements: { idforo: idforo }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        if (valores[0].usuariorespuesta == idusuario) {
            return res.json({ validado: 1 })
        } else {
            return res.json({ validado: 0 })
        }
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}