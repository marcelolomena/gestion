var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var jsreport = require('jsreport-core')()

exports.lstGerencias = function (req, res) {

    var sql =
        `
           select
		   A.cui id,
		   A.nombre,
		   ISNULL(A.costo,0) ejerciciouno,
		   ISNULL(B.costo,0) ejerciciodos,
		   ISNULL(B.costo,0)-ISNULL(A.costo,0) diferencia,
		   ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) porcentaje
		   from 
		   (
		    select 
			Y.cui,
			Y.nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = Y.cui
            group by Y.cui,
			Y.nombre
			) A LEFT OUTER JOIN
			(
           select 
		   Y.cui,
		   Y.nombre,
		   round(sum(X.costo)/1000000,0,1) costo from sip.v_reporte_presupuesto X, sip.estructuracui Y 
           where X.periodo >= 201701 AND X.periodo <= 201712 AND X.gerencia = Y.cui
           group by Y.cui,Y.nombre
		   ) B ON A.cui = B.cui
        `

    sequelize.query(sql,
        {
            //replacements: { perini:2016 },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {

            var sum1 = 0, sum2 = 0
            for (var i = 0; i < rows.length; i++) {
                var obj = rows[i];
                for (var key in obj) {
                    var value = obj[key];
                    //console.log(key + ": " + value);
                    if (key == 'ejerciciouno')
                        sum1 = sum1 + value
                    else if (key == 'ejerciciodos')
                        sum2 = sum2 + value
                }
            }

            var p = ((sum1 - sum2) / sum1) * 100

            var datum = {
                "rows": rows,
                "userdata": { "id": "", "nombre": "Total", "ejerciciouno": sum1, "ejerciciodos": sum2, "diferencia": sum2 - sum1, "porcentaje": p.toFixed(2) }
            }

            res.json(datum);
        }).catch(function (e) {
            console.log(e)
            res.json({ error_code: 1 });
        })
}

