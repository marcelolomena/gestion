var models = require('../models');
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
        sidx = "a.Numero";
        sord = "asc";
    }


    var order = sidx + " " + sord;

    var sqlcount = `
    select count (*) from scl.Linea a 
    join scl.LineaEmpresa b on a.Id=b.Linea_Id
    join scl.Empresa c on c.Id=b.Empresa_Id
    where a.Padre_Id is null and c.Rut=`+ req.params.id;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, a.*, Monto, Activo, Comentario from scl.Linea a
        join scl.LineaEmpresa b on a.Id=b.Linea_Id
        join scl.Empresa c on c.Id=b.Empresa_Id
		left join scl.Bloqueo d on d.Linea_Id = b.Linea_Id
		where a.Padre_Id is null and c.Rut=`+ req.params.id;
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

exports.listsublimite = function (req, res) {
    //console.dir("***************EN LISTNEW ***************************");
    var page = req.query.page;
    var rowspp = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var condition = "";

    if (!sidx) {
        sidx = "a.Numero";
        sord = "asc";
    }


    var order = sidx + " " + sord;

    var sqlcount = `
    select count (*) from scl.Linea a
    join scl.LineaEmpresa b on b.Linea_Id=a.Id 
    join scl.Empresa c on c.Id = b.Empresa_Id
    where a.Padre_Id=`+ req.params.id + ' and c.Rut=' + req.params.rut;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, a.* from scl.Linea a 
        join scl.LineaEmpresa b on b.Linea_Id=a.Id 
        join scl.Empresa c on c.Id = b.Empresa_Id
        where a.Padre_Id=`+ req.params.id + ' and c.Rut=' + req.params.rut;
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
        'select a.*, c.Nombre as nombregrupo, c.Id as idgrupo, c.Rating as ratinggrupal from scl.Empresa a ' +
        'left outer join scl.GrupoEmpresa b on b.Empresa_Id=a.Id ' +
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
        'select * from scl.Linea a left join scl.Bloqueo b on a.Id = b.Linea_Id' +
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

exports.listtipooperaciones = function (req, res) {
    sequelize.query(
        `select distinct a.Id, f.Rut, a.Nombre from scl.TipoOperacion a
join scl.Operacion b on a.Codigo = b.TipoOperacion
join scl.SublineaOperacion c on c.Operacion_Id=b.Id
join scl.Sublinea d on d.Id = c.Sublinea_Id
join scl.EmpresaSublinea e on e.Sublinea_Id=d.Id
join scl.Empresa f on f.Id=e.Empresa_Id
where f.Rut=`+ req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listoperaciones2 = function (req, res) {
    sequelize.query(
        `select a.*, c.Numero from scl.Operacion a 
        join scl.SublineaOperacion b on b.Operacion_Id=a.Id
        join scl.Sublinea c on c.Id=b.Sublinea_Id
        join scl.EmpresaSublinea d on d.Sublinea_Id=c.Id
        join scl.Empresa e on e.Id=d.Empresa_Id
        join scl.TipoOperacion f on f.Codigo=a.TipoOperacion
        where e.Rut=`+ req.params.rut + ` and f.Id=` + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listproductoslinea = function (req, res) {
    sequelize.query(
        `select * from scl.TipoOperacion
            where TipoRiesgo='`+ req.params.id + `'`,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listcondicioneslinea = function (req, res) {
    sequelize.query(
        `select a.* from scl.Condicion a 
join scl.Sublinea b on a.Sublinea_Id=b.Id
join scl.Linea c on b.Linea_Id=c.Id
            where c.Id=`+ req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listgarantiaslinea = function (req, res) {
    sequelize.query(
        `select a.* from scl.Garantias a 
        join scl.GarantiasSublinea b on b.Garantias_Id=a.Id
        join scl.Sublinea c on b.Sublinea_Id=c.Id
        join scl.Linea d on c.Linea_Id=d.Id
            where d.Id=`+ req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.listcomentarioslinea = function (req, res) {
    sequelize.query(
        `select a.* from scl.Comentario a 
        join scl.ComentarioSublinea b on b.Comentario_Id=a.Id
        join scl.Sublinea c on b.Sublinea_Id=c.Id
        join scl.Linea d on c.Linea_Id=d.Id
            where d.Id=`+ req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};

exports.actionbloquear = function (req, res) {
    var idlinea = req.params.id;
    console.log("EEEEEEEEE");
    sequelize.query(`s
    update scl.Bloqueo 
    set Monto = '`+ req.body.monto + `'
    where Id=`+ idlinea).spread((results, metadata) => {
            return res.json(metadata);

        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1 });
        });
};

exports.listasignar = function (req, res) {
    sequelize.query(
        `select distinct a.Id, a.Nombre, b.RutEmpresa as Rut from scl.TipoOperacion a
        join scl.Operacion b on a.Codigo = b.TipoOperacion
        where b.RutEmpresa=`+ req.params.id + ' and b.Id Not In (select Id from scl.SublineaOperacion)',
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};



exports.operacionesasignar = function (req, res) {
    sequelize.query(
        `select a.* from scl.Operacion a 
        join scl.TipoOperacion f on f.Codigo=a.TipoOperacion
        where a.RutEmpresa=`+ req.params.rut + ` and f.Id=` + req.params.id + ' and a.Id Not In (select Id from scl.SublineaOperacion)',
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};


/**
 * INICIO TAB APROBACIONES
 */

exports.listaprobaciones = function (req, res) {
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
    select count (*) from scl.Aprobacion a
    join scl.TipoAprobacion b on a.TipoAprobacion_Id=b.Id
    join scl.EstadoAprobacion c on a.EstadoAprobacion_Id=c.Id
    where a.Rut =`+ req.params.id + ' and a.EstadoAprobacion_Id=' + req.params.estado;

    var sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rowspp + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        `as resultNum, a.*, b.Nombre as tipoaprobacion, c.Nombre as estadoaprobacion from scl.Aprobacion a
        join scl.TipoAprobacion b on a.TipoAprobacion_Id=b.Id
        join scl.EstadoAprobacion c on a.EstadoAprobacion_Id=c.Id
        where a.Rut =`+ req.params.id + ' and a.EstadoAprobacion_Id=' + req.params.estado;
    sqlok += ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        //console.log("Total:" + total + "recs[0].count:" + recs[0].count);
        //console.log("SQL2:" + sqlok);
        sequelize.query(sqlok).spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
        });
    });
};


exports.listverdetallebloqueo = function (req, res) {
    sequelize.query(
        `select a.Id as LineaID,a.Numero, a.Disponible, Monto,Activo,FechaBloqueo, Comentario from scl.Linea a
		left join scl.Bloqueo d on d.Linea_Id = a.Id
		where a.Id = 2` + req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};
/**
 * FIN TAB APROBACIONES
 */


exports.listoperacionesreserva = function (req, res) {
    sequelize.query( `
        select * from scl.Operacion a  
        join scl.LineaOperacion b on a.Id=b.Operacion_Id
        where Linea_Id =`+ req.params.id,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
};