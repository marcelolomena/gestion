var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;
    var fechacreacion = req.body.fechacreacion
    var fechaproxvenc = req.body.fechaproxvenc
    var fechavencant = req.body.fechavencant
    var fechainf = req.body.fechainf

    if (action != "del") {
        if (req.body.fechacreacion != "")
            fechacreacion = req.body.fechacreacion.split("-").reverse().join("-")
        if (req.body.fechaproxvenc != "")
            fechaproxvenc = req.body.fechaproxvenc.split("-").reverse().join("-")
        if (req.body.fechavencant != "")
            fechavencant = req.body.fechavencant.split("-").reverse().join("-")
        if (req.body.fechainf != "")
            fechainf = req.body.fechainf.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.mac.create({
                rut: req.body.rut,
                nombre: req.body.nombre,
                actividad: req.body.actividad,
                oficina: req.body.oficina,
                ejecutivo: req.body.ejecutivo,
                fechacreacion: fechacreacion,
                fechaproxvenc: fechaproxvenc,
                fechavencant: fechavencant,
                ratinggrupo: req.body.ratinggrupo,
                nivelatr: req.body.nivelatr,
                ratingind: req.body.ratingind,
                clasificacion: req.body.clasificacion,
                vigilancia: req.body.vigilancia,
                fechainf: fechainf,
                promediosaldovista: req.body.promediosaldovista,
                deudasbif: req.body.deudasbif,
                aprobvinculado: req.body.aprobvinculado
            }).then(function (solicitudcotizacion) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.mac.update({
                rut: req.body.rut,
                nombre: req.body.nombre,
                actividad: req.body.actividad,
                oficina: req.body.oficina,
                ejecutivo: req.body.ejecutivo,
                fechacreacion: fechacreacion,
                fechaproxvenc: fechaproxvenc,
                fechavencant: fechavencant,
                ratinggrupo: req.body.ratinggrupo,
                nivelatr: req.body.nivelatr,
                ratingind: req.body.ratingind,
                clasificacion: req.body.clasificacion,
                vigilancia: req.body.vigilancia,
                fechainf: fechainf,
                promediosaldovista: req.body.promediosaldovista,
                deudasbif: req.body.deudasbif,
                aprobvinculado: req.body.aprobvinculado
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (solicitudcotizacion) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });



            break;
        case "del":
            models.mac.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
            });

            break;

    }
}

exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "Rut";

    if (!sord)
        sord = "asc";

    var orden = "[MacIndividual]." + sidx + " " + sord;

    var filter_one = []
    var filter_two = []
    var filter_three = []
    var filter_four = []

    if (filters != undefined) {
        //logger.debug(filters)
        var item = {}
        var jsonObj = JSON.parse(filters);

        jsonObj.rules.forEach(function (item) {
            if (item.field) {
                filter_one.push({ [item.field]: { $like: '%' + item.data + '%' } });
            }
        })
    }

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.MacIndividual.belongsTo(models.MacGrupalMacIndividual, { foreignKey: 'Id' });
            models.MacGrupalMacIndividual.belongsTo(models.MacGrupal, { foreignKey: 'MacGrupal_Id' });
            models.MacGrupal.belongsTo(models.Grupo, { foreignKey: 'Grupo_Id' });
            models.MacIndividual.count({
                where: filter_one
            }).then(function (records) {
                var total = Math.ceil(records / rows);

                models.MacIndividual.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: filter_one,
                    include: [{
                        model: models.MacGrupalMacIndividual,
                        include: [{
                            model: models.MacGrupal,
                            include: [{
                                model: models.Grupo
                            }]
                        }]
                    }]
                }).then(function (mac) {
                    return res.json({ records: records, total: total, page: page, rows: mac });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

}

exports.actionlimite = function (req, res) {
    var action = req.body.oper;
    var fechavencimiento = req.body.fechavencimiento
    if (action != "del") {
        if (req.body.fechavencimiento != "")
            fechavencimiento = req.body.fechavencimiento.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.limite.create({
                idmac: req.body.parent_id,
                numero: req.body.numero,
                tipolimite: req.body.tipolimite,
                tiporiesgo: req.body.tiporiesgo,
                plazoresidual: req.body.plazoresidual,
                abrobactual: req.body.abrobactual,
                deudaactual: req.body.deudaactual,
                someaprob: req.body.someaprob,
                moneda: req.body.moneda,
                garantiaestatal: req.body.garantiaestatal,
                aprobacionpuntual: req.body.aprobacionpuntual,
                fechavencimiento: fechavencimiento,
                comentario: req.body.comentario,
            }).then(function (limite) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.limite.update({
                numero: req.body.numero,
                tipolimite: req.body.tipolimite,
                tiporiesgo: req.body.tiporiesgo,
                plazoresidual: req.body.plazoresidual,
                abrobactual: req.body.abrobactual,
                deudaactual: req.body.deudaactual,
                someaprob: req.body.someaprob,
                moneda: req.body.moneda,
                garantiaestatal: req.body.garantiaestatal,
                aprobacionpuntual: req.body.aprobacionpuntual,
                fechavencimiento: fechavencimiento,
                comentario: req.body.comentario,
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (solicitudcotizacion) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });



            break;
        case "del":
            models.limite.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
            });

            break;

    }
}