exports.lstDepartamentos = function (req, res) {

    //var id = req.params.id
    //console.log(id)
    var sql =
        `
           select
		   A.cui id,
		   A.nombre,
		   ISNULL(A.costo,0) ejerciciouno,
		   ISNULL(B.costo,0) ejerciciodos,
		   ISNULL(B.costo,0)-ISNULL(A.costo,0) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
			select 
			Y.cui,
			Y.nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X, sip.estructuracui Y 
			where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = :id AND X.departamento = Y.cui
			group by Y.cui,Y.nombre 
			) A LEFT OUTER JOIN
			(
			select 
			Y.cui,
			Y.nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X, sip.estructuracui Y 
			where X.periodo >= 201701 AND X.periodo <= 201712 AND X.gerencia = :id AND X.departamento = Y.cui
			group by Y.cui,Y.nombre 
		   ) B ON A.cui = B.cui
        `

    sequelize.query(sql,
        {
            replacements: { id: req.params.id },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {

            var sum1 = 0, sum2 = 0
            for (var i = 0; i < rows.length; i++) {
                var obj = rows[i];
                for (var key in obj) {
                    var value = obj[key];
                    //console.log(key + ": " + value);
                    if (key == 'ejerciciouno')
                        sum1 = sum1 + value
                    else if (key == 'ejerciciodos')
                        sum2 = sum2 + value
                }
            }
            console.log("sum1 : " + sum1);
            console.log("sum2 : " + sum2);

            var p = ((sum1 - sum2) / sum1) * 100

            var datum = {
                "rows": rows,
                "userdata": { "id": "", "nombre": "Total", "ejerciciouno": sum1, "ejerciciodos": sum2, "diferencia": sum2 - sum1, "porcentaje": p.toFixed(2) }
            }

            res.json(datum);
        }).catch(function (e) {
            console.log(e)
            res.json({ error_code: 1 });
        })
}

exports.lstServices = function (req, res) {

    var sql =
        `
           select
		   A.nombre,
		   ISNULL(A.costo,0) ejerciciouno,
		   ISNULL(B.costo,0) ejerciciodos,
		   ISNULL(B.costo,0)-ISNULL(A.costo,0) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
		   select 
			X.Servicio nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X
			where X.periodo >= 201509 AND X.periodo <= 201612 AND X.departamento = :id
			group by X.Servicio 
			) A LEFT OUTER JOIN
			(
		   select 
			X.Servicio nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X
			where X.periodo >= 201701 AND X.periodo <= 201712 AND X.departamento =  :id
			group by X.Servicio 

		   ) B ON A.nombre = B.nombre
        `

    sequelize.query(sql,
        {
            replacements: { id: req.params.id },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {

            var sum1 = 0, sum2 = 0
            for (var i = 0; i < rows.length; i++) {
                var obj = rows[i];
                for (var key in obj) {
                    var value = obj[key];
                    if (key == 'ejerciciouno')
                        sum1 = sum1 + value
                    else if (key == 'ejerciciodos')
                        sum2 = sum2 + value
                }
            }
            console.log("sum1 : " + sum1);
            console.log("sum2 : " + sum2);

            var p = ((sum1 - sum2) / sum1) * 100

            var datum = {
                "rows": rows,
                "userdata": { "id": "", "nombre": "Total", "ejerciciouno": sum1, "ejerciciodos": sum2, "diferencia": sum2 - sum1, "porcentaje": p.toFixed(2) }
            }

            res.json(datum);
        }).catch(function (e) {
            console.log(e)
            res.json({ error_code: 1 });
        })
}

exports.lstNames = function (req, res) {
    var sql =
        `
        select Y.cui,Y.nombre from sip.v_reporte_presupuesto X join sip.estructuracui Y on X.gerencia = Y.cui group by Y.cui,Y.nombre
        `

    sequelize.query(sql,
        {
            //replacements: { id: req.params.id },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {
            res.json(rows);
        }).catch(function (e) {
            console.log(e)
            res.json({ error_code: 1 });
        })
}

exports.lstConceptoGasto = function (req, res) {
    var _filters = req.query.filters;

    //console.log("----------->>>> " + _filters)

    if (_filters) {
        var _jsonObj = JSON.parse(_filters);
        var _rules = _jsonObj.rules;
        _gerencia = _rules[0].data;

        //console.log("----------->>>> " + _gerencia)

        var sql =
            `
           select
		   A.nombre,
		   ISNULL(A.costo,0) ejerciciouno,
		   ISNULL(B.costo,0) ejerciciodos,
		   ISNULL(B.costo,0)-ISNULL(A.costo,0) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
			select 
			X.conceptogasto nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201509 AND X.periodo <= 201612 and X.gerencia = :gerencia
            group by X.conceptogasto
			) A FULL OUTER JOIN
			(
			select 
			X.conceptogasto nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201701 AND X.periodo <= 201712 and X.gerencia = :gerencia
            group by X.conceptogasto
		   ) B ON A.nombre = B.nombre
		   ORDER BY nombre
        `

        sequelize.query(sql,
            {
                replacements: { gerencia: _gerencia },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {

                var sum1 = 0, sum2 = 0
                for (var i = 0; i < rows.length; i++) {
                    var obj = rows[i];
                    for (var key in obj) {
                        var value = obj[key];
                        //console.log(key + ": " + value);
                        if (key == 'ejerciciouno')
                            sum1 = sum1 + value
                        else if (key == 'ejerciciodos')
                            sum2 = sum2 + value
                    }
                }

                var p = ((sum1 - sum2) / sum1) * 100

                var datum = {
                    "rows": rows,
                    "userdata": { "id": "", "nombre": "Total", "ejerciciouno": sum1, "ejerciciodos": sum2, "diferencia": sum2 - sum1, "porcentaje": p.toFixed(2) }
                }

                res.json(datum);
            }).catch(function (e) {
                console.log(e)
                res.json({ error_code: 1 });
            })


    } else {

        var sql =
            `
           select
		   A.nombre,
		   ISNULL(A.costo,0) ejerciciouno,
		   ISNULL(B.costo,0) ejerciciodos,
		   ISNULL(B.costo,0)-ISNULL(A.costo,0) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
			select 
			X.conceptogasto nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201509 AND X.periodo <= 201612
            group by X.conceptogasto
			) A FULL OUTER JOIN
			(
			select 
			X.conceptogasto nombre,
			round(sum(X.costo)/1000000,0,1) costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201701 AND X.periodo <= 201712
            group by X.conceptogasto
		   ) B ON A.nombre = B.nombre
		   ORDER BY nombre
        `

        sequelize.query(sql,
            {
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {

                var sum1 = 0, sum2 = 0
                for (var i = 0; i < rows.length; i++) {
                    var obj = rows[i];
                    for (var key in obj) {
                        var value = obj[key];
                        //console.log(key + ": " + value);
                        if (key == 'ejerciciouno')
                            sum1 = sum1 + value
                        else if (key == 'ejerciciodos')
                            sum2 = sum2 + value
                    }
                }

                var p = ((sum1 - sum2) / sum1) * 100

                var datum = {
                    "rows": rows,
                    "userdata": { "id": "", "nombre": "Total", "ejerciciouno": sum1, "ejerciciodos": sum2, "diferencia": sum2 - sum1, "porcentaje": p.toFixed(2) }
                }

                res.json(datum);
            }).catch(function (e) {
                console.log(e)
                res.json({ error_code: 1 });
            })

    }

}

exports.pdfManager = function (req, res) {

    try {
        var pathPdf = path.join(__dirname, '..', 'pdf')

        //console.log(pathPdf + path.sep)

        var filePdf = 'gerencias.pdf'

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'gerencias.js'), 'utf8');

        var sql_1 =
            `
            select replace(Y.nombre,'Gerencia','') nombre, round(sum(X.caja)/1000000,0,1) caja from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = Y.cui
            group by Y.nombre
        `

        var sql_2 =
            `
            select replace(Y.nombre,'Gerencia','') nombre, round(sum(X.caja)/1000000,0,1) caja from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201701 AND X.periodo <= 201712 AND X.gerencia = Y.cui
            group by Y.nombre
        `

        var sql_3 =
            `
            select Servicio servicio, round(sum(X.caja)/1000000,0,1) caja from sip.v_reporte_presupuesto X
            where X.periodo >= 201509 AND X.periodo <= 201612 
            group by X.Servicio
			order by Servicio
        `

        var sql_4 =
            `
            select Servicio servicio, round(sum(X.caja)/1000000,0,1) caja from sip.v_reporte_presupuesto X
            where X.periodo >= 201701 AND X.periodo <= 201712 
            group by X.Servicio
			order by Servicio
        `

        sequelize.query(sql_1,
            {
                //replacements: { perini:2016 },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows_1) {

                sequelize.query(sql_2,
                    {
                        //replacements: { perini:2016 },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (rows_2) {

                        sequelize.query(sql_3,
                            {
                                //replacements: { perini:2016 },
                                type: sequelize.QueryTypes.SELECT
                            }).then(function (rows_3) {

                                sequelize.query(sql_4,
                                    {
                                        //replacements: { perini:2016 },
                                        type: sequelize.QueryTypes.SELECT
                                    }).then(function (rows_4) {

                                        var datum = {
                                            "gerencias_1": rows_1,
                                            "gerencias_2": rows_2,
                                            "servicios_1": rows_3,
                                            "servicios_2": rows_4,
                                        }

                                        jsreport.init().then(function () {
                                            return jsreport.render({
                                                template: {
                                                    content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'gerencias.html'), 'utf8'),
                                                    helpers: helpers,
                                                    engine: 'handlebars',
                                                    recipe: 'phantom-pdf',
                                                    phantom: {
                                                        "orientation": "portrait",
                                                        "format": "A4",
                                                        //"margin": "1cm",
                                                        //"headerHeight": "1cm"
                                                    }
                                                },
                                                data: datum
                                            }).then(function (resp) {
                                                res.header('Content-disposition', 'inline; filename=' + filePdf);
                                                res.header('Content-type', 'application/pdf');
                                                resp.result.pipe(fs.createWriteStream(pathPdf + path.sep + filePdf))
                                                    .on('finish', function () {
                                                        fs.createReadStream(pathPdf + path.sep + filePdf).pipe(res)
                                                            .on('finish', function () {
                                                                fs.unlink(pathPdf + path.sep + filePdf);
                                                                //console.log('finalizo');
                                                            });
                                                    });

                                            }).catch(function (e) {
                                                console.log(e)
                                            })
                                        }).catch(function (e) {
                                            console.log(e)
                                        })

                                    }).catch(function (e) {
                                        console.log(e)
                                    })
                            }).catch(function (e) {
                                console.log(e)
                            })

                    }).catch(function (e) {
                        console.log(e)
                    })

            }).catch(function (err) {
                console.log(err)
            });

    } catch (e) {
        console.log("error : " + e);
    }
}

