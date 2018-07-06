var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');
var secuencia = require("../../utils/secuenciaSIC");

exports.action = function (req, res) {
    var action = req.body.oper;
    secuencia.getSecuencia(0, function (err, sec) {
        switch (action) {
            case "add":
                req.body.numerorfp = parseInt(sec);
                var hoy = "" + new Date().toISOString();
                if (req.body.fechaenviorfp) {
                    models.solicitudcotizacion.create({
                        idcui: req.body.idcui,
                        idtecnico: req.body.idtecnico,
                        tipocontrato: req.body.tipocontrato,
                        program_id: req.body.program_id,
                        codigoart: req.body.codigoart,
                        sap: req.body.sap,
                        descripcion: req.body.descripcion,
                        codigosolicitud: req.body.codigosolicitud,
                        idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                        idnegociador: req.body.idnegociador,
                        correonegociador: req.body.correonegociador,
                        fononegociador: req.body.fononegociador,
                        numerorfp: req.body.numerorfp,
                        fechaenviorfp: req.body.fechaenviorfp,
                        direccionnegociador: req.body.direccionnegociador,
                        colorestado: 'aGris',
                        borrado: 1,
                        idtipo: req.body.idtipo,
                        idgrupo: req.body.idgrupo,
                        idestado: req.body.idestado,
                        idadministracion: req.body.idadministracion ? req.body.idadministracion : null,
                        fechaasignacionadmin: req.body.fechaasignacionadmin ? req.body.fechaasignacionadmin : null
                    }).then(function (solicitudcotizacion) {
                        res.json({
                            error: 0,
                            glosa: ''
                        });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({
                            error: 1,
                            glosa: err.message
                        });
                    });
                } else {
                    req.body.fechaenviorfp = hoy;
                    models.solicitudcotizacion.create({
                        idcui: req.body.idcui,
                        idtecnico: req.body.idtecnico,
                        tipocontrato: req.body.tipocontrato,
                        program_id: req.body.program_id,
                        codigoart: req.body.codigoart,
                        sap: req.body.sap,
                        descripcion: req.body.descripcion,
                        codigosolicitud: req.body.codigosolicitud,
                        idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                        idnegociador: req.body.idnegociador,
                        correonegociador: req.body.correonegociador,
                        fononegociador: req.body.fononegociador,
                        numerorfp: req.body.numerorfp,
                        fechaenviorfp: req.body.fechaenviorfp,
                        direccionnegociador: req.body.direccionnegociador,
                        colorestado: 'aGris',
                        borrado: 1,
                        idtipo: req.body.idtipo,
                        idgrupo: req.body.idgrupo,
                        idestado: req.body.idestado,
                        idadministracion: req.body.idadministracion ? req.body.idadministracion : null,
                        fechaasignacionadmin: req.body.fechaasignacionadmin ? req.body.fechaasignacionadmin : null
                    }).then(function (solicitudcotizacion) {
                        res.json({
                            error: 0,
                            glosa: ''
                        });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({
                            error: 1,
                            glosa: err.message
                        });
                    });
                }
                break;
            case "edit":
                if (req.body.idadministracion != 0) {
                    req.body.fechaasignacionadmin = "" + new Date().toISOString();
                    models.solicitudcotizacion.update({
                        idcui: req.body.idcui,
                        idtecnico: req.body.idtecnico,
                        tipocontrato: req.body.tipocontrato,
                        program_id: req.body.program_id,
                        codigoart: req.body.codigoart,
                        sap: req.body.sap,
                        descripcion: req.body.descripcion,
                        codigosolicitud: req.body.codigosolicitud,
                        idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                        idnegociador: req.body.idnegociador,
                        correonegociador: req.body.correonegociador,
                        fononegociador: req.body.fononegociador,
                        direccionnegociador: req.body.direccionnegociador,
                        numerorfp: req.body.numerorfp,
                        fechaenviorfp: req.body.fechaenviorfp,
                        idestado: req.body.idestado,
                        idadministracion: req.body.idadministracion,
                        fechaasignacionadmin: req.body.fechaasignacionadmin
                    }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (solicitudcotizacion) {
                        res.json({
                            error: 0,
                            glosa: ''
                        });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({
                            error: 1,
                            glosa: err.message
                        });
                    });
                } else {
                    req.body.fechaasignacionadmin = "" + new Date().toISOString();
                    models.solicitudcotizacion.update({
                        idcui: req.body.idcui,
                        idtecnico: req.body.idtecnico,
                        tipocontrato: req.body.tipocontrato,
                        program_id: req.body.program_id,
                        codigoart: req.body.codigoart,
                        sap: req.body.sap,
                        descripcion: req.body.descripcion,
                        codigosolicitud: req.body.codigosolicitud,
                        idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                        idnegociador: req.body.idnegociador,
                        correonegociador: req.body.correonegociador,
                        fononegociador: req.body.fononegociador,
                        direccionnegociador: req.body.direccionnegociador,
                        numerorfp: req.body.numerorfp,
                        fechaenviorfp: req.body.fechaenviorfp,
                        idestado: req.body.idestado,
                        idadministracion: req.body.idadministracion,
                        fechaasignacionadmin: req.body.fechaasignacionadmin
                    }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (solicitudcotizacion) {
                        res.json({
                            error: 0,
                            glosa: ''
                        });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({
                            error: 1,
                            glosa: err.message
                        });
                    });
                }
                break;
            case "del":
                models.solicitudcotizacion.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        logger.debug('Deleted successfully');
                    }
                    res.json({
                        success: true,
                        glosa: ''
                    });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({
                        success: false,
                        glosa: err.message
                    });
                });
                break;
        }
    });
}

