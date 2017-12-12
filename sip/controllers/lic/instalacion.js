'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var secuencia = require("../../utils/secuencia");

var entity = models.instalacion;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.user, {
    as: 'solicitante',
    foreignKey: 'idUsuario'
});

var includes = [{
        model: models.producto
    },
    {
        model: models.user
    }
];

function map(req) {
    return {
        id: req.body.id,
        idProducto: req.body.idProducto,
        estado: req.body.estadoAutorizacion,
        fechaAutorizacion: req.body.fechaAutorizacion,
        comentarioAutorizacion: req.body.comentarioAutorizacion,
        codAutoriza: req.body.codAutoriza,
        idUsuarioAutoriza: req.body.idUsuarioAutoriza
    }
}


function list(req, res) {
    var id = req.params.id;
    var page = 1
    var rows = 10
    var filters = req.params.filters
    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.instalacion.belongsTo(models.producto, {
                foreignKey: 'idProducto'
            });
            models.instalacion.belongsTo(models.user, {
                as: 'solicitante',
                foreignKey: 'idUsuario'
            });
            models.instalacion.count({
                // where: {
                //     estado: [aprob, autorizado, denegado]
                // },
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.instalacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: ['estado'],
                    // where: {
                    //     estado: [aprob, autorizado, denegado]
                    // },
                    include: [{
                        model: models.producto
                    }, {
                        model: models.user,
                        as: 'solicitante'
                    }]
                }).then(function (instal) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: instal
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

module.exports = {
    list: list
};