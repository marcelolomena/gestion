var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var co = require('co');
var logger = require("../utils/logger");
exports.csv = function (req, res) {
    var _idejercicio = req.params.idejercicio;
    //logger.debug("_idejercicio" + _idejercicio);

    //var sql_head_0 = `SELECT cuentacontable "cuenta",gerencia "gerencia",departamento "departamento",seccion "seccion", `
    var sql_head_0 = `SELECT cuentacontable cuenta,gerencia,departamento,seccion, `
    var sql_body_1 = `
                            SELECT M.cuentacontable,N.gerencia,N.departamento,N.seccion,M.periodo,M.totalcosto FROM 
                            (
                            SELECT f.cuentacontable, c.cui, 
                                                        d.periodo,
                                                        d.totalcosto
                                                        FROM sip.presupuesto a
                                                        JOIN sip.detallepre b ON a.id = b.idpresupuesto
                                                        JOIN sip.estructuracui c ON a.idcui = c.id
                                                        JOIN sip.detalleplan d ON d.iddetallepre = b.id
                                                        JOIN sip.servicio e ON b.idservicio=e.id
                                                        JOIN sip.cuentascontables f ON e.idcuenta=f.id
                                                        WHERE a.estado='Aprobado' AND a.idcui in (SELECT idcui FROM sip.presupuesto where estado = 'Aprobado') AND d.periodo BETWEEN :min AND :max
                            ) M
                            JOIN
                            (
                            SELECT J.gerencia,J.departamento,J.seccion,J.cui,K.idcui FROM
                            (
                            SELECT gerencia,departamento,seccion,max(cui) cui FROM
                            (
                            SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion, NULL cui FROM 
                            (
                            SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
                            ) X LEFT OUTER JOIN 
                            (
                            SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
                            (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
                            ON C.cuipadre = D.cui
                            ) Y
                            ON X.cui=Y.cuipadre
                            UNION
                            SELECT * FROM
                            (
                            SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
                            (
                            SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
                            ) R
                            RIGHT OUTER JOIN 
                            (
                            SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
                            (
                            SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
                            ) X LEFT OUTER JOIN 
                            (
                            SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
                            (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
                            ON C.cuipadre = D.cui
                            ) Y
                            ON X.cui=Y.cuipadre
                            ) S
                            ON R.cuipadre=S.gerencia AND R.cui = departamento
                            UNION 
                            SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
                            (
                            SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
                            ) R
                            RIGHT OUTER JOIN 
                            (
                            SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
                            (
                            SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
                            ) X LEFT OUTER JOIN 
                            (
                            SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
                            (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
                            ON C.cuipadre = D.cui
                            ) Y
                            ON X.cui=Y.cuipadre
                            ) S
                            ON R.cuipadre=S.departamento AND R.cui = seccion
                            ) W
                            WHERE cui IS NOT NULL
                            ) W
                            GROUP BY gerencia, departamento,seccion
                            ) J
                            LEFT OUTER JOIN
                            (
                            SELECT p.idcui,c.cui,c.nombreresponsable FROM sip.presupuesto p JOIN sip.estructuracui c ON p.idcui=c.id WHERE p.estado='Aprobado' AND p.idejercicio=:IdEjercicio 
                            ) K
                            ON J.cui = K.cui
                            ) N
                            ON M.cui = N.cui                   
                    `
    var sql_body_0 = ` FROM 
                    (
                    `
    var sql_body_2 = ` ) x 
                            PIVOT 
                            ( 
                            SUM(totalcosto) 
                            FOR periodo IN (`

    var sql_tail = `  )   ) p `

    // default
    //var year = (new Date).getFullYear() - 1;

    co(function* () {
        var exer, year
        if (_idejercicio != 0) {
            exer = yield models.ejercicios.find({
                attributes: ['id', 'ejercicio'],
                where: { 'id': _idejercicio },
            }).catch(function (err) {
                logger.error(err)
            });
        } else if (_idejercicio == 0) {
            exer = yield models.ejercicios.find({
                attributes: ['id', 'ejercicio'],
                where: { 'ejercicio': (new Date).getFullYear() },
            }).catch(function (err) {
                logger.error(err)
            });
            //console.dir(exer)
        }
        _idejercicio = exer.id;
        year = exer.ejercicio - 1;

        //console.dir(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + _idejercicio)
        //console.dir(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + year)

        utilSeq.getPeriodRange(year, function (err, range) {
            var acum = ''
            //var acom = ''
            var min = range[0]
            var max = range[range.length - 1]
            for (var i = 0; i < range.length; i++) {
                acum += '[' + range[i] + ']'
                //acom += "[" + range[i] + "] AS '" + range[i] + "'"
                if (i < range.length - 1) {
                    acum += ',';
                    //acom += ',';
                }
            }

            //console.dir(acum)

            sequelize.query(sql_head_0 + acum + sql_body_0 + sql_body_1 + sql_body_2 + acum + sql_tail,
                {
                    replacements: { periodos: acum, min: min, max: max, IdEjercicio: parseInt(_idejercicio) },
                    type: sequelize.QueryTypes.SELECT
                }
            ).then(function (rows) {
                //console.dir(rows)
                var csv = utilSeq.JSON2CSV(rows)
                var hdr = 'attachment; filename=hyperion_' + Math.floor(Date.now()) + '.csv'
                res.setHeader('Content-disposition', hdr);
                res.set('Content-Type', 'text/csv');
                res.status(200).send(csv);
            }).catch(function (err) {
                logger.error(err)
                res.json({ error_code: 1 });
            });
        });

    }).catch(function (err) {
        logger.error(err)
    });

}

