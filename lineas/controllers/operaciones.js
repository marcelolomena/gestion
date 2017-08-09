﻿var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.listlimite = function (req, res) {
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
  select count (*) from scl.Linea a  
join scl.Sublinea b on b.Linea_Id = a.Id
join scl.Empresa c on c.Id = b.Beneficiario_Id
where c.Rut=`+ req.params.id;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, a.* from scl.Linea a  
        join scl.Sublinea b on b.Linea_Id = a.Id
        join scl.Empresa c on c.Id = b.Beneficiario_Id
        where c.Rut=`+ req.params.id;
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

exports.getdatosclientelimite = function (req, res) {
    sequelize.query(
        'select a.*, c.Nombre as nombregrupo, c.Id as idgrupo, c.Rating as ratinggrupal from scl.Empresa a '+
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

exports.getdatoscliente = function (req, res) {
    sequelize.query(
        'select * from scl.Empresa ' +
        'where rut =  ' + req.params.rut,
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


exports.listoperacionmac = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "Id",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "rut";

    if (!sord)
        sord = "asc";

    var orden = "[MacIndividual]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.MacIndividual.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.MacIndividual.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    /*include: [{
                        model: models.MacIndividual
                    }]*/
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
        sidx = "Numero";  //ordenar por variable

    if (!sord)
        sord = "asc"; //ordenar por asc

    var orden = "[Sublinea]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.Sublinea.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.Sublinea.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    /*include: [{
                        model: models.MacIndividual
                    }]*/
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

exports.listveroperacionlimite = function (req, res) {
    sequelize.query(
        `select * from scl.Operacion a 
        join scl.SublineaOperacion b on a.Id = b.Operacion_Id
        join scl.Sublinea c on c.Id = b.Sublinea_Id
        join scl.Linea d on d.Id = c.Linea_Id
        where d.Id=` + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listverdetallelim = function (req, res) {
    sequelize.query(
        'select * from scl.Linea a  ' +
        'where Id =  ' + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listveroperacionsublimite = function (req, res) {
    sequelize.query(
        `select * from scl.Operacion a 
        join scl.SublineaOperacion b on a.Id = b.Operacion_Id
        join scl.Sublinea c on c.Id = b.Sublinea_Id
        where c.Id=` + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listverdetallelim2 = function (req, res) {
    sequelize.query(
        'select * from scl.Sublinea a  ' +
        'where Id =  ' + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listultimomac = function (req, res) {
    sequelize.query(
        'select * from scl.Aprobacion a  ' +
        'where Rut = ' + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listsublimop = function (req, res) {
    sequelize.query(
         `select *from scl.Operacion a 
          join scl.SublineaOperacion b on a.Id = b.Operacion_Id
          where b.Sublinea_Id=` + req.params.id, 
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};