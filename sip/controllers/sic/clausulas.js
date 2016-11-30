var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.clausulas.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idclausula: req.body.idclausula,
                uid: req.session.passport.user,
                texto: req.body.texto,
                borrado: 1
            }).then(function (clausulas) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.clausulas.update({
                idclausula: req.body.idclausula,
                uid: req.session.passport.user,
                texto: req.body.texto
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (clausulas) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });
            break;
        case "del":
            models.clausulas.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
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


    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    //var orden = "[clausulas]." + sidx + " " + sord;

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            //logger.debug(data)
            models.clausulas.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.clausulas.belongsTo(models.plantillaclausula, { foreignKey: 'idsolicitudcotizacion' });
            models.clausulas.belongsTo(models.user, { foreignKey: 'uid' });
            models.clausulas.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.clausulas.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: data,
                    include: [{
                        model: models.solicitudcotizacion
                    }, {
                        model: models.plantillaclausula
                    }, {
                        model: models.user
                    }
                    ]
                }).then(function (clausulas) {
                    res.json({ records: records, total: total, page: page, rows: clausulas });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};