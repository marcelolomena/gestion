var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var jsreport = require('jsreport-core')()


exports.test = function (req, res) {

    try {
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
                resp.result.pipe(fs.createWriteStream(filePdf));
                setTimeout(function () {
                    process.exit();
                }, 10000)
                res.header('Content-disposition', 'inline; filename=' + filePdf);
                res.header('Content-type', 'application/pdf');
                fs.createReadStream(filePdf).pipe(res);
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

        console.log(pathPdf + path.sep)

        var filePdf = 'troya.pdf'

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
                resp.result.pipe(fs.createWriteStream(pathPdf + path.sep + filePdf));
                setTimeout(function () {
                    process.exit();
                }, 10000)
                res.header('Content-disposition', 'inline; filename=' + filePdf);
                res.header('Content-type', 'application/pdf');
                fs.createReadStream(pathPdf + path.sep + filePdf).pipe(res);
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