exports.list = function (req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'colorestado';
    var sord = req.query.sord || 'asc';
    var provee = req.query.provee;
    var orden = "[solicitudcotizacion]." + sidx + " " + sord;
    var filter_one = []
    var filter_two = []
    var filter_three = []
    var filter_four = []
    var filter_five = []
    var filter_six = []
    var isrequired = false;
    if (filters != undefined) {
        var item = {}
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.field === "codigosolicitud") {
                filter_one.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "numerorfp") {
                filter_one.push({
                    [item.field]: item.data
                });
            } else if (item.field === "cui") {
                filter_two.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "descripcion") {
                filter_one.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "first_name") {
                filter_three.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "negociador") {
                filter_four.push({
                    ['first_name']: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "administrador") {
                isrequired = true;
                filter_five.push({
                    ['first_name']: {
                        $like: '%' + item.data + '%'
                    }
                });
            }
        })
        filter_one.push({
            borrado: 1
        })
    }
    if (provee == undefined || provee == '0') {
        // filter_five = filter_one;
        utilSeq.buildConditionFilter(filters, function (err, data) {
            if (err) {
                logger.debug("->>> " + err)
            } else {
                models.solicitudcotizacion.belongsTo(models.estructuracui, {
                    foreignKey: 'idcui'
                });
                models.solicitudcotizacion.belongsTo(models.programa, {
                    foreignKey: 'program_id'
                });
                models.solicitudcotizacion.belongsTo(models.user, {
                    as: 'tecnico',
                    foreignKey: 'idtecnico'
                });
                models.solicitudcotizacion.belongsTo(models.valores, {
                    as: 'clasificacion',
                    foreignKey: 'idclasificacionsolicitud'
                });
                models.solicitudcotizacion.belongsTo(models.user, {
                    as: 'negociador',
                    foreignKey: 'idnegociador'
                });
                models.solicitudcotizacion.belongsTo(models.tipoclausula, {
                    foreignKey: 'idtipo'
                });
                models.solicitudcotizacion.belongsTo(models.valores, {
                    as: 'grupo',
                    foreignKey: 'idgrupo'
                });
                models.solicitudcotizacion.belongsTo(models.valores, {
                    as: 'estado',
                    foreignKey: 'idestado'
                });
                models.solicitudcotizacion.belongsTo(models.user, {
                    as: 'administrador',
                    foreignKey: 'idadministracion'

                });
                models.solicitudcotizacion.count({
                    where: filter_one,
                    include: [{
                        model: models.estructuracui,
                        where: filter_two
                    }, {
                        model: models.user,
                        as: 'tecnico',
                        where: filter_three
                    }, {
                        model: models.user,
                        as: 'negociador',
                        where: filter_four
                    }, {
                        model: models.user,
                        as: 'administrador',
                        where: filter_five,
                        required: isrequired
                    }]
                }).then(function (records) {
                    var total = Math.ceil(records / rows);
                    models.solicitudcotizacion.findAll({
                        offset: parseInt(rows * (page - 1)),
                        limit: parseInt(rows),
                        order: orden,
                        where: filter_one,
                        include: [{
                            model: models.estructuracui,
                            where: filter_two
                        }, {
                            model: models.programa //left
                        }, {
                            model: models.user,
                            as: 'tecnico',
                            where: filter_three
                        }, {
                            model: models.valores, //left
                            as: 'clasificacion'
                        }, {
                            model: models.user,
                            as: 'negociador',
                            where: filter_four
                        }, {
                            model: models.tipoclausula //left
                        }, {
                            model: models.valores, //left
                            as: 'grupo'
                        }, {
                            model: models.valores, //left
                            as: 'estado'
                        }, {
                            model: models.user,
                            as: 'administrador',
                            where: filter_five,
                            required: isrequired
                        }]
                    }).then(function (solicitudcotizacion) {
                        return res.json({
                            records: records,
                            total: total,
                            page: page,
                            rows: solicitudcotizacion
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
    } else {
        filter_six.push({
            ['idproveedor']: provee
        })
        utilSeq.buildConditionFilter(filters, function (err, data) {
            if (err) {
                logger.debug("->>> " + err)
            } else {
                models.solicitudcotizacion.belongsTo(models.estructuracui, {
                    foreignKey: 'idcui'
                });
                models.solicitudcotizacion.belongsTo(models.programa, {
                    foreignKey: 'program_id'
                });
                models.solicitudcotizacion.belongsTo(models.user, {
                    as: 'tecnico',
                    foreignKey: 'idtecnico'
                });
                models.solicitudcotizacion.belongsTo(models.valores, {
                    as: 'clasificacion',
                    foreignKey: 'idclasificacionsolicitud'
                });
                models.solicitudcotizacion.belongsTo(models.user, {
                    as: 'negociador',
                    foreignKey: 'idnegociador'
                });
                models.solicitudcotizacion.belongsTo(models.tipoclausula, {
                    foreignKey: 'idtipo'
                });
                models.solicitudcotizacion.belongsTo(models.valores, {
                    as: 'grupo',
                    foreignKey: 'idgrupo'
                });
                models.solicitudcotizacion.belongsTo(models.valores, {
                    as: 'estado',
                    foreignKey: 'idestado'
                });
                models.solicitudcotizacion.belongsTo(models.user, {
                    as: 'administrador',
                    foreignKey: 'idadministracion'
                });
                models.solicitudcotizacion.hasMany(models.solicitudcontrato, {
                    constraints: false,
                    foreignKey: 'idsolicitudcotizacion'
                })
                models.solicitudcotizacion.count({
                    where: filter_one,
                    include: [{
                        model: models.estructuracui,
                        where: filter_two
                    }, {
                        model: models.user,
                        as: 'tecnico',
                        where: filter_three
                    }, {
                        model: models.user,
                        as: 'negociador',
                        where: filter_four
                    }, {
                        model: models.user,
                        as: 'administrador',
                        where: filter_five,
                        required: isrequired
                    }, {
                        model: models.solicitudcontrato,
                        attributes: [
                            ['idsolicitudcotizacion', 'idsolicitudcotizacion']
                        ],
                        where: filter_six
                    }]
                }).then(function (records) {
                    var total = Math.ceil(records / rows);
                    models.solicitudcotizacion.findAll({
                        offset: parseInt(rows * (page - 1)),
                        limit: parseInt(rows),
                        order: orden,
                        where: filter_one,
                        include: [{
                            model: models.estructuracui,
                            where: filter_two
                        }, {
                            model: models.programa
                        }, {
                            model: models.user,
                            as: 'tecnico',
                            where: filter_three
                        }, {
                            model: models.valores,
                            as: 'clasificacion'
                        }, {
                            model: models.user,
                            as: 'negociador',
                            where: filter_four
                        }, {
                            model: models.tipoclausula
                        }, {
                            model: models.valores,
                            as: 'grupo'
                        }, {
                            model: models.valores,
                            as: 'estado'
                        }, {
                            model: models.user,
                            as: 'administrador',
                            where: filter_five,
                            required: isrequired
                        }, {
                            model: models.solicitudcontrato,
                            attributes: [
                                ['idsolicitudcotizacion', 'idsolicitudcotizacion']
                            ],
                            where: filter_six
                        }]
                    }).then(function (solicitudcotizacion) {
                        return res.json({
                            records: records,
                            total: total,
                            page: page,
                            rows: solicitudcotizacion
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
}

exports.tipoclausula = function (req, res) {
    models.tipoclausula.findAll({
        order: 'id ASC',
        attributes: ['id', 'nombre']
    }).then(function (tipoclausula) {
        return res.json(tipoclausula);
    }).catch(function (err) {
        logger.error(err.message);
        res.json({
            error_code: 1
        });
    });
}

exports.getcolorservicios = function (req, res) {
    var idsolicitud = req.params.idsolicitud;
    var sql = "select colornota from sic.serviciosrequeridos where idsolicitudcotizacion = " + idsolicitud;
    sequelize.query(sql)
        .spread(function (rows) {
            var colorfinal = 'Verde'
            for (var f in rows) {
                if (rows[f].colornota == 'Rojo') {
                    colorfinal = 'Rojo'
                } else {
                    if (colorfinal != 'Rojo') {
                        if (rows[f].colornota == 'Amarillo') {
                            colorfinal = 'Amarillo'
                        }
                    }
                }
            }
            res.json(colorfinal);
        });
};

exports.tecnicosresponsablescui = function (req, res) {
    var id = req.params.idcui;
    var sql = "select max(periodo) as periodo from RecursosHumanos";
    sequelize.query(sql)
        .spread(function (rows) {
            var periodo = rows[0].periodo
            var sql = "select distinct g.uid, f.nombre, f.apellido, f.numRut from sip.estructuracui a join dbo.art_user c on a.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.RecursosHumanos e on d.emailTrab = e.emailJefe join dbo.RecursosHumanos f on e.emailTrab = f.emailJefe join dbo.art_user g on f.emailTrab = g.email where a.id = " + id + " and d.periodo = " + periodo + " and e.periodo = " + periodo + " and f.periodo = " + periodo + "  UNION (select distinct g.uid, e.nombre, e.apellido, e.numRut from sip.estructuracui a join dbo.art_user c on a.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.RecursosHumanos e on d.emailTrab = e.emailJefe join dbo.art_user g on e.emailTrab = g.email where a.id = " + id + " and d.periodo = " + periodo + " and e.periodo = " + periodo + ") UNION (select distinct g.uid, d.nombre, d.apellido, d.numRut from sip.estructuracui a join dbo.art_user c on a.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.art_user g on d.emailTrab = g.email where a.id   =" + id + " and d.periodo = " + periodo + ") UNION (select distinct c.uid, c.first_name, c.last_name, '' from sip.estructuracui a join dbo.art_user c on a.uid = c.uid where a.id = " + id + ") order by  f.nombre, f.apellido, g.uid,f.numRut";
            sequelize.query(sql)
                .spread(function (rows) {
                    return res.json(rows);
                });
        });
};

exports.traerdatos = function (req, res) {
    var id = req.params.id;
    var sql = 'select a.email, b.telefonoTrab ' +
        'from dbo.art_user a ' +
        'join dbo.RecursosHumanos b on a.email = b.emailTrab ' +
        'where uid = ' + id + 'and periodo = (select max(periodo) from dbo.RecursosHumanos)'
    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });
};

exports.getUsuariosAdmin = function (req, res) {
    models.usrrol.belongsTo(models.user, {
        as: 'administrador',
        foreignKey: 'uid'
    });
    models.usrrol.findAll({
        order: 'id ASC',
        attributes: ['id', 'uid'],
        where: {
            idsistema: 2,
            rid: [26, 27],
            uid: {
                $ne: req.session.passport.user
            }
        },
        include: [{
            attributes: ['first_name', 'last_name'],
            model: models.user,
            as: 'administrador'
        }]
    }).then(function (usrol) {
        return res.json(usrol);
    }).catch(function (err) {
        logger.error(err);
        res.json({
            error: 1
        });
    });
}

exports.proveeAdjudicado = function (req, res) {
    sequelize.query('SELECT DISTINCT (a.id), c.id as idproveedor, c.razonsocial FROM sic.solicitudcotizacion a ' +
        'JOIN sic.solicitudcontrato b ON b.idsolicitudcotizacion = a.id ' +
        'JOIN sip.proveedor c ON c.id = b.idproveedor ' +
        'WHERE EXISTS (SELECT idproveedor FROM sic.solicitudcontrato)', {
            replacements: {
                user_profile: req.params.rol
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (user) {
        return res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({
            error_code: 1
        });
    });
}