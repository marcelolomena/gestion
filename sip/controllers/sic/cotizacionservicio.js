var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var nodeExcel = require('excel-export');
var async = require('async');
var csv = require('csv');
var co = require('co');
var bulk = require("../../utils/bulk");
var nodeExcel = require('excel-export');

exports.action = function (req, res) {
    var action = req.body.oper;
    var costototal = req.body.costototal
    var fecha = req.body.fecha

    if (action != "del") {
        if (fecha != "")
            fecha = fecha.split("-").reverse().join("-")
        if (costototal != "")
            costototal = costototal.split(".").join("").replace(",", ".")
    }
    switch (action) {
        case "add":
            models.cotizacionservicio.create({
                idserviciorequerido: req.body.parent_id,
                idproveedor: req.body.idproveedor,
                idmoneda: req.body.idmoneda,
                fecha: fecha,
                comentario: req.body.comentario,
                costototal: costototal,
                borrado: 1
            }).then(function (foro) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'cotizacionservicio',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.cotizacionservicio,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    }
                )
            }).catch(function (err) {
                logger.error(err)
                return res.json({ message: err.message, success: false })
            });
            break;
        case "edit":
            bitacora.registrarhijo(
                req.body.idsolicitudcotizacion,
                'cotizacionservicio',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.cotizacionservicio,
                function (err, data) {
                    if (!err) {
                        models.cotizacionservicio.update({
                            fecha: fecha,
                            comentario: req.body.comentario,
                            idmoneda: req.body.idmoneda,
                            costototal: costototal
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (respuestaforo) {
                                return res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });
            break;


        case "del":
            models.cotizacionservicio.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (respuesta) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'cotizacionservicio',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.cotizacionservicio,
                    function (err, data) {
                        if (!err) {
                            models.cotizacionservicio.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            })
            break;
    }
}


exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idserviciorequerido",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.cotizacionservicio.belongsTo(models.serviciosrequeridos, { foreignKey: 'idserviciorequerido' });
            models.cotizacionservicio.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.cotizacionservicio.belongsTo(models.moneda, { foreignKey: 'idmoneda' });
            models.cotizacionservicio.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.cotizacionservicio.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }, {
                        model: models.moneda
                    }]

                }).then(function (cotizacionservicio) {
                    return res.json({ records: records, total: total, page: page, rows: cotizacionservicio });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.proveedoressugeridosservicio = function (req, res) {

    var id = req.params.id;
    var sql = "select c.id, c.razonsocial from sic.proveedorsugerido a " +
        "join sip.proveedor c on c.id = a.idproveedor " +
        "where a.idserviciorequerido=" + id + "; "

    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};

exports.actionflujo = function (req, res) {
    var action = req.body.oper;
    var costoorigen = req.body.costoorigen
    logger.debug("costo origen: " + costoorigen)

    if (action != "del") {
        if (costoorigen != "")
            costoorigen = costoorigen.split(".").join("").replace(",", ".")
    }


    switch (action) {
        case "add":
            models.flujocotizacion.create({
                idcotizacion: req.body.parent_id,
                periodo: req.body.periodo,
                glosaitem: req.body.glosaitem,
                costoorigen: costoorigen,
                borrado: 1
            }).then(function (foro) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'flujocotizacion',
                    foro.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.flujocotizacion,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: foro.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    }
                )
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false })
            });
            break;
        case "edit":
            bitacora.registrarhijo(
                req.body.idsolicitudcotizacion,
                'flujocotizacion',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.flujocotizacion,
                function (err, data) {
                    if (!err) {
                        models.flujocotizacion.update({
                            periodo: req.body.periodo,
                            glosaitem: req.body.glosaitem,
                            costoorigen: costoorigen,
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (respuestaforo) {
                                return res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });
            break;


        case "del":
            models.flujocotizacion.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (respuesta) {
                bitacora.registrarhijo(
                    req.body.idsolicitudcotizacion,
                    'flujocotizacion',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.flujocotizacion,
                    function (err, data) {
                        if (!err) {
                            models.flujocotizacion.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            })
            break;
    }
}


exports.listflujo = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.flujocotizacion.belongsTo(models.cotizacionservicio, { foreignKey: 'idcotizacion' });
            models.flujocotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.flujocotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data

                }).then(function (cotizacionservicio) {
                    return res.json({ records: records, total: total, page: page, rows: cotizacionservicio });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.actionnota = function (req, res) {
    var action = req.body.oper;
    var idsolicitudcotizacion = req.body.abuelo;
    console.dir('ESTO ES UN IDSOLICITUDCOTIZACION: ' + idsolicitudcotizacion);

    switch (action) {
        case "add":
            models.notaevaluaciontecnica.create({
                idserviciorequerido: req.body.parent_id,
                idcriterioevaluacion: req.body.idcriterioevaluacion,
                idproveedor: req.body.idproveedor,
                nota:req.body.nota,
                comentario: req.body.comentario,
                borrado: 1
            }).then(function (notaevaluaciontecnica) {
                bitacora.registrarhijo(
                    idsolicitudcotizacion,
                    'notaevaluaciontecnicalv1',
                    notaevaluaciontecnica.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.notaevaluaciontecnica,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: notaevaluaciontecnica.id, parent: idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: notaevaluaciontecnica.id, parent: idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ message: err.message, success: false })
            });

            break;
        case "edit":
            bitacora.registrarhijo(
                idsolicitudcotizacion,
                'notaevaluaciontecnicalv1',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.notaevaluaciontecnica,
                function (err, data) {
                    if (!err) {
                        models.notaevaluaciontecnica.update({
                            idcriterioevaluacion: req.body.idcriterioevaluacion,
                            idproveedor: req.body.idproveedor,
                            nota:req.body.nota,
                            comentario: req.body.comentario
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (notaevaluaciontecnica) {
                                return res.json({ id: req.body.id, parent: idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });
            break;


        case "del":
            models.notaevaluaciontecnica.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (notaevaluaciontecnica) {
                bitacora.registrarhijo(
                    idsolicitudcotizacion,
                    'notaevaluaciontecnicalv1',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.notaevaluaciontecnica,
                    function (err, data) {
                        if (!err) {
                            models.notaevaluaciontecnica.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            });
            break;
    }
}


exports.listnota = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idserviciorequerido",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.notaevaluaciontecnica.belongsTo(models.serviciosrequeridos, { foreignKey: 'idserviciorequerido' });
            models.notaevaluaciontecnica.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.notaevaluaciontecnica.belongsTo(models.criterioevaluacion, { foreignKey: 'idcriterioevaluacion' });
            models.notaevaluaciontecnica.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.notaevaluaciontecnica.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }, {
                        model: models.criterioevaluacion
                    }]

                }).then(function (notaevaluaciontecnica) {
                    return res.json({ records: records, total: total, page: page, rows: notaevaluaciontecnica });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.actionnota2 = function (req, res) {
    var action = req.body.oper;

    var idsolicitudcotizacion = req.body.idsolicitudcotizacion;
    console.dir('ESTO ES UN IDSOLICITUDCOTIZACION: ' + idsolicitudcotizacion);

    switch (action) {
        case "add":
            models.notaevaluaciontecnica2.create({
                idnotaevaluaciontecnica: req.body.parent_id,
                idcriterioevaluacion2: req.body.idcriterioevaluacion2,
                idproveedor: req.body.idproveedor,
                nota:req.body.nota,
                comentario: req.body.comentario,
                borrado: 1
            }).then(function (notaevaluaciontecnica2) {
                bitacora.registrarhijo(
                    idsolicitudcotizacion,
                    'notaevaluaciontecnicalv2',
                    notaevaluaciontecnica2.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.notaevaluaciontecnica2,
                    function (err, data) {
                        if (!err) {
                            models.notaevaluaciontecnica2.belongsTo(models.criterioevaluacion2, { foreignKey: 'idcriterioevaluacion2' });
                            models.notaevaluaciontecnica2.findAll({
                                where: {
                                    idnotaevaluaciontecnica: req.body.parent_id
                                },
                                include: [{
                                    model: models.criterioevaluacion2
                                }]
                            }).then(function (notaevaluaciontecnica3) {
                                sequelize.query(`select sum((c.porcentaje/100) * a.nota ) notaponderada, sum(c.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica2 a 
                                                join sic.notaevaluaciontecnica b on b.id=a.idnotaevaluaciontecnica
                                                join sic.criterioevaluacion2 c on c.id=a.idcriterioevaluacion2
                                                where b.id=:idnota1`,
                                        { replacements: { idnota1: req.body.parent_id }, type: sequelize.QueryTypes.SELECT }
                                ).then(function(notaevaluaciontecnica1){
                                    var suma2 = notaevaluaciontecnica1[0].notaponderada
                                    var sumaporcentaje2 = notaevaluaciontecnica1[0].sumaporcentaje
                                    logger.debug("--------------------------------->>> esto es la suma final2 lv1: " + suma2)
                                    logger.debug("--------------------------------->>> esto es la suma porcentaje2 lv1: " + sumaporcentaje2)
                                    if(sumaporcentaje2 == 100){
                                        logger.debug("100% : " + sumaporcentaje2 + " id --> " + req.body.idnota1)
                                        models.notaevaluaciontecnica.update({
                                            nota: suma2
                                        }, {
                                            where: {
                                                id: req.body.idnota1
                                            }
                                        })
                                    }else{
                                        logger.debug("<100% : " + sumaporcentaje2 + " id --> " + req.body.idnota1)
                                            models.notaevaluaciontecnica.update({
                                                nota: 0
                                            }, {
                                                    where: {
                                                        id: req.body.idnota1
                                                    }
                                                })
                                    }

                                }).catch(function (err) {
                                        logger.error(err)
                                        return res.json({ error_code: 1 });
                                });

                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false })
                            });
                        return res.json({ id: notaevaluaciontecnica2.id, parent: idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: notaevaluaciontecnica2.id, parent: idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });

            }).catch(function (err) {
                logger.error(err)
                return res.json({ message: err.message, success: false })
            });
            break;
        case "edit":
            bitacora.registrarhijo(
                idsolicitudcotizacion,
                'notaevaluaciontecnicalv2',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.notaevaluaciontecnica2,
                function (err, data) {
                    if (!err) {
                        models.notaevaluaciontecnica2.update({
                            idcriterioevaluacion2: req.body.idcriterioevaluacion2,
                            idproveedor: req.body.idproveedor,
                            nota: req.body.nota,
                            comentario: req.body.comentario
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (notaevaluaciontecnica2) {
                                sequelize.query(`select sum((c.porcentaje/100) * a.nota ) notaponderada, sum(c.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica2 a 
                                                join sic.notaevaluaciontecnica b on b.id=a.idnotaevaluaciontecnica
                                                join sic.criterioevaluacion2 c on c.id=a.idcriterioevaluacion2
                                                where b.id=:idnota1`,
                                        { replacements: { idnota1: req.body.parent_id }, type: sequelize.QueryTypes.SELECT }
                                ).then(function(notaevaluaciontecnica1){
                                    var suma2 = notaevaluaciontecnica1[0].notaponderada
                                    var sumaporcentaje2 = notaevaluaciontecnica1[0].sumaporcentaje
                                    logger.debug("--------------------------------->>> esto es la suma final2 lv1: " + suma2)
                                    logger.debug("--------------------------------->>> esto es la suma porcentaje2 lv1: " + sumaporcentaje2)
                                    if(sumaporcentaje2 == 100){
                                        logger.debug("100% : " + sumaporcentaje2 + " id --> " + req.body.idnota1)
                                        models.notaevaluaciontecnica.update({
                                            nota: suma2
                                        }, {
                                            where: {
                                                id: req.body.idnota1
                                            }
                                        })
                                    }else{
                                        logger.debug("<100% : " + sumaporcentaje2 + " id --> " + req.body.idnota1)
                                            models.notaevaluaciontecnica.update({
                                                nota: 0
                                            }, {
                                                    where: {
                                                        id: req.body.idnota1
                                                    }
                                                })
                                    }

                                }).catch(function (err) {
                                        logger.error(err)
                                        return res.json({ error_code: 1 });
                                });


                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    }
                });
                return res.json({ id: req.body.id, /*parent: idsolicitudcotizacion, */message: 'Inicio carga', success: true });
            break;


        case "del":
            models.notaevaluaciontecnica2.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (notaevaluaciontecnica2) {
                bitacora.registrarhijo(
                    idsolicitudcotizacion,
                    'notaevaluaciontecnicalv2',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.notaevaluaciontecnica2,
                    function (err, data) {
                        if (!err) {





                            models.notaevaluaciontecnica2.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {

                                models.notaevaluaciontecnica2.belongsTo(models.criterioevaluacion2, { foreignKey: 'idcriterioevaluacion2' });
                                models.notaevaluaciontecnica2.findAll({
                                    where: {
                                        idnotaevaluaciontecnica: req.body.parent_id
                                    },
                                    include: [{
                                        model: models.criterioevaluacion2
                                    }]
                                }).then(function (notaevaluaciontecnica2) {
                                    console.dir(notaevaluaciontecnica2)
                                    /*
                                    var suma = 0
                                    var sumaporcentaje = 0
                                    for (var i in notaevaluaciontecnica2) {
                                        var notaponderada = (notaevaluaciontecnica2[i].criterioevaluacion2.porcentaje) / 100 * notaevaluaciontecnica2[i].nota
                                        suma = suma + notaponderada;
                                        logger.debug("esto es una suma: " + suma)
                                        sumaporcentaje = sumaporcentaje + notaevaluaciontecnica2[i].criterioevaluacion2.porcentaje

                                    }
                                    logger.debug("esto es la suma final: " + suma)
                                    logger.debug("esto es la suma porcentaje: " + sumaporcentaje)
                                    */
                                    calculito(notaevaluaciontecnica2).then(function (resultado) {
                                        console.dir(resultado);
                                        if (resultado[1] == 100) {
                                            models.notaevaluaciontecnica.update({
                                                nota: resultado[0]
                                            }, {
                                                    where: {
                                                        id: req.body.parent_id
                                                    }
                                                })
                                        } else {
                                            models.notaevaluaciontecnica.update({
                                                nota: 0
                                            }, {
                                                    where: {
                                                        id: req.body.parent_id
                                                    }
                                                })
                                        }
                                    }).catch(function (err) {
                                        console.log("salio por aqui")
                                        logger.error(err)
                                    });

                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ message: err.message, success: false })
                                });

                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            });
            break;
    }
}

var calculito = function (row) {
    //Todo: agregar idprefactura
    return new Promise(function (resolve, reject) {
        try {
            console.dir(row)
            var suma = 0
            var sumaporcentaje = 0
            var res = []
            for (var i in row) {
                logger.debug("porcentaje [" + row[i].criterioevaluacion2.porcentaje + "]")
                logger.debug("nota [" + row[i].nota + "]")
                var notaponderada = (row[i].criterioevaluacion2.porcentaje) / 100 * row[i].nota
                suma = suma + notaponderada;
                sumaporcentaje = sumaporcentaje + row[i].criterioevaluacion2.porcentaje

                res.push(suma)
                res.push(sumaporcentaje)
            }

            resolve(res);

        } catch (err) {
            reject(err);
        }
    })

}


exports.listnota2 = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idnotaevaluaciontecnica",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.notaevaluaciontecnica2.belongsTo(models.notaevaluaciontecnica, { foreignKey: 'idnotaevaluaciontecnica' });
            models.notaevaluaciontecnica2.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.notaevaluaciontecnica2.belongsTo(models.criterioevaluacion2, { foreignKey: 'idcriterioevaluacion2' });
            models.notaevaluaciontecnica2.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.notaevaluaciontecnica2.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }, {
                        model: models.criterioevaluacion2
                    }]

                }).then(function (notaevaluaciontecnica) {
                    return res.json({ records: records, total: total, page: page, rows: notaevaluaciontecnica });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.nivelclase = function (req, res) {
    sequelize.query('select a.niveles from sic.claseevaluaciontecnica a where a.id=:idclase',
        { replacements: { idclase: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        return res.json(user);
    }).catch(function (err) {
        logger.error(err)
        return res.json({ error_code: 1 });
    });
};


exports.criterios1 = function (req, res) {
    sequelize.query(`select a.id, a.nombre from sic.criterioevaluacion a 
join sic.serviciosrequeridos b on a.idclaseevaluaciontecnica=b.claseevaluaciontecnica
where b.id=:idserviciorequerido`,
        { replacements: { idserviciorequerido: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        return res.json(user);
    }).catch(function (err) {
        logger.error(err)
        return res.json({ error_code: 1 });
    });
};

exports.criterios2 = function (req, res) {
    sequelize.query(`select a.id, a.nombre from sic.criterioevaluacion2 a 
join sic.criterioevaluacion b on a.idcriterioevaluacion=b.id
join sic.notaevaluaciontecnica c on c.idcriterioevaluacion = b.id
where c.id = :idnota`,
        { replacements: { idnota: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        return res.json(user);
    }).catch(function (err) {
        logger.error(err)
        return res.json({ error_code: 1 });
    });
};

exports.listnota3 = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idnotaevaluaciontecnica2",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.notaevaluaciontecnica3.belongsTo(models.notaevaluaciontecnica2, { foreignKey: 'idnotaevaluaciontecnica2' });
            models.notaevaluaciontecnica3.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.notaevaluaciontecnica3.belongsTo(models.criterioevaluacion3, { foreignKey: 'idcriterioevaluacion3' });
            models.notaevaluaciontecnica3.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.notaevaluaciontecnica3.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }, {
                        model: models.criterioevaluacion3
                    }]

                }).then(function (notaevaluaciontecnica3) {
                    return res.json({ records: records, total: total, page: page, rows: notaevaluaciontecnica3 });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.actionnota3 = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.notaevaluaciontecnica3.create({
                idnotaevaluaciontecnica2: req.body.parent_id,
                idcriterioevaluacion3: req.body.idcriterioevaluacion3,
                idproveedor: req.body.idproveedor,
                nota: req.body.nota,
                comentario: req.body.comentario,
                respuesta: req.body.respuesta,
                borrado: 1
            }).then(function (actualizados) {
                sequelize.query(`select sum((b.porcentaje/100) * a.nota) notaponderada, sum(b.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica3 a
                                                    join sic.criterioevaluacion3 b on a.idcriterioevaluacion3 = b.id
                                                    where a.idnotaevaluaciontecnica2 = :idnotaevaluaciontecnica2`,
                    { replacements: { idnotaevaluaciontecnica2: req.body.parent_id }, type: sequelize.QueryTypes.SELECT }
                ).then(function (notaevaluaciontecnica3) {
                    var suma = notaevaluaciontecnica3[0].notaponderada
                    var sumaporcentaje = notaevaluaciontecnica3[0].sumaporcentaje
                    logger.debug("================================>>> esto es la suma final lv2: " + suma)
                    logger.debug("================================>>> esto es la suma porcentaje lv2: " + sumaporcentaje)

                    if (sumaporcentaje == 100) {
                        models.notaevaluaciontecnica2.update({
                            nota: suma
                        }, {
                                where: {
                                    id: req.body.parent_id
                                }
                            }).then(function (nota4) {

                                sequelize.query(`select sum((c.porcentaje/100) * a.nota ) notaponderada, sum(c.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica2 a 
                                                join sic.notaevaluaciontecnica b on b.id=a.idnotaevaluaciontecnica
                                                join sic.criterioevaluacion2 c on c.id=a.idcriterioevaluacion2
                                                where b.id=:idnota1`,
                                    { replacements: { idnota1: req.body.idnota1 }, type: sequelize.QueryTypes.SELECT }
                                ).then(function (notaevaluaciontecnica2) {
                                    var suma2 = notaevaluaciontecnica2[0].notaponderada
                                    var sumaporcentaje2 = notaevaluaciontecnica2[0].sumaporcentaje
                                    logger.debug("--------------------------------->>> esto es la suma final2 lv1: " + suma2)
                                    logger.debug("--------------------------------->>> esto es la suma porcentaje2 lv1: " + sumaporcentaje2)
                                    if (sumaporcentaje2 == 100) {
                                        models.notaevaluaciontecnica.update({
                                            nota: suma2
                                        }, {
                                                where: {
                                                    id: req.body.idnota1
                                                }
                                            })
                                    } else {
                                        models.notaevaluaciontecnica.update({
                                            nota: 0
                                        }, {
                                                where: {
                                                    id: req.body.idnota1
                                                }
                                            })
                                    }
                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ error_code: 1 });
                                });
                            })
                    } else {
                        models.notaevaluaciontecnica2.update({
                            nota: 0
                        }, {
                                where: {
                                    id: req.body.parent_id
                                }
                            })
                    }

                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ message: err.message, success: false })
                });
                return res.json({ id: notaevaluaciontecnica3.id, /*parent: idsolicitudcotizacion,*/ message: 'Inicio carga', success: true });

            }).catch(function (err) {
                logger.error(err)
                return res.json({ message: err.message, success: false })
            });
            break;
        case "edit":

            models.notaevaluaciontecnica3.update({

                nota: req.body.nota,
                comentario: req.body.comentario,
                respuesta: req.body.respuesta
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (actualizados) {

                    sequelize.query(`select sum((b.porcentaje/100) * a.nota) notaponderada, sum(b.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica3 a
                                                    join sic.criterioevaluacion3 b on a.idcriterioevaluacion3 = b.id
                                                    where a.idnotaevaluaciontecnica2 = :idnotaevaluaciontecnica2`,
                        { replacements: { idnotaevaluaciontecnica2: req.body.parent_id }, type: sequelize.QueryTypes.SELECT }
                    ).then(function (notaevaluaciontecnica3) {
                        var suma = notaevaluaciontecnica3[0].notaponderada
                        var sumaporcentaje = notaevaluaciontecnica3[0].sumaporcentaje
                        logger.debug("================================>>> esto es la suma final lv2: " + suma)
                        logger.debug("================================>>> esto es la suma porcentaje lv2: " + sumaporcentaje)

                        if (sumaporcentaje == 100) {
                            models.notaevaluaciontecnica2.update({
                                nota: suma
                            }, {
                                    where: {
                                        id: req.body.parent_id
                                    }
                                }).then(function (nota4) {

                                    sequelize.query(`select sum((c.porcentaje/100) * a.nota ) notaponderada, sum(c.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica2 a 
                                                join sic.notaevaluaciontecnica b on b.id=a.idnotaevaluaciontecnica
                                                join sic.criterioevaluacion2 c on c.id=a.idcriterioevaluacion2
                                                where b.id=:idnota1`,
                                        { replacements: { idnota1: req.body.idnota1 }, type: sequelize.QueryTypes.SELECT }
                                    ).then(function (notaevaluaciontecnica2) {
                                        var suma2 = notaevaluaciontecnica2[0].notaponderada
                                        var sumaporcentaje2 = notaevaluaciontecnica2[0].sumaporcentaje
                                        logger.debug("--------------------------------->>> esto es la suma final2 lv1: " + suma2)
                                        logger.debug("--------------------------------->>> esto es la suma porcentaje2 lv1: " + sumaporcentaje2)
                                        if (sumaporcentaje2 == 100) {
                                            logger.debug("100% : " + sumaporcentaje2 + " id --> " + req.body.idnota1)
                                            models.notaevaluaciontecnica.update({
                                                nota: suma2
                                            }, {
                                                    where: {
                                                        id: req.body.idnota1
                                                    }
                                                })
                                        } else {
                                            logger.debug("<100% : " + sumaporcentaje2 + " id --> " + req.body.idnota1)
                                            models.notaevaluaciontecnica.update({
                                                nota: 0
                                            }, {
                                                    where: {
                                                        id: req.body.idnota1
                                                    }
                                                })
                                        }
                                    }).catch(function (err) {
                                        logger.error(err)
                                        return res.json({ error_code: 1 });
                                    });
                                })
                        } else {
                            models.notaevaluaciontecnica2.update({
                                nota: 0
                            }, {
                                    where: {
                                        id: req.body.parent_id
                                    }
                                })
                        }

                    }).catch(function (err) {
                        logger.error(err)
                        return res.json({ message: err.message, success: false })
                    });
                    return res.json({ id: req.body.id, /*parent: idsolicitudcotizacion, */message: 'Inicio carga', success: true });
                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ message: err.message, success: false });
                });


            break;


        case "del":

            models.notaevaluaciontecnica3.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {

                sequelize.query(`select sum((b.porcentaje/100) * a.nota) notaponderada, sum(b.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica3 a
                                                    join sic.criterioevaluacion3 b on a.idcriterioevaluacion3 = b.id
                                                    where a.idnotaevaluaciontecnica2 = :idnotaevaluaciontecnica2`,
                    { replacements: { idnotaevaluaciontecnica2: req.body.parent_id }, type: sequelize.QueryTypes.SELECT }
                ).then(function (notaevaluaciontecnica3) {
                    var suma = notaevaluaciontecnica3[0].notaponderada
                    var sumaporcentaje = notaevaluaciontecnica3[0].sumaporcentaje
                    logger.debug("================================>>> esto es la suma final lv2: " + suma)
                    logger.debug("================================>>> esto es la suma porcentaje lv2: " + sumaporcentaje)

                    if (sumaporcentaje == 100) {
                        models.notaevaluaciontecnica2.update({
                            nota: suma
                        }, {
                                where: {
                                    id: req.body.parent_id
                                }
                            }).then(function (nota4) {

                                sequelize.query(`select sum((c.porcentaje/100) * a.nota ) notaponderada, sum(c.porcentaje) sumaporcentaje from sic.notaevaluaciontecnica2 a 
                                                join sic.notaevaluaciontecnica b on b.id=a.idnotaevaluaciontecnica
                                                join sic.criterioevaluacion2 c on c.id=a.idcriterioevaluacion2
                                                where b.id=:idnota1`,
                                    { replacements: { idnota1: req.body.idnota1 }, type: sequelize.QueryTypes.SELECT }
                                ).then(function (notaevaluaciontecnica2) {
                                    var suma2 = notaevaluaciontecnica2[0].notaponderada
                                    var sumaporcentaje2 = notaevaluaciontecnica2[0].sumaporcentaje
                                    logger.debug("--------------------------------->>> esto es la suma final2 lv1: " + suma2)
                                    logger.debug("--------------------------------->>> esto es la suma porcentaje2 lv1: " + sumaporcentaje2)
                                    if (sumaporcentaje2 == 100) {
                                        models.notaevaluaciontecnica.update({
                                            nota: suma2
                                        }, {
                                                where: {
                                                    id: req.body.idnota1
                                                }
                                            })
                                    } else {
                                        models.notaevaluaciontecnica.update({
                                            nota: 0
                                        }, {
                                                where: {
                                                    id: req.body.idnota1
                                                }
                                            })
                                    }
                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ error_code: 1 });
                                });
                            })
                    } else {
                        models.notaevaluaciontecnica2.update({
                            nota: 0
                        }, {
                                where: {
                                    id: req.body.parent_id
                                }
                            })
                    }

                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ message: err.message, success: false })
                });

                return res.json({ message: '', sucess: true });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ message: err.message, success: false });
            });



            break;
    }
}

exports.criterios3 = function (req, res) {
    sequelize.query(`select a.id, a.pregunta from sic.criterioevaluacion3 a 
join sic.criterioevaluacion2 b on a.idcriterioevaluacion2=b.id
join sic.notaevaluaciontecnica2 c on c.idcriterioevaluacion2 = b.id
where c.id = :idnota`,
        { replacements: { idnota: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        return res.json(user);
    }).catch(function (err) {
        logger.error(err)
        return res.json({ error_code: 1 });
    });
};

exports.proveedoressugeridosserviciodesdenota2 = function (req, res) {

    var id = req.params.id;
    var sql = `select c.id, c.razonsocial from sic.proveedorsugerido a 
        join sip.proveedor c on c.id = a.idproveedor 
		join sic.serviciosrequeridos d on a.idserviciorequerido=d.id
		join sic.notaevaluaciontecnica e on e.idserviciorequerido=d.id
		join sic.notaevaluaciontecnica2 f on f.idnotaevaluaciontecnica=e.id
        where f.id=`+ id

    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};