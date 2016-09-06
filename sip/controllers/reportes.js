var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var jsreport = require('jsreport-core')()

exports.gerencias = function (req, res) {

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

