'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var secuencia = require("../../utils/secuencia");

var entity = models.reserva;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.user, {
    as: 'solicitante',
    foreignKey: 'idUsuario'
});
entity.belongsTo(models.user, {
    as: 'aprobador',
    foreignKey: 'idUsuarioJefe'
});
entity.belongsTo(models.user, {
    foreignKey: 'idUsuarioAutoriza'
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


function listAuto(req, res) {
    var id = req.params.id;
    var aprob = 'Aprobado'
    var autorizado = 'Autorizado'
    var denegado = 'Denegado'
    var page = 1
    var rows = 10
    var filters = req.params.filters
    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.reserva.belongsTo(models.producto, {
                foreignKey: 'idProducto'
            });
            models.reserva.belongsTo(models.user, {
                as: 'solicitante',
                foreignKey: 'idUsuario'
            });
            models.reserva.belongsTo(models.user, {
                as: 'aprobador',
                foreignKey: 'idUsuarioJefe'
            });

            models.reserva.count({
                where: {
                    estado: [aprob, autorizado, denegado]
                },
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.reserva.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: ['estado'],
                    where: {
                        estado: [aprob, autorizado, denegado]
                    },
                    include: [{
                        model: models.producto
                    }, {
                        model: models.user,
                        as: 'solicitante'
                    }, {
                        model: models.user,
                        as: 'aprobador'
                    }]
                }).then(function (autorizados) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: autorizados
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

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

function action(req, res) {
    secuencia.getSecuencia(0, function (err, sec) {

        switch (req.body.oper) {
            case 'add':
                req.body.codAutoriza = sec;
                return base.create(entity, map(req), res);
            case 'edit':
                return base.findById(entity, req.body.id)
                    .then(function (reser) {
                        if (reser.estado!='Autorizado') {
                            return base.findById(models.producto, req.body.idProducto)
                                .then(function (prod) {
                                    var updData = {
                                        id: reser.idProducto
                                    }
                                    updData.licReserva = prod.licReserva + reser.numlicencia;
                                    base.update(models.producto, updData, res);
                                    var hoy = "" + new Date().toISOString();
                                    req.body.codAutoriza = sec;
                                    req.body.idUsuarioAutoriza = req.session.passport.user;
                                    req.body.fechaAutorizacion = hoy;
                                    return base.update(entity, map(req), res);
                                })
                        }
                    })





            case 'del':
                return base.destroy(entity, req.body.id, res);
        }
    });
}

function usuariocui(req, res) {

    models.sequelize.query("select b.cui from dbo.art_user a " +
        "join dbo.RecursosHumanos b on a.email = b.emailTrab " +
        "where a.uid = " + req.session.passport.user + " and periodo = (select max(periodo) from dbo.RecursosHumanos)").spread(function (rows) {
        return res.json(rows);
    });
}

module.exports = {
    list: list,
    action: action,
    usuariocui: usuariocui,
    listAuto: listAuto
};