exports.listcui = function (req, res) {
    models.presupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' })
    models.presupuesto.findAll({
        attributes: ['idcui'],
        where: { 'estado': 'Aprobado' },
        include: [
            {
                model: models.estructuracui, attributes: ['cui']
            }, {
                model: models.ejercicios, attributes: ['ejercicio']
            }]
    }).then(function (presupuesto) {
        res.json(presupuesto);
    }).catch(function (err) {
        logger.error(err)
    });
}

exports.ejercicios = function (req, res) {
    models.ejercicios.findAll({
        attributes: ['id', 'glosaejercicio'],
        order: 'ejercicio'
    }).then(function (ejercicios) {
        res.json(ejercicios);
    }).catch(function (err) {
        logger.error(err)
    });
}

exports.presupuesto = function (req, res) {
    models.presupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' })
    models.presupuesto.belongsTo(models.ejercicios, { foreignKey: 'idejercicio' })
    models.presupuesto.findAll({
        attributes: ['id', 'idcui', 'descripcion', 'estado', 'version', 'montoforecast', 'montoanual'],
        where: { 'estado': 'Aprobado' },
        include: [
            {
                model: models.estructuracui, attributes: ['cui', 'nombre', 'nombreresponsable']
            }, {
                model: models.ejercicios, attributes: ['ejercicio']
            }]
    }).then(function (presupuesto) {
        res.json(presupuesto);
    }).catch(function (err) {
        logger.error(err)
    });
}

exports.colnames = function (req, res) {
    var ano = req.params.ano;
    var peini = ano + '09'
    var pefin = (parseInt(ano) + 1) + '12'

    models.presupuesto.hasMany(models.detallepre, { foreignKey: 'idpresupuesto' })
    models.detallepre.belongsTo(models.presupuesto, { foreignKey: 'idpresupuesto' })
    models.detallepre.hasMany(models.detalleplan, { foreignKey: 'iddetallepre' })
    models.detalleplan.belongsTo(models.detallepre, { foreignKey: 'iddetallepre' })

    models.presupuesto.findAll({
        attributes: ['id'],
        where: [{ 'estado': 'Aprobado' }, { 'idcui': 59 }],
        include: [
            {
                model: models.detallepre,
                attributes: ['id'],
                include: [
                    {
                        model: models.detalleplan,
                        attributes: ['periodo'],
                        where: { 'periodo': { $between: [peini, pefin] } },
                        group: ['periodo']
                    }]
            }
        ],
    }).then(function (presupuesto) {
        res.json(presupuesto);
    }).catch(function (err) {
        logger.error(err)
    });

}

