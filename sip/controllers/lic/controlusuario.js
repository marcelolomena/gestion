'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var constants = require("../../utils/constants");
var nodemailer = require('nodemailer');

var entity = models.controlusuario;

function list(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'fechaactualizacion';
    var sord = 'desc';
    var orden = "[controlusuario]." + sidx + " " + sord;
    var filter_one = []
    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.controlusuario.belongsTo(models.producto, {
                foreignKey: 'idproducto'
            });
            models.controlusuario.count({
                where: filter_one,
                include: [{
                    model: models.producto
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.controlusuario.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: filter_one,
                    include: [{
                        model: models.producto
                    }]
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
    var hoy = "" + new Date().toISOString();
    var codigosecuencie;
    switch (action) {
        case "add":
            sequelize.query("execute lic.seqControlUs").spread(function (numero) {
                codigosecuencie = numero[0].secuencia
                models.controlusuario.create({
                    idproducto: req.body.idproducto,
                    contacto: req.body.contacto,
                    fechaactualizacion: hoy,
                    observaciones: req.body.observaciones,
                    cantidad: req.body.cantidad,
                    codigointerno: codigosecuencie
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
                        success: false
                    });
                });
            });
            break;
        case "edit":
            models.controlusuario.update({
                idproducto: req.body.idproducto,
                contacto: req.body.contacto,
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

function getExcel(req, res) {
    var conf = {}
    conf.cols = [{
            caption: 'N',
            type: 'number',
            width: 3
        },
        {
            caption: 'ID',
            type: 'string',
            width: 200
        },
        {
            caption: 'Producto',
            type: 'string',
            width: 200
        },
        {
            caption: 'Contacto',
            type: 'string',
            width: 200
        },
        {
            caption: 'FechaActualizacion',
            type: 'String',
            width: 200
        },
        {
            caption: 'Observaciones',
            type: 'string',
            width: 200
        },
        {
            caption: 'Cantidad',
            type: 'number',
            width: 200
        }
    ];
    var sql = "SELECT b.nombre as nombreProd, a.contacto, a.fechaactualizacion, a.observaciones, a.cantidad, a.codigointerno " +
        "FROM lic.controlusuario a " +
        "JOIN lic.producto b ON b.id = a.idproducto " +
        "ORDER BY a.fechaactualizacion desc";

    // console.log("query:" + sql);
    sequelize.query(sql)
        .spread(function (control) {
            var arr = [];
            var nombreprod = '';
            for (var i = 0; i < control.length; i++) {

                if (nombreprod != control[i].nombreProd) {
                    var a = [i + 1,
                        control[i].codigointerno,
                        control[i].nombreProd,
                        control[i].contacto,
                        control[i].fechaactualizacion ? control[i].fechaactualizacion.toISOString().slice(0, 10) : 'sin fecha',
                        control[i].observaciones,
                        control[i].cantidad
                    ];
                    nombreprod = control[i].nombreProd
                } else {
                    var a = [i + 1,
                        control[i].codigointerno,
                        null,
                        control[i].contacto,
                        control[i].fechaactualizacion ? control[i].fechaactualizacion.toISOString().slice(0, 10) : 'sin fecha',
                        control[i].observaciones,
                        control[i].cantidad
                    ];
                    nombreprod = control[i].nombreProd
                }

                arr.push(a);
            }
            conf.rows = arr;

            var result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformates');
            res.setHeader("Content-Disposition", "attachment;filename=" + "ReporteControlLIC.xlsx");
            res.end(result, 'binary');

        }).catch(function (err) {
            logger.debug(err);
            res.json({
                error_code: 100
            });
        });

};

module.exports = {
    list: list,
    action: action,
    getExcel: getExcel
};