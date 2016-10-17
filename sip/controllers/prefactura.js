var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.test = function (req, res) {

    try {
        var jsreport = require('jsreport-core')({
            logger: { providerName: "winston" }
        })

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'prefactura.js'), 'utf8');

        /*
                var sql_1 =
                    `
                    SELECT  
                        a.id, b.glosaservicio,b.montoaprobado,c.razonsocial,d.contacto,d.correo
                        FROM sip.prefactura a
                        JOIN sip.solicitudaprobacion b ON a.id = b.idprefactura 
                        JOIN sip.proveedor c ON a.idproveedor = c.id
                        JOIN sip.contactoproveedor d ON c.id = d.idproveedor
                        WHERE a.id=:id
                    `
        */
        logger.info("generando prefactura")
        var sql_1 =
            `
                SELECT 
				a.id, b.glosaservicio,
                IIF(e.glosamoneda ='CLP',ROUND(b.montoaprobado,0),ROUND(b.montoaprobado,0)) montoaprobado,
                c.razonsocial,d.contacto,d.correo, e.glosamoneda
                FROM sip.prefactura a
                JOIN sip.solicitudaprobacion b ON a.id = b.idprefactura 
                JOIN sip.proveedor c ON a.idproveedor = c.id
				JOIN sip.moneda e ON a.idmoneda = e.id
				JOIN 
				(
					SELECT z.idproveedor,w.id, w.contacto,w.correo FROM sip.contactoproveedor w
					RIGHT OUTER JOIN
					(
						SELECT x.id idproveedor, MIN(y.id) idcontacto  FROM sip.proveedor x join sip.contactoproveedor y on x.id=y.idproveedor GROUP BY x.id 
					) z ON w.id= z.idcontacto
				) d ON c.id = d.idproveedor
                WHERE a.id=:id          
            `

        sequelize.query(sql_1,
            {
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {


                var datum = {
                    "prefactura": rows
                }

                jsreport.init().then(function () {
                    return jsreport.render({
                        template: {
                            content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'prefactura.html'), 'utf8'),
                            helpers: helpers,
                            engine: 'handlebars',
                            recipe: 'phantom-pdf',
                            phantom: {
                                orientation: 'portrait',
                                format: 'A4',
                            }
                        },
                        data: datum
                    }).then(function (resp) {
                        res.header('Content-type', 'application/pdf');
                        resp.stream.pipe(res);
                        //console.info("es nuevo")
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


/*
# Cambio en paginación
*/
exports.lista = function (req, res) {
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
            JOIN sip.proveedor E ON A.idproveedor = E.id
            WHERE C.estadopago IS NULL AND C.montoorigen != 0 AND E.numrut != 1 AND C.periodo = :periodo` + condition

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
                    JOIN sip.proveedor E ON A.idproveedor = E.id
                    WHERE C.estadopago IS NULL AND C.montoorigen != 0 AND E.numrut != 1 AND C.periodo = :periodo` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

    console.log("lala : " + sql)
    console.log("lilo : " + periodo)


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

exports.generar = function (req, res) {
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    sql = `
                SELECT
                C.id, 
                C.periodo,
                C.id iddetallecompromiso,
                NULL idprefactura,
                D.id idcui,
                A.idproveedor,
                B.idservicio, 
                B.glosaservicio,
                A.id idcontrato,
                C.montoorigen,
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
				JOIN sip.proveedor E ON A.idproveedor = E.id
                WHERE
				 C.estadopago IS NULL AND 
				 C.periodo = :periodo AND
				C.montoorigen != 0 AND
				E.numrut != 1
        `
    var promises = []
    var o_promises = []
    sequelize.query(sql,
        {
            replacements: { periodo: periodo },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {

            models.sequelize.transaction({ autocommit: true }, function (t) {
                for (var i = 0; i < rows.length; i++) {
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
                        'idcausalmulta': 0,
                        'glosamulta': null,
                        'aprobado': 0,
                        'glosaaprobacion': null,
                        'idcalificacion': 0,
                        'borrado': 1,
                        'pending': true
                    }, { transaction: t });

                    promises.push(newPromise);

                };

                return Promise.all(promises);
            }).then(function (result) {
                console.dir("EXITO GEN SOL");
            }).catch(function (err) {
                console.log("--------> " + err);
                //res.json({ error_code: 1 });
            });

            models.sequelize.transaction({ autocommit: true }, function (t) {
                for (var i = 0; i < rows.length; i++) {
                    var otherPromise = models.detallecompromiso.update({
                        estadopago: 'GENERADO'
                    }, {
                            where: { id: rows[i].id }
                        }, { transaction: t });
                    //console.log(otherPromise);
                    o_promises.push(otherPromise);

                };

                return Promise.all(o_promises);
            }).then(function (result) {
                //console.dir(result);
                console.dir("EXITO UPDATE DET");
            }).catch(function (err) {
                console.log("--------> " + err);
                //res.json({ error_code: 1 });
            });

        }).catch(function (e) {
            console.log(e)
            res.json({ error_code: 1 });
        })

    res.json({ error_code: 0 });

}