exports.estructura = function (req, res) {
    var _page = req.query.page;
    var _rows = req.query.rows;
    var _sidx = req.query.sidx;
    var _sord = req.query.sord;
    var _filters = req.query.filters;
    var _search = req.query._search;
    /*
    if (_filters) {
        var _jsonObj = JSON.parse(_filters);
        var _rules = _jsonObj.rules;
        models.ejercicios.find({
            attributes: ['ejercicio'],
            where: { 'id': _rules[0].data },
        }).then(function (ex) {
            logger.debug("----------------------------> " + ex.ejercicio)
        }).catch(function (err) {
            logger.debug(err)
        });
    }*/
    var sql_head_0 = `SELECT COUNT(*) cant FROM`
    var sql_head_1 = `SELECT J.gerencia,J.departamento,J.seccion,J.cui,K.idcui FROM`
    var sql_body = `
(
SELECT gerencia,departamento,seccion,max(cui) cui FROM
(
SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion, NULL cui FROM 
(
  SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
) X LEFT OUTER JOIN 
(
 SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
 (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
 ON C.cuipadre = D.cui
) Y
ON X.cui=Y.cuipadre
UNION
SELECT * FROM
(
SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
(
SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
) R
RIGHT OUTER JOIN 
(
SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
(
  SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
) X LEFT OUTER JOIN 
(
 SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
 (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
 ON C.cuipadre = D.cui
) Y
ON X.cui=Y.cuipadre
) S
ON R.cuipadre=S.gerencia AND R.cui = departamento
UNION 
SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
(
SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
) R
RIGHT OUTER JOIN 
(
SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
(
  SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
) X LEFT OUTER JOIN 
(
 SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
 (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
 ON C.cuipadre = D.cui
) Y
ON X.cui=Y.cuipadre
) S
ON R.cuipadre=S.departamento AND R.cui = seccion
) W
WHERE cui IS NOT NULL
) W
GROUP BY gerencia, departamento,seccion
) J
LEFT OUTER JOIN
(
SELECT p.idcui,c.cui,c.nombreresponsable FROM sip.presupuesto p JOIN sip.estructuracui c ON p.idcui=c.id WHERE p.estado='Aprobado' AND p.idejercicio=:IdEjercicio 
) K
ON J.cui = K.cui
    `

    var sql_tail = ` 
ORDER BY gerencia,departamento,seccion    
OFFSET :PageSize * (:page - 1) 
ROWS FETCH NEXT :PageSize ROWS ONLY 
    `
    var idejercicio
    co(function* () {
        if (_filters) {
            var _jsonObj = JSON.parse(_filters);
            var _rules = _jsonObj.rules;
            idejercicio = _rules[0].data;
        } else {
            var exer = yield models.ejercicios.find({
                attributes: ['id'],
                where: { 'ejercicio': (new Date).getFullYear() - 1 },
            }).catch(function (err) {
                logger.error(err)
            });
            //console.dir(exer)
            idejercicio = exer.id
        }

        sequelize.query(sql_head_0 + sql_body,
            {
                replacements: { IdEjercicio: idejercicio },
                type: sequelize.QueryTypes.SELECT
            }
        ).then(function (count) {
            sequelize.query(sql_head_1 + sql_body + sql_tail,
                {
                    replacements: { PageSize: parseInt(_rows), page: parseInt(_page), IdEjercicio: parseInt(idejercicio) },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (rows) {
                    var records = count[0].cant
                    var total = Math.ceil(records / _rows);
                    res.json({ records: records, total: total, page: _page, rows: rows });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error_code: 1 });
                });

        }).catch(function (err) {
            logger.error(err)
        });
    }).catch(function (err) {
        logger.error(err);
    });

}