exports.listlimite = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "MacIndividual_Id",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "Numero";

    if (!sord)
        sord = "asc";

    var orden = "[Linea]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.Linea.belongsTo(models.MacIndividual, { foreignKey: 'MacIndividual_Id' });
            models.Linea.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.Linea.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.MacIndividual
                    }]
                }).then(function (lineas) {
                    return res.json({ records: records, total: total, page: page, rows: lineas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.listsublimite = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "Linea_Id",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "Numero";

    if (!sord)
        sord = "asc";

    var orden = "[Sublinea]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.Sublinea.belongsTo(models.Linea, { foreignKey: 'Linea_Id' });
            models.Sublinea.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.Sublinea.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.Linea
                    }]
                }).then(function (lineas) {
                    return res.json({ records: records, total: total, page: page, rows: lineas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.listgarantiareallimite = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [];

    if (!sidx)
        sidx = "Id";

    if (!sord)
        sord = "asc";

    var orden = "[GarantiasReales]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.GarantiasReales.belongsToMany(models.Linea, { through: models.LineaGarantiaReal, foreignKey: 'GarantiasReales_Id' });
            models.Linea.belongsToMany(models.GarantiasReales, { through: models.LineaGarantiaReal, foreignKey: 'Linea_Id' });

            models.GarantiasReales.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.GarantiasReales.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.Linea, where: [{ Id: req.params.id }]
                    }]
                }).then(function (lineas) {
                    return res.json({ records: records, total: total, page: page, rows: lineas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.actiongarantia = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.limite.create({
                idmac: req.body.parent_id,
                numero: req.body.numero,
                tipolimite: req.body.tipolimite,
                tiporiesgo: req.body.tiporiesgo,
                plazoresidual: req.body.plazoresidual,
                abrobactual: req.body.abrobactual,
                deudaactual: req.body.deudaactual,
                someaprob: req.body.someaprob,
                moneda: req.body.moneda,
                garantiaestatal: req.body.garantiaestatal,
                aprobacionpuntual: req.body.aprobacionpuntual,
                fechavencimiento: fechavencimiento,
                comentario: req.body.comentario,
            }).then(function (limite) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.limite.update({
                numero: req.body.numero,
                tipolimite: req.body.tipolimite,
                tiporiesgo: req.body.tiporiesgo,
                plazoresidual: req.body.plazoresidual,
                abrobactual: req.body.abrobactual,
                deudaactual: req.body.deudaactual,
                someaprob: req.body.someaprob,
                moneda: req.body.moneda,
                garantiaestatal: req.body.garantiaestatal,
                aprobacionpuntual: req.body.aprobacionpuntual,
                fechavencimiento: fechavencimiento,
                comentario: req.body.comentario,
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (solicitudcotizacion) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });



            break;
        case "del":
            models.limite.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
            });

            break;

    }
}

exports.listgarantia = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "rutcliente",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "rutcliente";

    if (!sord)
        sord = "asc";

    var orden = "[clientegarantia]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.clientegarantia.belongsTo(models.cliente, { foreignKey: 'rutcliente' });
            models.clientegarantia.belongsTo(models.garantia, { foreignKey: 'idgarantia' });
            models.clientegarantia.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.clientegarantia.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.cliente
                    }, {
                        model: models.garantia
                    }]
                }).then(function (lineas) {
                    return res.json({ records: records, total: total, page: page, rows: lineas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.getdatoscliente = function (req, res) {
    sequelize.query(
        'select a.*, c.Nombre as grupo from scl.Empresa a '+
        'left outer join scl.GrupoEmpresa b on b.Empresa_Id=a.Id '+
        'left outer join scl.Grupo c on c.Id=b.Grupo_Id ' +
        'where a.Rut =  ' + req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.getdatosclientecongrupo = function (req, res) {
    sequelize.query(`
        select distinct c.Id as Idgrupo, c.Nombre as Grupo, f.* from scl.GrupoEmpresa a
        join scl.GrupoEmpresa b on b.Grupo_Id=a.Grupo_Id
        join scl.Grupo c on b.Grupo_Id = c.Id
        join scl.Empresa f on a.Empresa_Id=f.Id
        where a.Empresa_Id = `+ req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.getgrupo = function (req, res) {
    sequelize.query(
        'select a.Id, a.Nombre from scl.Grupo a  ' +
        'join scl.GrupoEmpresa b on b.Grupo_Id=a.Id  ' +
        'join scl.Empresa c on c.Id = b.Empresa_Id  ' +
        'where c.rut =  ' + req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.listmacs = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idgrupo",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "rut";

    if (!sord)
        sord = "asc";

    var orden = "[mac]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.mac.belongsTo(models.macgrupal, { foreignKey: 'idgrupo' });
            models.mac.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.mac.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.macgrupal
                    }]
                }).then(function (lineas) {
                    return res.json({ records: records, total: total, page: page, rows: lineas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.creargruponuevo = function (req, res) {
    sequelize.query(
        "EXEC scl.creargruponuevo " + req.params.id + ",'" + req.params.nombre + "'",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.crearmacgrupal = function (req, res) {
    models.MacGrupal.create({
        Grupo_Id: req.params.id
    }).then(function (macgrupal) {
        //console.log(macgrupal.Id)
        var empresas = req.body.empresas;
        sequelize.query(
            "EXEC scl.crearmacsengrupo " + macgrupal.Id + ",'" + JSON.stringify(empresas) + "'",
            { type: sequelize.QueryTypes.SELECT }
        ).then(function (valores) {
            console.dir(valores)
            return res.json({ error: 0, macgrupal: macgrupal });
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });

    }).catch(function (err) {
        logger.error(err)
        return res.json({ error: 1, glosa: err.message });
    });

}
exports.getdatosmacgrupal = function (req, res) {
    sequelize.query(
        'select a.*, b.Nombre as nombregrupo from scl.MacGrupal a ' +
        'join scl.Grupo b on a.Grupo_Id = b.Id ' +
        'where a.Id =  ' + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.getmacindividuales = function (req, res) {
    sequelize.query(
        'select a.* from scl.MacIndividual a  ' +
        'join scl.GrupoEmpresa c on c.Empresa_Id =a.Empresa_Id ' +
        'join scl.MacGrupal e on e.Grupo_Id = c.Grupo_Id '+
        'where e.Id =  ' + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}
exports.getmacindividual = function (req, res) {
    sequelize.query(
        'select * from scl.MacIndividual a  ' +
        'where Id =  ' + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.getmacporrut = function (req, res) {
    sequelize.query(
        'select Id from scl.MacIndividual a  ' +
        'where Rut =  ' + req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.gettiposaprobacion = function (req, res) {
    sequelize.query(
        'select * from scl.TipoAprobacion',
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}