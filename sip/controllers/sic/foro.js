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
            }).then(function (preguntaforo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });
            break;
        case "edit":


        case "del":
            models.preguntaforo.destroy({
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

exports.actionrespuesta = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.respuestaforo.create({
                idpreguntaforo: req.body.idpreguntaforo,
                glosarespuesta: req.body.glosarespuesta,
                usuariopregunta: req.session.passport.user,
                iddocumento: req.body.iddocumento,
                fechapregunta: new Date(),
                borrado: 1
            }).then(function (respuestaforo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });
            break;
        case "edit":


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