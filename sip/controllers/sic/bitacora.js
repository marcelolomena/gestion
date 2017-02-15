var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var bitacora = require("../../utils/bitacora");
var co = require('co');


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
            models.bitacora.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.bitacora.belongsTo(models.user, { foreignKey: 'idusuario' });
            models.bitacora.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.bitacora.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: 'fecha desc',
                }).then(function (bitacora) {
                    return res.json({ records: records, total: total, page: page, rows: bitacora });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};