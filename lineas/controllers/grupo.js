var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.grupo.create({
                rut: req.body.rut,
                nombre: req.body.nombre,
                razonsocial: req.body.razonsocial
            }).then(function (grupo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.grupo.update({
                rut: req.body.rut,
                nombre: req.body.nombre,
                razonsocial: req.body.razonsocial
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (grupo) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });



            break;
        case "del":
            models.grupo.destroy({
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
        sidx = "rut";

    if (!sord)
        sord = "asc";

    var orden = "[grupo]." + sidx + " " + sord;

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
            models.grupo.count({
                where: filter_one
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.grupo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: filter_one
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

exports.actiondesglose = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.grupocliente.create({
                idgrupo: req.body.parent_id,
                rutcliente: req.body.rutcliente
            }).then(function (grupo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });
            break;
        case "edit":
            models.grupocliente.update({
                rut: req.body.rutcliente
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (grupo) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });


            break;
        case "del":

            models.grupocliente.destroy({
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

exports.listdesglose = function (req, res) {

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
        sidx = "rutcliente";

    if (!sord)
        sord = "asc";

    var orden = "[grupocliente]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.grupocliente.belongsTo(models.grupo, { foreignKey: 'idgrupo' });
            models.grupocliente.belongsTo(models.cliente, { foreignKey: 'rutcliente' });
            models.grupocliente.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.grupocliente.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.grupo
                    }, {
                        model: models.cliente
                    }]
                }).then(function (grupocliente) {
                    return res.json({ records: records, total: total, page: page, rows: grupocliente });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.getgrupo = function (req, res) {
    sequelize.query(
        'select * from dbo.grupocliente ' +
        'where rutcliente =  ' + req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}

/*exports.listgrupoempresa = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "Empresa_Id";

    if (!sord)
        sord = "asc";

    var orden = "[GrupoEmpresa]." + sidx + " " + sord;

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (data) {
            //models.Empresa.belongsTo(models.GrupoEmpresa, { foreignKey: 'Id' });
            models.GrupoEmpresa.belongsTo(models.Empresa, { foreignKey: 'Empresa_Id' });
            models.GrupoEmpresa.belongsTo(models.Grupo, { foreignKey: 'Grupo_Id' });

            models.GrupoEmpresa.count({
                where: data,
                include: [{
                    model: models.Empresa, where: [{ Rut: req.params.id }]
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.GrupoEmpresa.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.Empresa, where: [{ Rut: req.params.id }]
                    }]
                }).then(function (grupocliente) {
                    return res.json({ records: records, total: total, page: page, rows: grupocliente });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};
*/
exports.listgrupoempresa = function (req, res) {
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
  select count (*) from GrupoEmpresa a
join GrupoEmpresa b on b.Grupo_Id=a.Grupo_Id
join Empresa c on b.Empresa_Id = c.Id
where a.Empresa_Id=`+ req.params.id;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, b.Id as idrelacion, b.Grupo_Id as idgrupo, c.* from GrupoEmpresa a
        join GrupoEmpresa b on b.Grupo_Id=a.Grupo_Id
        join Empresa c on b.Empresa_Id = c.Id
        where a.Empresa_Id=`+ req.params.id;
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

exports.actiongrupoempresa = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.GrupoEmpresa.create({
                Grupo_Id: req.body.grupo,
                Empresa_Id: req.body.Id
            }).then(function (grupo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });
            break;
        case "del":

            models.GrupoEmpresa.destroy({
                where: {
                    id: req.body.idrelacion
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