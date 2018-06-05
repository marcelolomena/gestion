var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.etaparol.create({
                idetapa: req.body.idetapa,
                idrol: req.body.idrol
            }).then(function (etapasrol) {
                res.json({
                    error: 0,
                    glosa: 'creado'
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    error: 1,
                    glosa: err.message
                });
            });
            break;
        case "edit":
            models.etaparol.update({
                idetapa: req.body.idetapa,
                idrol: req.body.idrol
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (etaparo) {
                    res.json({
                        error: 0,
                        glosa: 'actualizado'
                    });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
            break;
        case "del":
            models.etaparol.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    logger.debug('borrado');
                }
                res.json({
                    success: true,
                    glosa: ''
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    success: false,
                    glosa: err.message
                });
            });
            break;
    }
}

exports.list = function (req, res) {
    var id = req.params.id;
    var usuario = req.session.passport.user
    var page = 1
    var rows = 10
    var filters = req.params.filters

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.etaparol.belongsTo(models.valores, {
                foreignKey: 'idetapa'
            });
            models.etaparol.belongsTo(models.rol, {
                foreignKey: 'idrol'
            });

            models.etaparol.count({
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.etaparol.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    include: [{
                        model: models.valores
                    }, {
                        model: models.rol
                    }]
                }).then(function (etapr) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: etapr
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

exports.etapassolicitud = function (req, res) {
    models.valores.findAll({
        where: {
            tipo: 'etapasolicitud'
        },
        order: 'valor'
    }).then(function (etapas) {
        return res.json(etapas);
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
    });
}

exports.rolSIC = function (req, res) {
    models.rol.findAll({
        where: {
            idsistema: 2
        },
        order: 'glosarol'
    }).then(function (etapas) {
        return res.json(etapas);
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
    });
}