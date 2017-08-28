var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');


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

exports.getdatosclientecongrupo2 = function (req, res) {
    sequelize.query(`
        select Grupo_Id
        from scl.GrupoEmpresa a 
        join scl.Empresa b on a.Empresa_Id= b.Id
        where b.Rut = `+ req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

exports.getdatosclientecongrupo3 = function (req, res) {
    sequelize.query(`EXEC scl.crearmacgrupodegrupo ` + req.params.idgrupo+`, `+ req.params.idempresa ,
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

exports.creargruponuevo = function (req, res) {
    sequelize.query(
        "EXEC scl.creargruponuevo " + req.params.id + ",'" + req.params.nombre + "'",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error: 1 });
    });

}

exports.crearmacgrupal = function (req, res) {
    var idgrupo = req.params.id;
    models.MacGrupo.create({
        FechaCreacion: '23-08-2017'
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
        'select a.*, c.Id as idgrupo, c.Nombre as nombregrupo from scl.MacGrupo a ' +
        'join scl.GrupoEmpresa b on a.GrupoEmpresa_Id = b.Id ' +
        'join scl.Grupo c on b.Grupo_Id = c.Id ' +
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