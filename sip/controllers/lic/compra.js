'use strict';
var models = require('../../models');
var utilSeq = require('../../utils/seq');
var logger = require('../../utils/logger');
var base = require('./lic-controller');


var entity = models.compra;
function map(req) {
    return {
        id: req.body.id || 0,
        idLicencia: req.body.idLicencia,
        contrato: req.body.contrato,
        ordenCompra: req.body.ordenCompra,
        idCui: req.body.idCui,
        sap: req.body.sap,
        idProveedor: req.body.idProveedor,
        fechaCompra: req.body.fechaCompra,
        fechaExpiracion: req.body.fechaExpiracion,
        licCompradas: req.body.licCompradas,
        canSoporte: req.body.canSoporte,
        idMoneda: req.body.idMoneda,
        valorLicencia: req.body.valorLicencia,
        valorSoporte: req.body.valorSoporte,
        fechaRenovaSoporte: req.body.fechaRenovaSoporte,
        factura: req.body.factura,
        comprador: req.body.comprador,
        correoComprador: req.body.correoComprador
    }
}

function list(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'id';
    var sord = req.query.sord || 'desc';
    var orden = entity.name + '.' + sidx + ' ' + sord;
    var whereClause = base.where(filters);

    entity.belongsTo(models.estructuracui, { foreignKey: 'idCui' });
    entity.belongsTo(models.moneda, { foreignKey: 'idMoneda' });
    entity.belongsTo(models.proveedor, { foreignKey: 'idProveedor' });

    entity.count({
        where: whereClause
    })
        .then(function (records) {
            var total = Math.ceil(records / rows);
            entity.findAll({
                offset: parseInt(rows * (page - 1)),
                limit: parseInt(rows),
                order: orden,
                where: whereClause,
                include: [{
                    model: models.estructuracui
                }, {
                    model: models.moneda
                }, {
                    model: models.proveedor
                }]
            })
                .then(function (data) {
                    return res.json({ records: records, total: total, page: page, rows: data });
                })
        })
        .catch(function (err) {
            logger.error(err.message);
            res.json({ error_code: 1 });
        });
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}


module.exports = {
    list: list,
    action: action
};