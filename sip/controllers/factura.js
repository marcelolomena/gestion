var models = require('../models');
var sequelize = require('../models/index').sequelize;
var express = require('express')
var router = express.Router()
var phantom = require('phantom');

exports.generar = function (req, res) {

    try {

        if (!req.body.prefactura) {
            return next(new Error('No se enviaron datos de prefactura'));
        }

        var prefactura = req.body.prefactura;

        console.log("[" + prefactura + "]");

        req.app.render('test', { prefactura: prefactura }, function (err, html) {
            console.log(html)

            var phInstance = null;
            var sitepage = null;
            var filePath = 'lana.pdf';
            phantom.create().then(function (ph) {
                phInstance = ph;
                return phInstance.createPage();
            }).then(function (page) {
                console.log('page');
                sitepage = page;
                var paperSize = {
                    format: 'letter',
                    orientation: 'portrait',
                    margin: { left: "1.25cm", right: "1.25cm", top: "1.25cm", bottom: "1.25cm" }
                };
                page.setting('javascriptEnabled');
                page.property('paperSize', paperSize);
                page.property('viewportSize', { width: 704, height: 1054 });
                page.property('zoomFactor', 0.9);
                page.property('content', html);
            }).then(function (status) {
                //console.log("status :" + status);
                return sitepage.property('content');
            }).then(function (content) {
                //console.dir(sitepage);
                sitepage.render(filePath, { format: 'pdf', quality: '100' }).then(function (res) {
                    sitepage.close();
                    phInstance.exit();
                    /*
                    setTimeout(function () {
                        sitepage.close();
                        phInstance.exit();
                        //return callback(null, filePath);
                    }, 10000);
                    */
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    sitepage.close();
                    phInstance.exit();
                });

            }).catch(function (err) {
                console.log(err);
                phInstance.exit();
            });


            /*
                        createPDF({}, prefactura, html, 'lolo.pdf', function (err, data) {
                            console.log("aaaaaaaaaaaa ->> " + data);
                            res.send("1");
                        });
            */
        });

    } catch (e) {
        console.log(e);
    }
};

/*
var createPDF = function (options, html, filePath, callback) {
    var phInstance = null;
    var sitepage = null;
    phantom.create().then(function (ph) {
        phInstance = ph;
        return phInstance.createPage();
    }).then(function (page) {
        console.log('page');
        sitepage = page;
        var paperSize = {
            format: 'letter',
            orientation: 'portrait',
            margin: { left: "1.25cm", right: "1.25cm", top: "1.25cm", bottom: "1.25cm" }
        };
        page.setting('javascriptEnabled');
        page.property('paperSize', paperSize);
        page.property('viewportSize', { width: 704, height: 1054 });
        page.property('zoomFactor', 0.9);
        page.property('content', html);
    }).then(function (status) {
        console.log(status);
        return sitepage.property('content');
    }).then(function (content) {
        console.log(content);
        sitepage.render(filePath, { format: 'pdf', quality: '100' }).then(function (res) {
            setTimeout(function () {
                sitepage.close();
                phInstance.exit();
                //return callback(null, filePath);
                callback(null, filePath);
            }, 25000);
        }).catch(function (err) {
            console.log(err);
            sitepage.close();
            phInstance.exit();
        });

    }).catch(function (err) {
        console.log(err);
        phInstance.exit();
    });
};
*/