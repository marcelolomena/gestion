'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var _ = require('lodash');

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
        numlicencia: req.body.numlicencia,
        fechaUso: base.toDate(req.body.fechaUso),
        fechaSolicitud: base.toDate(req.body.fechaSolicitud),
        cui: req.body.cui,
        sap: req.body.sap,
        comentarioSolicitud: req.body.comentarioSolicitud,
        estado: req.body.estado,
        idUsuario: req.body.idUsuario,
        fechaAprobacion: null,
        comentarioAprobacion: null,
        fechaAutorizacion: null,
        comentarioAutorizacion: null
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idProducto: item.idProducto,
            producto: {
                nombre: item.producto.nombre
            },
            numlicencia: item.numlicencia,
            fechaUso: base.fromDate(item.fechaUso),
            fechaSolicitud: base.fromDate(item.fechaSolicitud),
            cui: item.cui,
            sap: item.sap,
            comentarioSolicitud: item.comentarioSolicitud,
            estado: item.estado,
            idUsuario: item.idUsuario,
            user: {
                first_name: item.user.first_name +''+ item.user.last_name
            },
            idUsuarioJefe: item.idUsuarioJefe,
            userJefe: {
                first_name: item.user.first_name
            }
        }
    });
}

function list(req, res) {
    req.query.sord = 'asc',
        base.list(req, res, entity, includes, mapper);
}

function listDESC(req, res) {
    base.listDESC(req, res, entity, includes, mapper);
}




function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            req.body.estado = 'A la Espera'
            req.body.idUsuario = req.session.passport.user;
            return base.create(entity, map(req), res);
        case 'edit':
            req.body.estado = 'A la Espera'
            req.body.idUsuario = req.session.passport.user;
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function estado(req, res) {
    var ntt = models.reserva;
    base.listChilds(req, res, ntt, 'id', [{
        model: models.producto,
        model: models.user
    }], function (data) {
        var result = [];
        _.each(data, function (item) {

            var row = {
                id: item.id,
                estado: item.estado,
                fechaAprobacion: item.fechaAprobacion,
                comentarioAprobacion: item.comentarioAprobacion,
                fechaAprobacion: base.fromDate(item.fechaAprobacion),
                fechaAutorizacion: base.fromDate(item.fechaAutorizacion),
                comentarioAutorizacion: item.comentarioAutorizacion,
                idUsuario: item.idUsuario,
                user: {
                    first_name: item.user.first_name
                },
                idUsuarioJefe: item.idUsuarioJefe,
                userJefe: {
                    first_name: item.user.first_name
                }

            };
            result.push(row);
        });
        return result;
    })
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
    listDESC: listDESC,
    action: action,
    estado: estado,
    usuariocui: usuariocui
};