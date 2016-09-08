var models = require('../models');
var sequelize = require('../models/index').sequelize;
var phantom = require('phantom');
var fs = require('fs');
var utilSeq = require('../utils/seq');

exports.generar = function (req, res) {

    try {

        if (!req.body.prefactura) {
            return next(new Error('No se enviaron datos de prefactura'));
        }

        var prefactura = req.body.prefactura;

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
                    console.log(err);
                    sitepage.close();
                    phInstance.exit();
                });

            }).catch(function (err) {
                console.log(err);
                sitepage.close();
                phInstance.exit();
            });


        });

    } catch (e) {
        console.log(e);
    }
};

/*
# Cambio en paginación
*/
exports.solicitud = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    if (!sidx)
        sidx = "cui";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sip.contrato A 
            JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
            JOIN sip.detallecompromiso C ON B.id = C.iddetalleserviciocto
            JOIN sip.estructuracui D ON B.idcui = D.id
            WHERE C.periodo = :periodo` + condition

    var sql = `
            SELECT 
                    D.cui,
                    D.nombre nomcui,
                    D.nombreresponsable, 
                    A.nombre contrato,
                    B.glosaservicio servicio,
                    C.costopesos costo
                    FROM sip.contrato A 
                    JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
                    JOIN sip.detallecompromiso C ON B.id = C.iddetalleserviciocto
                    JOIN sip.estructuracui D ON B.idcui = D.id
                    WHERE C.periodo = :periodo` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

    sequelize.query(count,
        {
            replacements: { periodo: periodo, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), periodo: periodo, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    console.log(e)
                })

        }).catch(function (e) {
            console.log(e)
        })
}

exports.gensol = function (req, res) {
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    models.sequelize.transaction({ autocommit: true }, function (t) {
        sql = `
                SELECT 
                C.periodo,
                C.id iddetallecompromiso,
                NULL idprefactura,
                D.id idcui,
                A.idproveedor,
                B.idservicio, 
                B.glosaservicio,
                A.id idcontrato,
                C.montopesos,
                0,
                0,
                NULL,
                NULL,
                0,
                NULL,
                0,
                1
                FROM sip.contrato A 
                JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
                JOIN sip.detallecompromiso C ON B.id = C.iddetalleserviciocto
                JOIN sip.estructuracui D ON B.idcui = D.id
                WHERE C.periodo = :periodo
        `
        var promises = []
        sequelize.query(sql,
            {
                replacements: { periodo: periodo },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {//rows.length
                console.dir(rows)
                for (var i = 0; i < 1; i++) {

                    var newPromise = models.solicitudaprobacion.create({
                        'periodo': rows[i].periodo,
                        'iddetallecompromiso': rows[i].iddetallecompromiso,
                        'idprefactura': rows[i].idprefactura,
                        'idcui': rows[i].idcui,
                        'idproveedor': rows[i].idproveedor,
                        'idservicio': rows[i].idservicio,
                        'glosaservicio': rows[i].glosaservicio,
                        'idcontrato': rows[i].idcontrato,
                        'montoapagar': rows[i].montopesos,
                        'montoaprobado': 0,
                        'montomulta': 0,
                        'idcausalmulta': null,
                        'glosamulta': null,
                        'aprobado': 0,
                        'glosaaprobacion': null,
                        'idcalificacion': 0,
                        'borrado': 1,
                        'pending': true
                    }, { transaction: t });

                    promises.push(newPromise);
                };
            }).catch(function (e) {
                console.log(e)
            })


        return Promise.all(promises).then(function (compromisos) {
            var compromisoPromises = [];
            for (var i = 0; i < compromisos.length; i++) {
                compromisoPromises.push(compromisos[i]);
            }
            return Promise.all(compromisoPromises);
        });

    }).then(function (result) {
        callback(result)
    }).catch(function (err) {
        console.log("--------> " + err);
    });
}