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
                res.json({ message: err.message, success: false })
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
                                res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
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
                                res.json({ message: err.message, success: false });
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
            res.json(rows);
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
                                res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
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
                                res.json({ message: err.message, success: false });
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
                nota: req.body.nota,
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
                            nota: req.body.nota,
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
                nota: req.body.nota,
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
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
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
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.criterios1 = function (req, res) {
    sequelize.query(`select a.id, a.nombre from sic.criterioevaluacion a 
join sic.serviciosrequeridos b on a.idclaseevaluaciontecnica=b.claseevaluaciontecnica
where b.id=:idserviciorequerido`,
        { replacements: { idserviciorequerido: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.criterios2 = function (req, res) {
    sequelize.query(`select a.id, a.nombre from sic.criterioevaluacion2 a 
join sic.criterioevaluacion b on a.idcriterioevaluacion=b.id
join sic.notaevaluaciontecnica c on c.idcriterioevaluacion = b.id
where c.id = :idnota`,
        { replacements: { idnota: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};