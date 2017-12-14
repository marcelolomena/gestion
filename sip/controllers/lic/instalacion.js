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
        idProducto: req.body.idProducto
    }
}


function list(req, res) {
    var id = req.params.id;
    var usuario = req.session.passport.user;
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
                foreignKey: 'idUsuario'
            });
            models.instalacion.count({
                where: {
                    idUsuario: usuario
                },
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.instalacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: ['estado'],
                    where: {
                        idUsuario: usuario
                    },
                    include: [{
                        model: models.producto
                    }, {
                        model: models.user
                    }]
                }).then(function (instal) {
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

function misAutorizaciones(req, res) {
    models.sequelize.query("select a.idproducto, b.nombre " +
    "from lic.reserva a " +
    "join lic.producto b on a.idproducto = b.id " +
    "where a.idusuario = " + req.session.passport.user + " and a.estado = 'Autorizado'").spread(function (rows) {
        return res.json(rows);
    });
}

module.exports = {
    list: list,
    misAutorizaciones: misAutorizaciones
};