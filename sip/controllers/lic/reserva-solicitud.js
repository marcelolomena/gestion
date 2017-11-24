'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.reserva;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});


var includes = [{
    model: models.producto
}];

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
            estado: {
                nombre: item.parametro.nombre
            }
        }
    });
}

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}


function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            req.body.estado = 'Pendiente'
            req.body.idUsuario = req.session.passport.user;
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function estado(req, res) {
    var ntt = models.detalleRecepcion;
    base.listChilds(req, res, ntt, 'id', [{
        model: models.producto,
        model: models.fabricante,
        model: models.moneda
    }], function (data) {
        var result = [];
        _.each(data, function (item) {

            var row = {
                id: item.id,
                producto: item.nombre,
                idFabricante: item.idFabricante.nombre,
                fechaInicio: base.fromDate(item.fechaInicio),
                fechaTermino: base.fromDate(item.fechaTermino),
                fechaControl: base.fromDate(item.fechaControl),
                idMoneda: item.moneda.moneda,
                monto: item.monto,
                cantidad: item.cantidad,
                comentario: item.comentario
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
    action: action,
    estado: estado,
    usuariocui: usuariocui
};