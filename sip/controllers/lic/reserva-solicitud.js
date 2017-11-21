'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.reservaSolicitud;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.parametro, {
    foreignKey: 'idEstado'
});


var includes = [{
    model: models.producto
}, {
    model: models.parametro
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
        comentario: req.body.comentario,
        idEstado: req.body.idEstado,
        idUsuario : req.body.idUsuario
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
            comentario: item.comentario,
            idEstado: item.idEstado,
            estado: {
                nombre: item.parametro.nombre
            },
            idUsuario: item.idUsuario,
            usuario: {
                nombre: item.user.first_name
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
            models.parametro.findAll({
                where: {
                    tipo: 'reservasolicitud',
                    nombre: 'Pendiente'
                }
            }).then(function(estado){
                if(estado.length!=0){
                    req.body.idEstado = estado[0].dataValues.id;

                }
                req.body.idUsuario = req.session.passport.user;
                return base.create(entity, map(req), res);
            })
        
        
        
        
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


function getProducto(req, res) {
    var idFabricante = req.params.idFabricante;
    
    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};

function usuariocui(req, res){
    var uid = req.params.uid
    var sql = 'select b.cui from dbo.art_user a join dbo.RecursosHumanos b on a.email = b.emailTrab where a.uid = ' + uid;
    models.sequelize.query("select b.cui from dbo.art_user a " +
    "join dbo.RecursosHumanos b on a.email = b.emailTrab " +
    "where a.uid = " +req.params.uid + " and periodo = (select max(periodo) from dbo.RecursosHumanos)").spread(function (rows) {
        return res.json(rows);
    });
}

exports.updateTotales = function (req, res) {
    logger.debug("****id:" + req.params.id);
    sequelize.query('EXECUTE sip.actualizadetallepre ' + req.params.id
      + ';').then(function (response) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err)
        res.json(err);
      });
  
  };


module.exports = {
    list: list,
    action: action,
    estado: estado,
    usuariocui: usuariocui
};