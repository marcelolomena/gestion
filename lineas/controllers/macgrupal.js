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
    //console.dir("***************EN LISTNEW ***************************");
    var page = req.query.page;
    var rowspp = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var condition = "";

    if (!sidx) {
        sidx = "a.Id";
        sord = "asc";
    }


    var order = sidx + " " + sord;

    var sqlcount = `
    select count (*) from scl.MacGrupo a
    join scl.GrupoEmpresa b on a.[GrupoEmpresa_Id]=b.Id
    join scl.Empresa c on b.Empresa_Id=c.Id
    where a.[MacGrupo_Id]=`+ req.params.id;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, a.Id as idcabecera, a.Acomite, b.Grupo_Id as idgrupo, 
        c.*
        ,d.[Directo]
        ,d.[Contingente]
        ,d.[Derivados]
        ,d.[EntregaDiferida]
        ,d.[TotalCliente]
        ,d.[VariacionAprobacion]
        ,d.[DeudaBancoDirecta]
        ,d.[GarantiaRealTopada]
        ,d.[SbifAchel]
        ,d.[Penetracion]
        from scl.MacGrupo a
        join scl.GrupoEmpresa b on a.[GrupoEmpresa_Id]=b.Id
        join scl.Empresa c on b.Empresa_Id=c.Id
        left outer join scl.Aprobacion d on a.Aprobacion_Id=d.Id
        where a.[MacGrupo_Id]=`+ req.params.id;
    sqlok += ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        console.log("Total:" + total + "recs[0].count:" + recs[0].count);
        console.log("SQL2:" + sqlok);
        sequelize.query(sqlok).spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
        });
    });
};
/*
exports.listindividuales = function (req, res) {

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

    var orden = "[MacIndividual]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.MacIndividual.belongsToMany(models.MacGrupal, { through: models.MacGrupalMacIndividual, foreignKey: 'MacIndividual_Id' });
            models.MacGrupal.belongsToMany(models.MacIndividual, { through: models.MacGrupalMacIndividual, foreignKey: 'MacGrupal_Id' });
            models.MacIndividual.count({
                where: data,
                include: [{
                    model: models.MacGrupal, where: [{Id: req.params.id}]
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.MacIndividual.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                    model: models.MacGrupal, where: [{Id: req.params.id}]
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
*/

exports.listindividuales = function (req, res) {
    //console.dir("***************EN LISTNEW ***************************");
    var page = req.query.page;
    var rowspp = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var condition = "";

    if (!sidx) {
        sidx = "a.id";
        sord = "asc";
    }


    var order = sidx + " " + sord;

    var sqlcount = `
  select count (*) from scl.MacIndividual a 
join scl.GrupoEmpresa c on c.Empresa_Id =a.Empresa_Id
join scl.MacGrupal e on e.Grupo_Id = c.Grupo_Id
where e.Id=`+ req.params.id;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, a.* from scl.MacIndividual a 
        join scl.GrupoEmpresa c on c.Empresa_Id =a.Empresa_Id
        join scl.MacGrupal e on e.Grupo_Id = c.Grupo_Id
        where e.Id=`+ req.params.id;
    sqlok += ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        console.log("Total:" + total + "recs[0].count:" + recs[0].count);
        console.log("SQL2:" + sqlok);
        sequelize.query(sqlok).spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
        });
    });
};

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
        "field": "idmac",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "numero";

    if (!sord)
        sord = "asc";

    var orden = "[limite]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.limite.belongsTo(models.mac, { foreignKey: 'idmac' });
            models.limite.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.limite.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.mac
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
        'select * from scl.cliente ' +
        'where rut =  ' + req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

};

exports.tipolimite = function (req, res) {
    sequelize.query(
        'select * from scl.TipoLinea ',
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}