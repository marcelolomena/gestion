'use strict';
var models = require('../../models');
// var sequelize = require('../../models/index').sequelize;
// var nodeExcel = require('excel-export');
var utilSeq = require('../../utils/seq');
// var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
// var Busboy = require('busboy');
// var path = require('path');
// var fs = require('fs');
// var constants = require("../../utils/constants");
// var nodemailer = require('nodemailer');

var entity = models.controlusuario;

function list(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx
    var sord = req.query.sord
    // var provee = req.query.provee;
    // var orden = "[solicitudcotizacion]." + sidx + " " + sord;
    var filter_one = []
    var filter_two = []
    var filter_tres = []

    var isrequired = false;
    if (filters != undefined) {
        var item = {}
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.field === "nombreProd") {
                filter_two.push({
                    ['nombre']: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "usuario") {
                filter_one.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            }
        })
    }
    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.controlusuario.belongsTo(models.producto, {
                foreignKey: 'idproducto'
            });
            models.controlusuario.count({
                where: filter_one,
                // include: [{
                //     model: models.producto,
                //     where: filter_two
                // }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.controlusuario.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    // order: orden,
                    where: filter_one
                    // include: [{
                    //     model: models.producto,
                    //     where: filter_two
                    // }]
                }).then(function (controlusuario) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: controlusuario
                    });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({
                        error_code: 1
                    });
                });
            })
        }
    });
}

function action(req, res) {
    var action = req.body.oper;
    switch (action) {
        case "add":
            models.controlusuario.create({
                idproducto: req.body.idproducto,
                administrador: req.body.administrador,
                fechaactualizacion: req.body.fechaactualizacion,
                observaciones: req.body.observaciones,
                cantidad: req.body.cantidad
            }).then(function (instal) {
                return res.json({
                    id: instal.id,
                    message: 'CREADO',
                    success: true,
                    error: 0
                });
            }).catch(function (err) {
                logger.error(err)
                return res.json({
                    id: instal.id,
                    message: 'FALLA',
                    success: false,

                });
            });
            break;
        case "edit":
            models.controlusuario.update({
                idproducto: req.body.idproducto,
                administrador: req.body.administrador,
                fechaactualizacion: req.body.fechaactualizacion,
                observaciones: req.body.observaciones,
                cantidad: req.body.cantidad
            }, {
                where: {
                    id: req.body.id
                }
            }).then(function (clase) {
                res.json({
                    id: req.body.id,
                    message: 'EDITADO',
                    success: true,
                    error: 0
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    message: 'FALLA',
                    success: false
                });
            });
            break;
        case "del":
            models.controlusuario.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
                res.json({
                    error: 0,
                    glosa: 'BORRADO'
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    error: 1,
                    glosa: 'FALLA'
                });
            });
            break;
    }
}

// function getExcel(req, res) {
//     var page = req.query.page;
//     var rows = req.query.rows;
//     var filters = req.query.filters;
//     var sidx = req.query.sidx;
//     var sord = req.query.sord;
//     var condition = "";
//     var gris = "WHERE a.alertarenovacion <> 'aGris'"
//     // logger.debug("En getExcel");
//     var conf = {}
//     conf.cols = [{
//             caption: 'id',
//             type: 'number',
//             width: 3
//         },
//         {
//             caption: 'Producto',
//             type: 'string',
//             width: 200
//         },
//         {
//             caption: 'Usuario',
//             type: 'string',
//             width: 200
//         },
//         {
//             caption: 'Ubicación',
//             type: 'string',
//             width: 200
//         },
//         {
//             caption: 'CódigoInterno',
//             type: 'string',
//             width: 200
//         },
//         {
//             caption: 'CUI',
//             type: 'string',
//             width: 200
//         },
//         {
//             caption: 'Observación',
//             type: 'string',
//             width: 200
//         }
//     ];
//     var sql = "SELECT b.nombre, a.usuario, a.ubicacion, a.codigoInterno, a.observacion, a.cui FROM lic.ubicacioninstalacion a " +
//         "JOIN lic.producto b ON b.id = a.idproducto " +
//         "ORDER BY a.idproducto ASC";

//     // console.log("query:" + sql);
//     sequelize.query(sql)
//         .spread(function (ubicacion) {
//             var arr = [];
//             var nombreprod = '';
//             for (var i = 0; i < ubicacion.length; i++) {

//                 if (nombreprod != ubicacion[i].nombre) {
//                     var a = [i + 1,
//                         ubicacion[i].nombre,
//                         ubicacion[i].usuario,
//                         ubicacion[i].ubicacion,
//                         ubicacion[i].codigoInterno,
//                         ubicacion[i].cui,
//                         ubicacion[i].observacion
//                     ];
//                     nombreprod = ubicacion[i].nombre
//                 } else {
//                     var a = [i + 1,
//                         null,
//                         ubicacion[i].usuario,
//                         ubicacion[i].ubicacion,
//                         ubicacion[i].codigoInterno,
//                         ubicacion[i].cui,
//                         ubicacion[i].observacion
//                     ];
//                     nombreprod = ubicacion[i].nombre
//                 }

//                 arr.push(a);
//             }
//             conf.rows = arr;

//             var result = nodeExcel.execute(conf);
//             res.setHeader('Content-Type', 'application/vnd.openxmlformates');
//             res.setHeader("Content-Disposition", "attachment;filename=" + "ReporteUbicacionesLIC.xlsx");
//             res.end(result, 'binary');

//         }).catch(function (err) {
//             logger.debug(err);
//             res.json({
//                 error_code: 100
//             });
//         });

// };

module.exports = {
    list: list,
    action: action
    // getExcel: getExcel
};