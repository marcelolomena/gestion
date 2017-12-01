'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var utilSeq = require('../../utils/seq');
var logger = require('../../utils/logger');
var fs = require('fs');
var path = require("path");
var _ = require('lodash');

var entity = models.reserva;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.user, {
    foreignKey: 'idUsuario'
});
entity.belongsTo(models.user, {
    foreignKey: 'idUsuarioJefe'
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
            idUsuarioJefe: item.idUsuarioJefe
        }
    });
}

function listSolicitud(req, res) {
    var id = req.params.id;
    var usuario = req.session.passport.user
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
                where: {
                    idUsuario: usuario
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.reserva.findAll({
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
    req.query.sord = 'asc',
        base.list(req, res, entity, includes, mapper);
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            req.body.estado = 'A la Espera'
            req.body.idUsuario = req.session.passport.user;
            return base.create(entity, map(req), res);
        case 'edit':
            req.body.idUsuario = req.session.passport.user;
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function nombreJefe(req, res) {
    var id = req.params.pId;
    var sql = 'select b.first_name, b.last_name from lic.reserva a join dbo.art_user b on a.idusuariojefe = b.uid where a.id = ' + id;
    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });
}

function estado(req, res) {
    var ntt = entity;
    var idReserva = req.params.pId;


    var sql = 'select b.first_name, b.last_name from lic.reserva a join dbo.art_user b on a.idusuariojefe = b.uid where a.id = ' + idReserva;
    sequelize.query(sql)
        .spread(function (rows) {

            if (rows.length > 0) {
                var userJefe = rows[0].first_name + ' ' + rows[0].last_name;

                base.listChilds(req, res, ntt, 'id', [{
                        model: models.producto
                    },
                    {
                        model: models.user
                    }
                ], function (data) {
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
                            idUsuarioJefe: item.idUsuarioJefe,
                            userJefe: userJefe
                        };
                        result.push(row);
                    });
                    return result;
                });
            } else {
                var idUsuarioJe = null;
                base.listChilds(req, res, ntt, 'id', [{
                        model: models.producto
                    },
                    {
                        model: models.user
                    }
                ], function (data) {
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
                            idUsuarioJefe: item.idUsuarioJefe,
                            userJefe: idUsuarioJe
                        };
                        result.push(row);
                    });
                    return result;
                });
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

function cambioEstado(req, res) {
    models.sequelize.query("SELECT estado FROM lic.reserva WHERE id = " + req.params.pId).spread(function (rows) {
        return res.json(rows);
    });
}

function solicitudReservaPDF(req, res) {
    try {
        var jsreport = require('jsreport-core')()
        var helpers = fs.readFileSync(path.join(__dirname, '', 'helpers', 'reserva.js'), 'utf8');
        var sql_ok =
            `
            SELECT 
            id,
            idproducto,
            numlicencia,
            fechauso,
            fechasolicitud,
            cui,
            sap,
            comentariosolicitud,
            estado,
            idusuario,
            fechaaprobacion,
            comentarioaprobacion,
            fechaautorizacion,
            comentarioautorizacion,
            idusuariojefe,
            codautoriza
             FROM lic.reserva 
             WHERE id =:id
            `
        //Si continuidad sql_1, proyectos sql_2
        
        //console.log("****SQL:"+sql_ok);
        sequelize.query(sql_ok, {
            replacements: {
                id: req.params.id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {
            
            var datum = {
                "reserva": rows
            }

            

            jsreport.init().then(function () {
                return jsreport.render({
                    template: {
                        content: fs.readFileSync(path.join(__dirname, '', 'templates', 'reserva.html'), 'utf8'),
                        helpers: helpers,
                        engine: 'handlebars',
                        recipe: 'phantom-pdf',
                        phantom: {
                            orientation: 'portrait',
                            format: 'Letter',
                            margin: '1cm'
                        }
                    },
                    data: datum
                }).then(function (resp) {
                    res.header('Content-type', 'application/pdf');
                    resp.stream.pipe(res);
                    //console.info("es nuevo")
                }).catch(function (e) {
                    logger.error(e)
                })

            }).catch(function (e) {
                logger.error(e)
            })

        }).catch(function (err) {
            logger.error(err)
        });

    } catch (e) {
        logger.error(e)
    }


}

module.exports = {
    list: list,
    nombreJefe: nombreJefe,
    action: action,
    estado: estado,
    usuariocui: usuariocui,
    listSolicitud: listSolicitud,
    cambioEstado: cambioEstado,
    solicitudReservaPDF: solicitudReservaPDF
};