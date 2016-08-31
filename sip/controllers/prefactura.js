var models = require('../models');
var sequelize = require('../models/index').sequelize;
var phantom = require('phantom');
var fs = require('fs');

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
                return sitepage.property('content');
            }).then(function (content) {

                sitepage.render(filePath, { format: 'pdf', quality: '100' }).then(function (result) {
                    setTimeout(function () {
                        sitepage.close();
                        phInstance.exit();
                    }, 25000);
                    res.header('Content-disposition', 'inline; filename=' + filePath);
                    res.header('Content-type', 'application/pdf');
                    fs.createReadStream(filePath).pipe(res);

                }).catch(function (err) {
                    console.log("cago 1" + err);
                    sitepage.close();
                    phInstance.exit();
                });

            }).catch(function (err) {
                console.log("cago 2" + err);
                sitepage.close();
                phInstance.exit();
            });


        });

    } catch (e) {
        console.log("cago 4 : " + e);
    }
};
