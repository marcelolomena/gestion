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
		   ROUND(ISNULL(A.costo,0),2) ejerciciouno,
		   ROUND(ISNULL(B.costo,0),2) ejerciciodos,
		   ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
		   ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) porcentaje
		   from 
		   (
		    select 
			Y.cui,
			Y.nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = Y.cui
            group by Y.cui,
			Y.nombre
			) A LEFT OUTER JOIN
			(
           select 
		   Y.cui,
		   Y.nombre,
		   SUM(X.costo)/1000000 costo from sip.v_reporte_presupuesto X, sip.estructuracui Y 
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
		   ROUND(ISNULL(A.costo,0),2) ejerciciouno,
		   ROUND(ISNULL(B.costo,0),2) ejerciciodos,
		   ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
			select 
			Y.cui,
			Y.nombre,
			sum(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X, sip.estructuracui Y 
			where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = :id AND X.departamento = Y.cui
			group by Y.cui,Y.nombre 
			) A LEFT OUTER JOIN
			(
			select 
			Y.cui,
			Y.nombre,
			sum(X.costo)/1000000 costo
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
            //console.log("sum1 : " + sum1);
            //console.log("sum2 : " + sum2);

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
		   ROUND(ISNULL(A.costo,0),2) ejerciciouno,
		   ROUND(ISNULL(B.costo,0),2) ejerciciodos,
		   ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
		   select 
			X.Servicio nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X
			where X.periodo >= 201509 AND X.periodo <= 201612 AND X.departamento = :id
			group by X.Servicio 
			) A LEFT OUTER JOIN
			(
		   select 
			X.Servicio nombre,
			SUM(X.costo)/1000000 costo
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
    var _sidx = req.query.sidx;
    var _sord = req.query.sord;
    var _gerencia = 0;
    var _order = ''

    //console.log(_sidx)
    //console.log(_sord)

    if (_sidx)
        _order = ' ORDER BY ' + _sidx + ' ' + _sord
    else
        _order = ' ORDER BY ejerciciodos desc'


    if (_filters) {
        var _jsonObj = JSON.parse(_filters);
        var _rules = _jsonObj.rules;
        _gerencia = _rules[0].data;
    }

    if (_gerencia > 0) {
        var sql =
            `
           select
		   A.nombre,
		   ROUND(ISNULL(A.costo,0),2) ejerciciouno,
		   ROUND(ISNULL(B.costo,0),2) ejerciciodos,
		   ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
			select 
			X.conceptogasto nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201509 AND X.periodo <= 201612 and X.gerencia = :gerencia
            group by X.conceptogasto
			) A FULL OUTER JOIN
			(
			select 
			X.conceptogasto nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201701 AND X.periodo <= 201712 and X.gerencia = :gerencia
            group by X.conceptogasto
		   ) B ON A.nombre = B.nombre
        ` + _order

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
                        if (key == 'ejerciciouno') {
                            sum1 = sum1 + value
                        } else if (key == 'ejerciciodos') {
                            sum2 = sum2 + value
                        }

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


    } else if (_gerencia == 0) {

        var sql =
            `
           select
		   A.nombre,
		   ROUND(ISNULL(A.costo,0),2) ejerciciouno,
		   ROUND(ISNULL(B.costo,0),2) ejerciciodos,
		   ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
		   IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
		   from 
		   (
			select 
			X.conceptogasto nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201509 AND X.periodo <= 201612
            group by X.conceptogasto
			) A FULL OUTER JOIN
			(
			select 
			X.conceptogasto nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X
            where X.periodo >= 201701 AND X.periodo <= 201712
            group by X.conceptogasto
		   ) B ON A.nombre = B.nombre
        ` + _order

        sequelize.query(sql,
            {
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {

                var sum1 = 0, sum2 = 0
                for (var i = 0; i < rows.length; i++) {
                    var obj = rows[i];
                    for (var key in obj) {
                        var value = obj[key];
                        if (key == 'ejerciciouno') {
                            sum1 = sum1 + value
                        } else if (key == 'ejerciciodos') {
                            sum2 = sum2 + value
                        }

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

exports.reporteGerenciasPdf = function (req, res) {
    try {
        var pathPdf = path.join(__dirname, '..', 'pdf')
        var filePdf = 'repo1.pdf'
        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'gerencias.js'), 'utf8');

        var sql =
            `
           select
		   A.cui id,
		   A.nombre,
		   ROUND(ISNULL(A.costo,0),2) ejerciciouno,
		   ROUND(ISNULL(B.costo,0),2) ejerciciodos,
		   ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
		   ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) porcentaje
		   from 
		   (
		    select 
			Y.cui,
			Y.nombre,
			SUM(X.costo)/1000000 costo
			from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = Y.cui
            group by Y.cui,
			Y.nombre
			) A LEFT OUTER JOIN
			(
           select 
		   Y.cui,
		   Y.nombre,
		   SUM(X.costo)/1000000 costo from sip.v_reporte_presupuesto X, sip.estructuracui Y 
           where X.periodo >= 201701 AND X.periodo <= 201712 AND X.gerencia = Y.cui
           group by Y.cui,Y.nombre
		   ) B ON A.cui = B.cui
        `

        sequelize.query(sql,
            {
                //replacements: { perini:2016 },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {

                var datum = {
                    "gerencias": rows,
                }

                jsreport.init().then(function () {
                    return jsreport.render({
                        template: {
                            content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'reporte_gerencias.html'), 'utf8'),
                            helpers: helpers,
                            engine: 'handlebars',
                            recipe: 'phantom-pdf',
                            phantom: {
                                "orientation": "portrait",
                                "format": "A4",
                                "timeout": 180000
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
                                        console.log('finalizo');
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


    } catch (e) {
        console.log("error : " + e);
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

exports.lstServiceFromConcept = function (req, res) {
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    var _concepto = Base64.decode(req.params.nombre)
    var _gerencia = req.params.id
    //console.log("----->>>" + _concepto)
    //console.log("----->>>" + _gerencia)

    if (_gerencia > 0) {
        var sql =
            `
               select
               A.nombre,
               ROUND(ISNULL(A.costo,0),2) ejerciciouno,
               ROUND(ISNULL(B.costo,0),2) ejerciciodos,
               ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
               IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
               from 
               (
               select 
                X.Servicio nombre,
                SUM(X.costo)/1000000 costo
                from sip.v_reporte_presupuesto X
                where X.periodo >= 201509 AND X.periodo <= 201612 AND X.departamento = :id AND X.conceptogasto = :concepto
                group by X.Servicio 
                ) A LEFT OUTER JOIN
                (
               select 
                X.Servicio nombre,
                SUM(X.costo)/1000000 costo
                from sip.v_reporte_presupuesto X
                where X.periodo >= 201701 AND X.periodo <= 201712 AND X.departamento =  :id AND X.conceptogasto = :concepto
                group by X.Servicio 
               ) B ON A.nombre = B.nombre
            `

        sequelize.query(sql,
            {
                replacements: { id: _gerencia, concepto: _concepto },
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

    } else if (_gerencia == 0) {
        var sql =
            `
               select
               A.nombre,
               ROUND(ISNULL(A.costo,0),2) ejerciciouno,
               ROUND(ISNULL(B.costo,0),2) ejerciciodos,
               ROUND(ISNULL(B.costo,0)-ISNULL(A.costo,0),2) diferencia,
               IIF(ISNULL(A.costo,0)!=0, ROUND(((ISNULL(B.costo,0)-ISNULL(A.costo,0) ) /ISNULL(A.costo,0)) * 100, 2) , 0) porcentaje
               from 
               (
               select 
                X.Servicio nombre,
                SUM(X.costo)/1000000 costo
                from sip.v_reporte_presupuesto X
                where X.periodo >= 201509 AND X.periodo <= 201612 AND X.conceptogasto = :concepto
                group by X.Servicio 
                ) A LEFT OUTER JOIN
                (
               select 
                X.Servicio nombre,
                SUM(X.costo)/1000000 costo
                from sip.v_reporte_presupuesto X
                where X.periodo >= 201701 AND X.periodo <= 201712 AND X.conceptogasto =  :concepto
                group by X.Servicio 
               ) B ON A.nombre = B.nombre
            `

        sequelize.query(sql,
            {
                replacements: { concepto: _concepto },
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


