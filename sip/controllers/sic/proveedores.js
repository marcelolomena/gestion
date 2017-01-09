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

    //logger.debug("----------->> " + req.body.idsolicitudcotizacion)

    switch (action) {
        case "add":

            models.solicitudproveedor.create({
                idsolicitud: req.body.idsolicitudcotizacion,
                idproveedor: req.body.idproveedor,
                borrado: 1
            }).then(function (solicitudproveedor) {
                res.json({ message: '', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false });
            });

            break;
        case "del":
            models.solicitudproveedor.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: 'Deleted successfully' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
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
        "field": "idsolicitud",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.solicitudproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitud' });
            models.solicitudproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.solicitudproveedor.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.solicitudproveedor.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.solicitudcotizacion
                    }, { model: models.proveedor }
                    ]
                }).then(function (solicitudproveedor) {
                    return res.json({ records: records, total: total, page: page, rows: solicitudproveedor });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};
