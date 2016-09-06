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

        //console.log("[" + prefactura + "]");

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

exports.solicitud = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    //var idiniciativaprograma = req.params.id;

    if (!sidx)
        sidx = "a.[id]";

    if (!sord)
        sord = "asc";

    var order = sidx + " " + sord;

    var count = `
            SELECT 
            count(*) cantidad
            FROM sip.contrato A 
            JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
            JOIN sip.detallecompromiso C ON B.id = C.iddetalleserviciocto
            JOIN sip.estructuracui D ON B.idcui = D.id
            WHERE C.periodo = :periodo 
    `

    var sql = `
        With SQLPaging As   ( 
        Select Top(:rowsPerPage * :pageNum) ROW_NUMBER() OVER (ORDER BY cui)
        as resultNum,
            D.cui,
            D.nombre nombre_cui,
            D.nombreresponsable responsable,
            A.nombre contrato,
            B.glosaservicio servicio,
            C.costopesos costo
            FROM sip.contrato A 
            JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
            JOIN sip.detallecompromiso C ON B.id = C.iddetalleserviciocto
            JOIN sip.estructuracui D ON B.idcui = D.id
            WHERE C.periodo = :periodo
            ORDER BY D.cui
        )
        select * from SQLPaging with (nolock) where resultNum > ((:pageNum - 1) * :rowsPerPage);    
    `

    if (filters) {
        var jsonObj = JSON.parse(filters);

        if (JSON.stringify(jsonObj.rules) != '[]') {

            jsonObj.rules.forEach(function (item) {

                if (item.op === 'cn')
                    condition += item.field + " like '%" + item.data + "%' AND"
            });

            sequelize.query(sql,
                {
                    replacements: { pageNum: page, rowsPerPage: rows, periodo: periodo },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (rows) {
                    res.json({ records: records, total: total, page: page, rows: contratos });
                });



        } else {


        }

    } else {
        sequelize.query(count,
            {
                replacements: { periodo: periodo },
                type: sequelize.QueryTypes.SELECT
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                sequelize.query(sql,
                    {
                        replacements: { pageNum: page, rowsPerPage: rows, periodo: periodo },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (rows) {
                        res.json({ records: records, total: total, page: page, rows: rows });
                    }).catch(function (e) {
                        console.log(e)
                    })

            }).catch(function (e) {
                console.log(e)
            })
    }

}
