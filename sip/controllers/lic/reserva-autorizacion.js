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
// entity.belongsTo(models.parametro, {
//     foreignKey: 'idEstado'
// });
// entity.belongsTo(models.user, {
//     foreignKey: 'idUsuario'
// });

var includes = [{
    model: models.producto
}, {
    model: models.parametro
}];

// function mapper(data) {
//     var result = [];
//     _.each(data, function (item) {
//         if (item.idEstado === 271) {
//             var row = {
//                 id: item.id,
//                 idProducto: items.idProducto,
//                 producto: {
//                     nombre: item.producto.nombre
//                 }
//             };
//             result.push(row);
//         }
//     });
//     return result;
// }





// function mapper(data) {
//     if(data.idEstado == 271){
//         _.each(data, function(item){
//             return _.map(item, function (items) {
//                 return {
//                     id: items.id,
//                     idProducto: items.idProducto
//                     // producto: {
//                     //     nombre: item.producto.nombre
//                     // }
//                 };
//             });





//         })




//     }



// }



// function mapper(data) {

//     _.each(data, function(item){
//         if(item.idEstado === 271){
//             _.each(entity, function(sItem) {
//                 return 
//             );




//             })
//         }
//     })



//     if (data.idEstado === 270) {
//         return _.map(data, function (item) {

//             var result = {
//                 id: item.id,
//                 idProducto: item.idProducto
//                 // producto: {
//                 //     nombre: item.producto.nombre
//                 // }
//             };
//             return result;

//         });
//     }

// }

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

// function mapper(data) {
//     return _.map(data, function (item) {
//         if (data.idEstado === 271) {
//             return {
//                 id: item.id,
//                 idProducto: item.idProducto,
//                 producto: {
//                     nombre: item.producto.nombre
//                 }
//                 // numlicencia: item.numlicencia,
//                 // fechaUso: base.fromDate(item.fechaUso),
//                 // fechaSolicitud: base.fromDate(item.fechaSolicitud),
//                 // cui: item.cui,
//                 // sap: item.sap,
//                 // comentarioSolicitud: item.comentarioSolicitud,
//                 // idEstado: item.idEstado,
//                 // estado: {
//                 //     nombre: item.parametro.nombre
//                 // },
//                 // fechaAprobacion: base.fromDate(fechaAprobacion),
//                 // comentarioAprobacion: item.comentarioAprobacion,
//                 // fechaAutorizacion: base.fromDate(fechaAutorizacion),
//                 // comentarioAutorizacion: item.comentarioAutorizacion

//             }
//         }
//     });
// }


function listAprobados(req, res) {
    models.parametro.findAll({
        where: {
            tipo: 'reservasolicitud',
            nombre: 'Aprobado'
        }
    }).then(function (estado1) {
        if (estado1.length != 0) {
            var aprobado = estado1[0].dataValues.id;
            models.parametro.findAll({
                where: {
                    tipo: 'reservasolicitud',
                    nombre: 'Autorizado'
                }
            }).then(function (estado2) {
                if (estado2.length != 0) {
                    var autorizado = estado2[0].dataValues.id;
                    var ntt = models.reserva;
                    base.list(req, res, ntt, [{
                        model: models.producto
                    }], function (data) {
                        var result = [];
                        _.each(data, function (item) {
                            if (item.idEstado === aprobado || item.idEstado === autorizado) {
                                result.push({
                                    id: item.id,
                                    idProducto: item.idProducto,
                                    producto: {
                                        nombre: item.producto.nombre
                                    },
                                    numLicencia: item.numlicencia
                                });
                            }
                        });
                        return result;
                    })
                }
            });
        }
    });
}






function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}


function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            // models.parametro.findAll({
            //     where: {
            //         tipo: 'reservasolicitud',
            //         nombre: 'Pendiente'
            //     }
            // }).then(function (estado) {
            //     if (estado.length != 0) {
            //         req.body.idEstado = estado[0].dataValues.id;

            //     }
            //     req.body.idUsuario = req.session.passport.user;
            //     return base.create(entity, map(req), res);
            // })



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