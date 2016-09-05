var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var jsreport = require('jsreport-core')()


exports.test = function (req, res) {

    try {
        var pathPdf = path.join(__dirname, '..', 'pdf')
        var filePdf = 'test.pdf'

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'test.js'), 'utf8');
        var datum = {
            "books": [
                { "name": "A Tale of Two Cities", "author": "Charles Dickens", "sales": 351 },
                { "name": "The Lord of the Rings", "author": "J. R. R. Tolkien", "sales": 125 },
                { "name": "The Da Vinci Code", "author": "Dan Brown", "sales": 255 },
                { "name": "The Hobbit", "author": "J. R. R. Tolkien", "sales": 99 }
            ]
        }
        jsreport.init().then(function () {
            return jsreport.render({
                template: {
                    content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'test.html'), 'utf8'),
                    helpers: helpers,
                    engine: 'handlebars',
                    recipe: 'phantom-pdf',
                    phantom: {
                        "orientation": "portrait",
                        "format": "A4",
                        "margin": "1cm",
                        "headerHeight": "1cm"
                    }
                },
                data: datum
            }).then(function (resp) {
                //imprime pdf
                //console.log(resp.content.toString())
                /*
                resp.result.pipe(fs.createWriteStream(pathPdf + path.sep + filePdf));
                setTimeout(function () {
                    process.exit();
                }, 10000)
                res.header('Content-disposition', 'inline; filename=' + filePdf);
                res.header('Content-type', 'application/pdf');
                fs.createReadStream(pathPdf + path.sep + filePdf).pipe(res);
                */
                res.header('Content-disposition', 'inline; filename=' + filePdf);
                res.header('Content-type', 'application/pdf');
                resp.result.pipe(fs.createWriteStream(pathPdf + path.sep + filePdf))
                    .on('finish', function () {  // finished
                        fs.createReadStream(pathPdf + path.sep + filePdf).pipe(res)
                            .on('finish', function () {  // finished
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

    } catch (e) {
        console.log("error : " + e);
    }
}

exports.troya = function (req, res) {

    try {
        var pathPdf = path.join(__dirname, '..', 'pdf')

        //console.log(pathPdf + path.sep)

        var filePdf = 'troya.pdf'

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'test.js'), 'utf8');

        var data = [],
            series = Math.floor(Math.random() * 6) + 3;

        for (var i = 0; i < series; i++) {
            data[i] = {
                label: "Serie" + (i + 1),
                data: Math.floor(Math.random() * 100) + 1
            }
        }

        var datum = {
            "torta": data
        }

        console.dir(datum)

        jsreport.init().then(function () {
            return jsreport.render({
                template: {
                    content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'pie.html'), 'utf8'),
                    helpers: helpers,
                    engine: 'handlebars',
                    recipe: 'phantom-pdf',
                    phantom: {
                        "orientation": "portrait",
                        "format": "A4",
                        "margin": "1cm",
                        "headerHeight": "1cm"
                    }
                },
                data: datum
            }).then(function (resp) {
                //imprime pdf
                //console.log(resp.content.toString())
                /*
                resp.result.pipe(fs.createWriteStream(pathPdf + path.sep + filePdf));
                setTimeout(function () {
                    process.exit();
                }, 10000)
                res.header('Content-disposition', 'inline; filename=' + filePdf);
                res.header('Content-type', 'application/pdf');
                fs.createReadStream(pathPdf + path.sep + filePdf).pipe(res);
                */
                res.header('Content-disposition', 'inline; filename=' + filePdf);
                res.header('Content-type', 'application/pdf');
                resp.result.pipe(fs.createWriteStream(pathPdf + path.sep + filePdf))
                    .on('finish', function () {  // finished
                        fs.createReadStream(pathPdf + path.sep + filePdf).pipe(res)
                            .on('finish', function () {  // finished
                                //fs.unlink(pathPdf + path.sep + filePdf);
                                //console.log('finalizo');
                            });
                    });

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

exports.gerencias = function (req, res) {

    try {
        var pathPdf = path.join(__dirname, '..', 'log')

        //console.log(pathPdf + path.sep)

        var filePdf = 'gerencias.pdf'

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'test.js'), 'utf8');

        var sql_1 =
            `
            select Y.nombre, sum(X.caja)/1000000 caja from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201509 AND X.periodo <= 201612 AND X.gerencia = Y.cui
            group by Y.nombre
        `

        var sql_2 =
            `
            select Y.nombre, sum(X.caja)/1000000 caja from sip.v_reporte_presupuesto X, sip.estructuracui Y 
            where X.periodo >= 201701 AND X.periodo <= 201712 AND X.gerencia = Y.cui
            group by Y.nombre
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

                        console.dir(rows_2)
                        var datum = {
                            "gerencias_1": rows_1,
                            "gerencias_2": rows_2
                        }

                        jsreport.init().then(function () {
                            return jsreport.render({
                                template: {
                                    content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'bar.html'), 'utf8'),
                                    helpers: helpers,
                                    engine: 'handlebars',
                                    recipe: 'phantom-pdf',
                                    phantom: {
                                        "orientation": "portrait",
                                        "format": "A4",
                                        "margin": "1cm",
                                        "headerHeight": "1cm"
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




            }).catch(function (err) {
                console.log(err)
            });


        console.dir(datum)



    } catch (e) {
        console.log("error : " + e);
    }
}

