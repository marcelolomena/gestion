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
            
            return res.json({ id: req.body.idsolicitudcotizacion, glosapregunta: req.body.glosapregunta, usuariopregunta: req.body.usuariopregunta, fechapregunta: req.body.fechapregunta, success: true });

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
            models.preguntacotizacion.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntacotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntacotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                }).then(function (preguntacotizacion) {
                    return res.json({ records: records, total: total, page: page, rows: preguntacotizacion });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.respuestaforolist = function (req, res) {

    var id = req.params.id;

    var page = 1
    var rows = 10
    var filters = req.params.filters

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.proveedorsugerido.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

            models.proveedorsugerido.count({
                where: {
                    idserviciorequerido: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.proveedorsugerido.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idserviciorequerido: id
                    },
                    include: [{
                        model: models.proveedor
                    }
                    ]
                }).then(function (proveedorsugerido) {
                    //logger.debug(solicitudcotizacion)
                    res.json({ records: records, total: total, page: page, rows: proveedorsugerido });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};

