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
        id: req.body.id || 0,
        idProducto: req.body.idProducto || req.params.pId,
        numLicencia: req.body.numLicencia,
        fechaUso: base.toDate(req.body.fechaUso),
        cui: req.body.cui,
        sap: req.body.sap,
        comentarioSolicitud: req.body.comentarioSolicitud,
        estado: req.body.estadoAutorizacion,
        idUsuario: req.body.idUsuario,
        fechaAprobacion: base.toDate(req.body.fechaAprobacion),
        comentarioAprobacion: req.body.comentarioAprobacion,
        fechaAutorizacion: req.body.fechaAutorizacion,
        comentarioAutorizacion: req.body.comentarioAutorizacion,
        codAutoriza: req.body.codAutoriza ? req.body.codAutoriza : null

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
                foreignKey: 'idUsuario'
            });
            models.reserva.belongsTo(models.user, {
                foreignKey: 'idUsuarioJefe'
            });

            models.reserva.count({

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
                        model: models.user
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
                var hoy = "" + new Date().toISOString();
                req.body.codAutoriza = sec;
                req.body.fechaAutorizacion = hoy;
                return base.update(entity, map(req), res);
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