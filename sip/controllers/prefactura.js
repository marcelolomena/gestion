var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.test = function (req, res) {

    try {
        var jsreport = require('jsreport-core')()
        //jsreport.logger.add(winston.transports.Console, { level: 'info' })

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'prefactura.js'), 'utf8');

        logger.info("generando prefactura")
        var sql_1 =
            `
                SELECT 
				a.id,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotalsinmulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotalsinmulta), 1))-1) ,',','.')  subtotalsinmulta,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotal), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotal), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotal), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotal), 1))+1,len(CONVERT(varchar, CONVERT(money, a.subtotal), 1))) subtotal,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalmulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalmulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalmulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalmulta), 1))+1,len(CONVERT(varchar, CONVERT(money, a.totalmulta), 1))) totalmulta,
				a.impuesto,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalimpuesto), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalimpuesto), 1))-1) ,',','.')  totalimpuesto,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalprefactura), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalprefactura), 1))-1) ,',','.')  totalprefactura,
				CONVERT(varchar(10),a.fecha,103) fecha,
				b.glosaservicio,
                b.idfacturacion,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))) montoaprobado,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomulta), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montomulta), 1))) montomulta,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.factorconversion), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.factorconversion), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.factorconversion), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.factorconversion), 1))+1,len(CONVERT(varchar, CONVERT(money, b.factorconversion), 1))) factorconversion,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobadopesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobadopesos), 1))-1) ,',','.')  montoaprobadopesos,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomultapesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomultapesos), 1))-1) ,',','.')  montomultapesos,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoneto-b.montomulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoneto-b.montomulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoneto-b.montomulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoneto-b.montomulta), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoneto-b.montomulta), 1))) montoapagar,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoapagarpesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoapagarpesos), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoapagarpesos), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoapagarpesos), 1))+1,len(CONVERT(varchar, CONVERT(money,b.montoapagarpesos), 1))) montoapagarpesos,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montototalpesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montototalpesos), 1))-1) ,',','.')  montototalpesos,                                
                c.razonsocial,
				c.numrut,
				c.dvrut,
				d.contacto,
				d.correo,
				e.glosamoneda,
                f.cui numcui,
				f.nombre cui,
				f.nombreresponsable,
				CONVERT(varchar(10),h.fechainicio,103) fechainicio,
				CONVERT(varchar(10),h.fechatermino,103) fechatermino,
				i.nombre servicio,
				j.cuentacontable,
				j.nombrecuenta,
				k.id idcontrato,
				k.numero,
				m.glosaCargoAct,
                l.email
                FROM sip.prefactura a
                JOIN sip.solicitudaprobacion b ON a.id = b.idprefactura 
                JOIN sip.proveedor c ON a.idproveedor = c.id
				JOIN sip.moneda e ON a.idmoneda = e.id
				JOIN sip.detallecompromiso g ON g.id = b.iddetallecompromiso
				JOIN sip.detalleserviciocto h ON h.id = g.iddetalleserviciocto
				JOIN sip.estructuracui f ON f.id = h.idcui
				JOIN sip.servicio i  ON i.id = h.idservicio
				JOIN sip.cuentascontables j ON j.id = h.idcuenta
				JOIN sip.contrato k ON k.id = h.idcontrato
				JOIN dbo.art_user l ON l.uid = f.uid
				JOIN dbo.RecursosHumanos m ON l.email = m.emailTrab
				JOIN 
				(
					SELECT z.idproveedor,w.id, w.contacto,w.correo FROM sip.contactoproveedor w
					RIGHT OUTER JOIN
					(
						SELECT x.id idproveedor, MIN(y.id) idcontacto  FROM sip.proveedor x join sip.contactoproveedor y on x.id=y.idproveedor GROUP BY x.id 
					) z ON w.id= z.idcontacto
				) d ON c.id = d.idproveedor
                WHERE a.id=:id AND m.periodo = (SELECT MAX(periodo) FROM dbo.RecursosHumanos)       
            `

        sequelize.query(sql_1,
            {
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {
                logger.debug(rows)
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
                                margin: '1.5cm'
                            }
                        },
                        data: datum
                    }).then(function (resp) {
                        res.header('Content-type', 'application/pdf');
                        resp.stream.pipe(res);
                        //console.info("es nuevo")
                    }).catch(function (e) {
                        logger.error(e)
                    })

                }).catch(function (e) {
                    logger.error(e)
                })

            }).catch(function (err) {
                logger.error(e)
            });

    } catch (e) {
        logger.error(e)
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
            SELECT  C.periodo,
                    D.cui,
                    D.nombre nomcui,
                    D.nombreresponsable, 
                    A.nombre contrato,
                    B.glosaservicio servicio,
                    M.moneda,
                    C.montoorigen costo
                    FROM sip.contrato A 
                    JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
                    JOIN sip.detallecompromiso C ON B.id  = C.iddetalleserviciocto
                    JOIN sip.estructuracui D ON B.idcui   = D.id
                    JOIN sip.proveedor E ON A.idproveedor = E.id
                    JOIN sip.moneda M ON B.idmoneda = M.id
                    WHERE C.estadopago IS NULL AND C.montoorigen != 0 AND E.numrut != 1 AND C.periodo = :periodo` + condition + order +
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
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
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
                C.valorcuota montoneto,
				IIF(B.impuesto!=0, C.valorcuota * 0.19, 0) montoimpuesto,
				C.valorcuota+IIF(B.impuesto!=0, C.valorcuota * 0.19, 0) montoapagar,
				F.valorconversion,
				F.valorconversion * (C.valorcuota+IIF(B.impuesto!=0, C.valorcuota * 0.19, 0)) montoapagarpesos,
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
				JOIN sip.monedasconversion F ON F.idmoneda = B.idmoneda 
                WHERE
				 C.estadopago IS NULL AND 
				 C.periodo = :periodo AND
				 F.periodo = :periodo AND
				C.montoorigen != 0 AND
				E.numrut != 1
        `
    var promises = []
    var o_promises = []
    var s_promises = []
    sequelize.query(sql,
        {
            replacements: { periodo: periodo },
            type: sequelize.QueryTypes.SELECT
        }).then(function (rows) {
            //logger.debug(rows)
            models.sequelize.transaction({ autocommit: true }, function (t) {
                for (var i = 0; i < rows.length; i++) {
                    var newPromise = models.solicitudaprobacion.create({
                        'periodo': rows[i].periodo,
                        'iddetallecompromiso': rows[i].iddetallecompromiso,
                        'idprefactura': rows[i].idprefactura,
                        'idfacturacion': rows[i].iddetallecompromiso,
                        'idcui': rows[i].idcui,
                        'idproveedor': rows[i].idproveedor,
                        'idservicio': rows[i].idservicio,
                        'glosaservicio': rows[i].glosaservicio,
                        'idcontrato': rows[i].idcontrato,
                        'montoapagar': rows[i].montoapagar,
                        'montoaprobado': 0,
                        'montomulta': 0,
                        'idcausalmulta': 0,
                        'glosamulta': null,
                        'aprobado': 0,
                        'glosaaprobacion': null,
                        'idcalificacion': 0,
                        'borrado': 1,
                        'montoapagarpesos': rows[i].montoapagarpesos,
                        'montomultapesos': 0,
                        'montoimpuesto': rows[i].montoimpuesto,
                        'factorconversion': rows[i].valorconversion,
                        'montoaprobadopesos': 0,
                        'montoneto': rows[i].montoneto,
                        'pending': true
                    }, { transaction: t });

                    promises.push(newPromise);

                };

                return Promise.all(promises);
            }).then(function (result) {

                models.sequelize.transaction({ autocommit: true }, function (t) {
                    for (var i = 0; i < result.length; i++) {
                        var myPromise = models.solicitudaprobacion.update({
                            idfacturacion: result[i].periodo.toString() + result[i].id.toString()
                        }, {
                                where: { id: result[i].id }
                            }, { transaction: t });
                        s_promises.push(myPromise);

                    };

                    return Promise.all(s_promises);
                }).then(function (result) {
                    logger.debug("EXITO AL GENERAR IDITEM");
                }).catch(function (err) {
                    logger.error(err)
                });


            }).catch(function (err) {
                logger.error(err)
            });

            models.sequelize.transaction({ autocommit: true }, function (t) {
                for (var i = 0; i < rows.length; i++) {
                    var otherPromise = models.detallecompromiso.update({
                        estadopago: 'GENERADO'
                    }, {
                            where: { id: rows[i].id }
                        }, { transaction: t });
                    o_promises.push(otherPromise);

                };

                return Promise.all(o_promises);
            }).then(function (result) {
                logger.debug("EXITO UPDATE DET");
            }).catch(function (err) {
                logger.error(err)
            });

        }).catch(function (e) {
            logger.error(e)
            res.json({ error_code: 1 });
        })

    res.json({ error_code: 0 });

}