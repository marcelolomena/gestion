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

    if (!sidx)
        sidx = "descripcion";

    if (!sord)
        sord = "asc";

    var orden = "[bitacora]." + sidx + " " + sord;

    var filter_one = []
    var filter_two = []
    var filter_three = []
    var filter_four = []
    filter_one.push({ idsolicitudcotizacion: req.params.id })

    if (filters != undefined) {
        //logger.debug(filters)
        var item = {}
        var jsonObj = JSON.parse(filters);

        jsonObj.rules.forEach(function (item) {
            if (item.field === "tabla" && item.data!=0) {
                filter_one.push({ [item.field]: item.data });
            } else if (item.field === "idregistro") {
                filter_one.push({ [item.field]: item.data });
            } /*else if (item.field === "cui") {
                filter_two.push({ [item.field]: { $like: '%' + item.data + '%' } });
            } else if (item.field === "descripcion") {
                filter_one.push({ [item.field]: { $like: '%' + item.data + '%' } });
            } else if (item.field === "first_name") {
                filter_three.push({ [item.field]: { $like: '%' + item.data + '%' } });
            } else if (item.field === "negociador") {
                filter_four.push({ ['first_name']: { $like: '%' + item.data + '%' } });
            } */
        })
        filter_one.push({ borrado: 1 })
       
    }

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.bitacora.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.bitacora.belongsTo(models.user, { foreignKey: 'idusuario' });
            models.bitacora.count({
                where: filter_one
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.bitacora.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: filter_one,
                    include: [
                        {
                            model: models.user},
                            {model: models.solicitudcotizacion
                        }
                    ],
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

exports.combobox = function (req, res) {
  models.bitacora.findAll({
    attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('tabla')), 'tabla']
    ],
    order: 'tabla'
  }).then(function (bitacora) {
    //iniciativas.forEach(log)
    return res.json(bitacora);
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error_code: 1 });
  });
}

exports.comboboxaction = function (req, res) {
  models.bitacora.findAll({
    attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('accion')), 'accion']
    ],
    order: 'accion'
  }).then(function (bitacora) {
    //iniciativas.forEach(log)
    return res.json(bitacora);
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error_code: 1 });
  });
}