exports.list2 = function (req, res) {
    var _page = req.body.page;
    var _rows = req.body.rows;
    var _sidx = req.body.sidx;
    var _sord = req.body.sord;
    var _filters = req.body.filters;
    var _search = req.body._search;
    var ano = req.body.ano;
    var cui = req.body.cui;
    var idcui = req.body.idcui;
    var estado = 'Aprobado'
    var nothing = []

    var yearExercise = function (id, callback) {
        models.presupuesto.belongsTo(models.ejercicios, { foreignKey: 'idejercicio' })
        models.presupuesto.findAll({
            attributes: ['id'],
            where: [{ 'estado': 'Aprobado' }, { 'idcui': id }],
            include: [
                {
                    model: models.ejercicios, attributes: ['ejercicio']
                }]
        }).then(function (presupuesto) {
            if (presupuesto) {
                callback(undefined, presupuesto[0].ejercicio.ejercicio)
            } else {
                callback('no rows', undefined)
            }
        }).catch(function (err) {
            logger.error(err)
        });
    }

    if (idcui > 0) {
        yearExercise(idcui, function (err, year) {
            if (year) {
                logger.debug(year)
                utilSeq.getPeriodRange(year - 1, function (err, range) {
                    var acum = ''
                    var min = range[0]
                    var max = range[range.length - 1]
                    for (var i = 0; i < range.length; i++) {
                        acum += '[' + range[i] + ']'
                        if (i < range.length - 1)
                            acum += ','
                    }
                    
                    var sql_head_0 = `SELECT cuentacontable,gerencia,departamento,seccion `

                    var sql_body_1 = `
                            SELECT M.cuentacontable,N.gerencia,N.departamento,N.seccion,M.periodo,M.totalcosto FROM 
                            (
                            SELECT f.cuentacontable, c.cui, 
                                                        d.periodo,
                                                        d.totalcosto
                                                        FROM sip.presupuesto a
                                                        JOIN sip.detallepre b ON a.id = b.idpresupuesto
                                                        JOIN sip.estructuracui c ON a.idcui = c.id
                                                        JOIN sip.detalleplan d ON d.iddetallepre = b.id
                                                        JOIN sip.servicio e ON b.idservicio=e.id
                                                        JOIN sip.cuentascontables f ON e.idcuenta=f.id
                                                        WHERE a.estado='Aprobado' AND a.idcui = :idcui AND d.periodo BETWEEN :min AND :max
                            ) M
                            JOIN
                            (
                            SELECT J.gerencia,J.departamento,J.seccion,J.cui,K.idcui FROM
                            (
                            SELECT gerencia,departamento,seccion,max(cui) cui FROM
                            (
                            SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion, NULL cui FROM 
                            (
                            SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
                            ) X LEFT OUTER JOIN 
                            (
                            SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
                            (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
                            ON C.cuipadre = D.cui
                            ) Y
                            ON X.cui=Y.cuipadre
                            UNION
                            SELECT * FROM
                            (
                            SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
                            (
                            SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
                            ) R
                            RIGHT OUTER JOIN 
                            (
                            SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
                            (
                            SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
                            ) X LEFT OUTER JOIN 
                            (
                            SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
                            (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
                            ON C.cuipadre = D.cui
                            ) Y
                            ON X.cui=Y.cuipadre
                            ) S
                            ON R.cuipadre=S.gerencia AND R.cui = departamento
                            UNION 
                            SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
                            (
                            SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
                            ) R
                            RIGHT OUTER JOIN 
                            (
                            SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
                            (
                            SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
                            ) X LEFT OUTER JOIN 
                            (
                            SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
                            (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
                            ON C.cuipadre = D.cui
                            ) Y
                            ON X.cui=Y.cuipadre
                            ) S
                            ON R.cuipadre=S.departamento AND R.cui = seccion
                            ) W
                            WHERE cui IS NOT NULL
                            ) W
                            GROUP BY gerencia, departamento,seccion
                            ) J
                            LEFT OUTER JOIN
                            (
                            SELECT p.idcui,c.cui,c.nombreresponsable FROM sip.presupuesto p JOIN sip.estructuracui c ON p.idcui=c.id WHERE p.estado='Aprobado'
                            ) K
                            ON J.cui = K.cui
                            ) N
                            ON M.cui = N.cui                   
                    `
                    var sql_body_0 = ` FROM 
                    (
                    `
                    var sql_body_2 = ` ) x 
                            PIVOT 
                            ( 
                            SUM(totalcosto) 
                            FOR periodo IN (`

                    var sql_tail = `  )   ) p `

                    sequelize.query(sql_head_0 + acum + sql_body_0 + sql_body_1 + sql_body_2 + acum + sql_tail,
                        { replacements: { periodos: acum, min: min, max: max, idcui: parseInt(idcui) }, type: sequelize.QueryTypes.SELECT }
                    ).then(function (rows) {
                        res.json(rows);
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({ error_code: 1 });
                    });
                });

            } else {
                res.json(nothing);
            }
        })

    } else {
        res.json(nothing);
    }
}

