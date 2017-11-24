'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');

var entity = models.reserva;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
// entity.belongsTo(models.user, {
//     foreignKey: 'idUsuario'
// });

var includes = [{
    model: models.producto
}];

function map(req) {
    return {
        id: req.body.id || 0,
        idProducto: req.body.idProducto || req.params.pId
        // numlicencia: req.body.numlicencia,
        // fechaUso: base.toDate(req.body.fechaUso),
        // fechaSolicitud: base.toDate(req.body.fechaSolicitud),
        // cui: req.body.cui,
        // sap: req.body.sap,
        // comentarioSolicitud: req.body.comentarioSolicitud,
        // idEstado: req.body.idEstado,
        // idUsuario: req.body.idUsuario,
        // fechaAprobacion: null,
        // comentarioAprobacion: null,
        // fechaAutorizacion: null,
        // comentarioAutorizacion: null
    }
}

function listAprobados(req, res) {
    var ntt = models.reserva;
    base.list(req, res, ntt, [{
        model: models.producto
    }], function (data) {
        var result = [];
        _.each(data, function (item) {
            if (item.estado === 'Aprobado' || item.estado === 'Autorizado') {
                result.push({
                    id: item.id,
                    idProducto: item.idProducto,
                    producto: {
                        nombre: item.producto.nombre
                    },
                    numLicencia: item.numlicencia,
                    fechaUso: base.fromDate(item.fechaUso),
                    cui: item.cui,
                    sap: item.sap,
                    idUsuario: item.idUsuario,
                    fechaAprobacion: item.fechaAprobacion,
                    comentarioSolicitud: item.comentarioSolicitud,
                    comentarioAprobacion: item.comentarioAprobacion,
                    estadoAprobacion: item.estado,
                    comentarioAutorizacion: item.comentarioAutorizacion
                });
            }
        });
        return result;
    })
}

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
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
    listAprobados: listAprobados
};