exports.list = function (req, res) {
    var _page = req.body.page;
    var _rows = req.body.rows;
    var _sidx = req.body.sidx;
    var _sord = req.body.sord;
    var _filters = req.body.filters;
    var _search = req.body._search;
    var ano = req.body.ano;
    var cui = req.body.cui;
    var idcui = req.body.idcui;
    var estado = 'Aprobado'
    var ssql

    if (_search == 'true') {
        var searchField = req.body.searchField;
        var searchString = req.body.searchString;
        var searchOper = req.body.searchOper;
        if (searchField === 'ano') {
            ano = parseInt(searchString)
            ssql = "BETWEEN " + searchString + "09 AND " + (parseInt(searchString) + 1) + "12 "
        } else if (searchField === 'cui') {
            cui = parseInt(searchString)
        }
    } else if (_search == 'false') {
        ssql = "BETWEEN " + ano.toString() + "09 AND " + (ano + 1) + "12 "
    }

    var sql = "DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX), @ano AS NVARCHAR(4)= :ano; " +
        "SELECT @cols = STUFF((SELECT ',' + QUOTENAME(d.periodo) " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b ON a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c ON a.idcui = c.id " +
        "JOIN sip.detalleplan d on d.iddetallepre = b.id " +
        "WHERE " +
        "a.estado= :estado AND a.idcui = :idcui AND d.periodo " + ssql +
        "GROUP BY d.periodo " +
        "FOR XML PATH(''), TYPE " +
        ").value('.', 'NVARCHAR(MAX)') " +
        ",1,1,'') " +
        "SET @query = 'SELECT cuentacontable,cui,cuipadre,ano,' + @cols + ' FROM " +
        "(" +
        "SELECT " +
        "f.cuentacontable, c.cui, c.cuipadre, " +
        "' + @ano + ' ano, " +
        "d.periodo, " +
        "d.totalcosto " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b ON a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c ON a.idcui = c.id " +
        "JOIN sip.detalleplan d ON d.iddetallepre = b.id " +
        "JOIN sip.servicio e ON b.idservicio=e.id " +
        "JOIN sip.cuentascontables f ON e.idcuenta=f.id " +
        " WHERE a.estado=''" + estado + "'' AND a.idcui = :idcui AND d.periodo " + ssql +
        ") x " +
        "PIVOT " +
        "( " +
        "SUM(totalcosto) " +
        "FOR periodo IN (' + @cols + ') " +
        ") p ' execute(@query);";

    sequelize.query(sql, { replacements: { ano: ano, periodo: ssql, idcui: parseInt(idcui), estado: estado }, type: sequelize.QueryTypes.SELECT }
    ).then(function (rows) {
        //console.dir(rows)
        res.json(rows);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};