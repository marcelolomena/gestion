var models = require('../models');
var sequelize = require('../models/index').sequelize;
var fs = require('fs');
var path = require("path");
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var logtransaccion = require("../utils/logtransaccion");
var constants = require("../utils/constants");
var winston = require('winston');

exports.test = function (req, res) {

    try {
        var jsreport = require('jsreport-core')()
        //jsreport.logger.add(winston.transports.Console, { level: 'info' })

        var helpers = fs.readFileSync(path.join(__dirname, '..', 'helpers', 'prefactura.js'), 'utf8');

        var sql_1 =
            `
                SELECT 
				a.id,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotalsinmulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotalsinmulta), 1))-1) ,',','.')  subtotalsinmulta,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotal), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotal), 1))-1) ,',','.')  subtotal,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalmulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalmulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalmulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalmulta), 1))+1,len(CONVERT(varchar, CONVERT(money, a.totalmulta), 1))) totalmulta,
				a.impuesto,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalimpuesto), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalimpuesto), 1))-1) ,',','.')  totalimpuesto,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalprefactura), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalprefactura), 1))-1) ,',','.')  totalprefactura,
				CONVERT(varchar(10),a.fecha,103) fecha,
				b.glosaservicio,
                b.idfacturacion,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))) montoaprobado,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomulta), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montomulta), 1))) montomulta,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoabono), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoabono), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoabono), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoabono), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoabono), 1))) montoabono,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.factorconversion), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.factorconversion), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.factorconversion), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.factorconversion), 1))+1,len(CONVERT(varchar, CONVERT(money, b.factorconversion), 1))) factorconversion,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobadopesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobadopesos), 1))-1) ,',','.')  montoaprobadopesos,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomultapesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomultapesos), 1))-1) ,',','.')  montomultapesos,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoabonopesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoabonopesos), 1))-1) ,',','.')  montoabonopesos,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1))) montoapagar,
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
                l.email,
				h.sap,
				h.tarea,
				h.codigoart,
				k.tipocontrato                
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



var sql_2 =
            `
               SELECT 
				a.id,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotalsinmulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotalsinmulta), 1))-1) ,',','.')  subtotalsinmulta,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.subtotal), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.subtotal), 1))-1) ,',','.')  subtotal,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalmulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalmulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalmulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalmulta), 1))+1,len(CONVERT(varchar, CONVERT(money, a.totalmulta), 1))) totalmulta,
				a.impuesto,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalimpuesto), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalimpuesto), 1))-1) ,',','.')  totalimpuesto,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, a.totalprefactura), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, a.totalprefactura), 1))-1) ,',','.')  totalprefactura,
				CONVERT(varchar(10),a.fecha,103) fecha,
				b.glosaservicio,
                b.idfacturacion,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoaprobado), 1))) montoaprobado,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomulta), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomulta), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomulta), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomulta), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montomulta), 1))) montomulta,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoabono), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoabono), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoabono), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoabono), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoabono), 1))) montoabono,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.factorconversion), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.factorconversion), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.factorconversion), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.factorconversion), 1))+1,len(CONVERT(varchar, CONVERT(money, b.factorconversion), 1))) factorconversion,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobadopesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobadopesos), 1))-1) ,',','.')  montoaprobadopesos,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montomultapesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montomultapesos), 1))-1) ,',','.')  montomultapesos,
                REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoabonopesos), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoabonopesos), 1))-1) ,',','.')  montoabonopesos,
				REPLACE( SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1),1,CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1))-1) ,',','.') + ',' + SUBSTRING(CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1),CHARINDEX('.',CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1))+1,len(CONVERT(varchar, CONVERT(money, b.montoaprobado-b.montomulta+b.montoabono), 1))) montoapagar,
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
				CONVERT(varchar(10),h.fechafin,103) fechafin,
				i.nombre servicio,
				j.cuentacontable,
				j.nombrecuenta,
				k.id idcontrato,
				k.numero,
				m.glosaCargoAct,
                l.email,
				b.sap,
				h.tarea,
				hh.id,
				k.tipocontrato                
                FROM sip.prefactura a
                LEFT JOIN sip.solicitudaprobacion b ON a.id = b.idprefactura 
                LEFT JOIN sip.proveedor c ON a.idproveedor = c.id
				LEFT JOIN sip.moneda e ON a.idmoneda = e.id
				LEFT JOIN sip.flujopagoenvuelo g ON g.id = b.iddetallecompromiso
				LEFT JOIN sip.tareaenvuelo h ON h.id = g.idtareaenvuelo
				LEFT JOIN sip.presupuestoenvuelo hh ON hh.id = h.idpresupuestoenvuelo
				LEFT JOIN sip.estructuracui f ON f.id = h.idcui
				LEFT JOIN sip.servicio i  ON i.id = h.idservicio
				LEFT JOIN sip.cuentascontables j ON j.id = i.idcuenta
				LEFT JOIN sip.contrato k ON k.id = b.idcontrato
				LEFT JOIN dbo.art_user l ON l.uid = f.uid
				LEFT JOIN dbo.RecursosHumanos m ON l.email = m.emailTrab
				LEFT JOIN 
				(
					SELECT z.idproveedor,w.id, w.contacto,w.correo FROM sip.contactoproveedor w
					RIGHT OUTER JOIN
					(
						SELECT x.id idproveedor, MIN(y.id) idcontacto  FROM sip.proveedor x join sip.contactoproveedor y on x.id=y.idproveedor GROUP BY x.id 
					) z ON w.id= z.idcontacto
				) d ON c.id = d.idproveedor
                WHERE a.id=:id AND m.periodo = (SELECT MAX(periodo) FROM dbo.RecursosHumanos)             
            `
        //Si continuidad sql_1, proyectos sql_2
        var sql_ok;
        //console.log("***********SAP:"+req.params.sap);
        var mysap = req.params.sap;
        if (mysap > 0 ) {
            console.log("****Con SAP");
            sql_ok = sql_2;
        } else {
            console.log("****Sin SAP");
            sql_ok = sql_1;
        }
        //console.log("****SQL:"+sql_ok);
        sequelize.query(sql_ok,
            {
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {
                //console.log("****ROWS:"+rows.length+ " data:"+JSON.stringify(rows));
                var datum = {
                    "prefactura": rows
                }

                var datita = JSON.parse(JSON.stringify(datum, function (key, value) {
                    if (key === 'tipocontrato') {
                        if (value == 0) {
                            return true;// proyecto
                        } else {
                            return false;// continuidad
                        }
                    }
                    else {
                        return value;
                    }
                }));

                jsreport.init().then(function () {
                    return jsreport.render({
                        template: {
                            content: fs.readFileSync(path.join(__dirname, '..', 'templates', 'prefactura.html'), 'utf8'),
                            helpers: helpers,
                            engine: 'handlebars',
                            recipe: 'phantom-pdf',
                            phantom: {
                                orientation: 'portrait',
                                format: 'Letter',
                                margin: '1cm'
                            }
                        },
                        data: datita
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
                logger.error(err)
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
            WHERE C.estadopago IS NULL AND C.montoorigen != 0 AND A.tipocontrato=1 AND C.periodo = :periodo` + condition

    var sql = `
            SELECT  C.periodo,
                    D.cui,
                    D.nombre nomcui,
                    D.nombreresponsable, 
                    A.nombre contrato,
                    B.glosaservicio servicio,
                    M.moneda,
                    C.montoorigen costo,
                    E.razonsocial
                    FROM sip.contrato A 
                    JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
                    JOIN sip.detallecompromiso C ON B.id  = C.iddetalleserviciocto
                    JOIN sip.estructuracui D ON B.idcui   = D.id
                    JOIN sip.proveedor E ON A.idproveedor = E.id
                    JOIN sip.moneda M ON B.idmoneda = M.id
                    WHERE C.estadopago IS NULL AND C.montoorigen != 0 AND A.tipocontrato=1 AND  C.periodo = :periodo` + condition + order +
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
                    return res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.anular = function (req, res) {
    var datavacia = [{ 'sin datos': '' }];
    
    return models.solicitudaprobacion.find({
        where: { id: req.params.id }
    }).then(function (solicitudaprobacion) {
        return models.sequelize.transaction({ autocommit: true }, function (t) {

            var promises = []

            var onePromise = models.solicitudaprobacion.update({
                iddetallecompromiso: null,
                idcontrato: null
            }, {
                    where: { id: req.params.id }
                }, { transaction: t });

            promises.push(onePromise);
            var sap = solicitudaprobacion.sap;
            console.log("***SAP:" + sap);
            var twoPromise
            if (sap) {
                console.log("***SAP else");
                twoPromise = models.flujopagoenvuelo.update({
                    saldopago: null,
                    estadopago: null
                }, {
                        where: { id: solicitudaprobacion.iddetallecompromiso }
                    }, { transaction: t });
            } else {
                console.log("***SAP dentro");
                twoPromise = models.detallecompromiso.update({
                    saldopago: null,
                    estadopago: null
                }, {
                        where: { id: solicitudaprobacion.iddetallecompromiso }
                    }, { transaction: t });
            }
            promises.push(twoPromise);

            return Promise.all(promises);

        }).then(function (result) {
            logtransaccion.registrar(
                constants.AnulaSolicitud,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });
            res.json({ success: true });
        }).catch(function (err) {           
            logger.error(err)
            res.json({ success: false, message: err });
        });

    }).catch(function (err) {
        logger.error(err);
        res.json({ success: false, message: err });
    });

}

exports.generar = function (req, res) {
    console.log("*** Inicia Generacion Solicitudes Prefactura");
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;
    var datavacia = [{ 'sin datos': '' }];
    logtransaccion.registrar(
        constants.IniciaGeneraSolicitudes,
        0,
        'insert',
        req.session.passport.user,
        'model',
        datavacia,
        function (err, data) {
            if (err) {
                logger.error(err)
                return res.json({ error_code: 1 });
            }
        });

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
				0 montoapagarpesos,
                0,
                0,
                NULL,
                NULL,
                0,
                NULL,
                0,
                1,
				b.impuesto,
				b.factorimpuesto                
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
                A.tipocontrato=1 AND
				E.numrut != 1
UNION               
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
				0 montoapagarpesos,
                0,
                0,
                NULL,
                NULL,
                0,
                NULL,
                0,
                1,
				b.impuesto,
				b.factorimpuesto                
                FROM sip.contrato A 
                JOIN sip.detalleserviciocto B ON A.id = B.idcontrato
                JOIN sip.detallecompromiso C ON B.id = C.iddetalleserviciocto
                JOIN sip.estructuracui D ON B.idcui = D.id
				JOIN sip.proveedor E ON A.idproveedor = E.id
				JOIN sip.monedasconversion F ON F.idmoneda = B.idmoneda 
                WHERE
				 C.periodo < :periodo AND
				 F.periodo = :periodo AND
				C.montoorigen != 0 AND
                A.tipocontrato=1 AND
				E.numrut != 1 AND
				(C.estadopago = 'ABONADO' OR C.estadopago = 'GENERADO') and
                C.id NOT IN (SELECT a.iddetallecompromiso FROM sip.solicitudaprobacion a
				JOIN sip.detallecompromiso b ON a.iddetallecompromiso=b.id WHERE a.periodo=:periodo 
				AND b.periodo < :periodo )                                
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
                    //logger.debug(rows[i])
                    var numerointeligente = periodo.toString() + '' + rows[i].iddetallecompromiso
                    //logger.debug(numerointeligente)
                    var newPromise = models.solicitudaprobacion.create({
                        'periodo': periodo,
                        'iddetallecompromiso': rows[i].iddetallecompromiso,
                        'idprefactura': rows[i].idprefactura,
                        'idfacturacion': numerointeligente,
                        'idcui': rows[i].idcui,
                        'idproveedor': rows[i].idproveedor,
                        'idservicio': rows[i].idservicio,
                        'glosaservicio': rows[i].glosaservicio,
                        'idcontrato': rows[i].idcontrato,
                        //'montoapagar': rows[i].montoapagar,
                        'montoaprobado': 0,
                        'montomulta': 0,
                        'idcausalmulta': 0,
                        'glosamulta': null,
                        'aprobado': 0,
                        'glosaaprobacion': null,
                        'idcalificacion': 0,
                        'borrado': 1,
                        'impuesto': rows[i].impuesto,
                        'factorimpuesto': rows[i].factorimpuesto,
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

                return models.sequelize.transaction({ autocommit: true }, function (t) {
                    for (var i = 0; i < result.length; i++) {
                        var myPromise = models.solicitudaprobacion.update({
                            idfacturacion: result[i].id.toString()
                        }, {
                                where: { id: result[i].id }
                            }, { transaction: t });
                        s_promises.push(myPromise);

                    };

                    return Promise.all(s_promises);
                }).then(function (result) {
                    return models.sequelize.transaction({ autocommit: true }, function (t) {
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
                        logtransaccion.registrar(
                            constants.FinExitoGeneraSolicitudes,
                            0,
                            'insert',
                            req.session.passport.user,
                            'flujopagoenvuelo',
                            datavacia,
                            function (err, data) {
                                if (err) {
                                    logger.error(err)
                                    return res.json({ error_code: 1 });
                                }
                            });
                        logger.debug("EXITO UPDATE DET");
                        res.json({ error_code: 0, message: "Exito!!" });
                    }).catch(function (err) {
                        logtransaccion.registrar(
                            constants.FinErrorGeneraSolicitudes,
                            0,
                            'insert',
                            req.session.passport.user,
                            'flujopagoenvuelo',
                            datavacia,
                            function (err, data) {
                                if (err) {
                                    logger.error(err)
                                    return res.json({ error_code: 1 });
                                }
                            });
                        logger.error(err)
                        res.json({ error_code: 1, message: err });
                    });
                }).catch(function (err) {
                    logtransaccion.registrar(
                        constants.FinErrorGeneraSolicitudes,
                        0,
                        'insert',
                        req.session.passport.user,
                        'flujopagoenvuelo',
                        datavacia,
                        function (err, data) {
                            if (err) {
                                logger.error(err)
                                return res.json({ error_code: 1 });
                            }
                        });
                    logger.error(err)
                    res.json({ error_code: 1, message: err });
                });
            }).catch(function (err) {
                logtransaccion.registrar(
                    constants.FinExitoGeneraSolicitudes,
                    0,
                    'insert',
                    req.session.passport.user,
                    'flujopagoenvuelo',
                    datavacia,
                    function (err, data) {
                        if (err) {
                            logger.error(err)
                            return res.json({ error_code: 1 });
                        }
                    });
                logger.error(err)
                res.json({ error_code: 1, message: err });
            });

        }).catch(function (e) {
            logger.error(e)
            res.json({ error_code: 1, message: err });
        })

}


exports.listaProyectos = function (req, res) {
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
            FROM sip.presupuestoenvuelo A 
            JOIN sip.tareaenvuelo B ON A.id = B.idpresupuestoenvuelo
            JOIN sip.flujopagoenvuelo C ON B.id = C.idtareaenvuelo
            JOIN sip.estructuracui D ON B.idcui = D.id
            JOIN sip.proveedor E ON B.idproveedor = E.id
            WHERE E.numrut != 1 AND C.estadopago IS NULL AND C.montoorigen != 0 AND C.periodo = :periodo` + condition

    var sql = `
            SELECT  C.periodo,
                    D.cui,
                    D.nombre nomcui,
                    D.nombreresponsable, 
                    A.nombreproyecto contrato,
                    A.sap sap,
                    B.tarea tarea,
                    B.glosa servicio,
                    M.moneda,
                    C.montoorigen costo,
                    E.razonsocial
                    FROM sip.presupuestoenvuelo A 
                    JOIN sip.tareaenvuelo B ON A.id = B.idpresupuestoenvuelo
                    JOIN sip.flujopagoenvuelo C ON B.id  = C.idtareaenvuelo
                    JOIN sip.estructuracui D ON B.idcui   = D.id
                    JOIN sip.proveedor E ON B.idproveedor = E.id
                    JOIN sip.moneda M ON B.idmoneda = M.id
                    WHERE E.numrut != 1 AND C.estadopago IS NULL AND C.montoorigen != 0 AND C.periodo = :periodo` + condition + order +
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
                    return res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.generarProyectos = function (req, res) {
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;
    var datavacia = [{ 'sin datos': '' }];
    
    logtransaccion.registrar(
        constants.IniciaGeneraSolicitudesProyectos,
        0,
        'insert',
        req.session.passport.user,
        'model',
        datavacia,
        function (err, data) {
            if (err) {
                logger.error(err)
                return res.json({ error_code: 1 });
            }
        });      
    return sequelize.query('EXECUTE sip.GeneraSolicitudesAprobProyectos '
        + periodo + ';').then(function (response) {
            logtransaccion.registrar(
                constants.FinExitoGeneraSolicitudesProyectos,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });               
            logger.debug("EXITO AL GENERAR SOLICITUDES PROYECTO");
            res.json({ error_code: 0, message: "Exito!!" });
        }).catch(function (err) {
            logtransaccion.registrar(
                constants.FinErrorGeneraSolicitudesProyectos,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });             
            logger.error(err)
            res.json({ error_code: 1, message: err });
        });
}

/*
exports.generarProyectosOld = function (req, res) {
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
                A.sap,
                B.tarea,                
                B.idproveedor,
                B.idservicio, 
                B.glosa,
                A.id idcontrato,
                C.montoorigen/1.19 montoneto,
				IIF(B.coniva!=0, C.montoorigen - (C.montoorigen/1.19), 0) montoimpuesto,
				C.montoorigen montoapagar,
				F.valorconversion,
				0 montoapagarpesos,
                0,
                0,
                NULL,
                NULL,
                0,
                NULL,
                0,
                1,
				B.coniva,
				IIF(B.coniva!=0, 0.77, 0) factorimpuesto                
                FROM sip.presupuestoenvuelo A 
                JOIN sip.tareaenvuelo B ON A.id = B.idpresupuestoenvuelo
                JOIN sip.flujopagoenvuelo C ON B.id = C.idtareaenvuelo
                JOIN sip.estructuracui D ON B.idcui = D.id
				JOIN sip.proveedor E ON B.idproveedor = E.id
				JOIN sip.monedasconversion F ON F.idmoneda = B.idmoneda 
                WHERE
				 C.estadopago IS NULL AND 
				 C.periodo = :periodo AND
				 F.periodo = :periodo AND
				C.montoorigen != 0 AND
				E.numrut != 1
UNION               
				SELECT
                C.id, 
                C.periodo,
                C.id iddetallecompromiso,
                NULL idprefactura,
                D.id idcui,
                A.sap,
                B.tarea,                
                B.idproveedor,
                B.idservicio, 
                B.glosa,
                A.id idcontrato,
                C.montoorigen/1.19 montoneto,
				IIF(B.coniva!=0, C.montoorigen - (C.montoorigen/1.19), 0) montoimpuesto,
				C.montoorigen montoapagar,
				F.valorconversion,
				0 montoapagarpesos,
                0,
                0,
                NULL,
                NULL,
                0,
                NULL,
                0,
                1,
				B.coniva,
				IIF(B.coniva!=0, 0.77, 0) factorimpuesto                
                FROM sip.presupuestoenvuelo A 
                JOIN sip.tareaenvuelo B ON A.id = B.idpresupuestoenvuelo
                JOIN sip.flujopagoenvuelo C ON B.id = C.idtareaenvuelo
                JOIN sip.estructuracui D ON B.idcui = D.id
				JOIN sip.proveedor E ON B.idproveedor = E.id
				JOIN sip.monedasconversion F ON F.idmoneda = B.idmoneda 
                WHERE
				 C.periodo < :periodo AND
				 F.periodo = :periodo AND
				C.montoorigen != 0 AND
				E.numrut != 1 AND
				(C.estadopago = 'ABONADO' OR C.estadopago = 'GENERADO' OR C.estadopago IS NULL) and
                C.id NOT IN (SELECT a.iddetallecompromiso FROM sip.solicitudaprobacion a
				JOIN sip.flujopagoenvuelo b ON a.iddetallecompromiso=b.id WHERE a.periodo=:periodo 
				AND b.periodo < :periodo )                              
        `
    var promises = []
    var o_promises = []
    var s_promises = []
    sequelize.query('EXECUTE sip.ActualizaIVATareaEnVuelo;').then(function (response) {
        sequelize.query(sql,
            {
                replacements: { periodo: periodo },
                type: sequelize.QueryTypes.SELECT
            }).then(function (rows) {
                //logger.debug(rows)
                models.sequelize.transaction({ autocommit: true }, function (t) {
                    for (var i = 0; i < 10; i++) {
                        //consultar si existe contrato
                        var sqlcto = "SELECT a.idproveedor, b.sap, b.tarea, b.impuesto  " +
                            "FROM sip.contrato a JOIN sip.detalleserviciocto b ON a.id=b.idcontrato " +
                            "WHERE a.idproveedor="+rows[i].idproveedor+" AND b.sap="+rows[i].sap+
                            " AND b.tarea='"+rows[i].tarea+"'";
                        logger.debug(sqlcto);
                        sequelize.query(sqlcto).spread(function (existecto) {
                            if (existecto.length > 0) {
                                logger.debug("*******EXISTE CTO:"+existecto);
                                 logger.debug("*******EXISTE CTO:"+JSON.stringify(existecto));
                                var iva = (existecto[0].impuesto > 0) ? 1 : 0;
                                var factorrec = (iva == 1) ? 0.77 : 0;
                                //logger.debug(rows[i])
                                var numerointeligente = periodo.toString() + '' + rows[i].iddetallecompromiso
                                //logger.debug(numerointeligente)
                                var newPromise = models.solicitudaprobacion.create({
                                    'periodo': periodo,
                                    'iddetallecompromiso': rows[i].iddetallecompromiso,
                                    'idprefactura': rows[i].idprefactura,
                                    'idfacturacion': numerointeligente,
                                    'idcui': rows[i].idcui,
                                    'sap': rows[i].sap,
                                    'tarea': rows[i].tarea,
                                    'idproveedor': rows[i].idproveedor,
                                    'idservicio': rows[i].idservicio,
                                    'glosaservicio': rows[i].glosa,
                                    'idcontrato': rows[i].idcontrato,
                                    //'montoapagar': rows[i].montoapagar,
                                    'montoaprobado': 0,
                                    'montomulta': 0,
                                    'idcausalmulta': 0,
                                    'glosamulta': null,
                                    'aprobado': 0,
                                    'glosaaprobacion': null,
                                    'idcalificacion': 0,
                                    'borrado': 1,
                                    'impuesto': iva,
                                    'factorimpuesto': factorrec,
                                    'montoapagarpesos': rows[i].montoapagarpesos,
                                    'montomultapesos': 0,
                                    'montoimpuesto': rows[i].montoimpuesto,
                                    'factorconversion': rows[i].valorconversion,
                                    'montoaprobadopesos': 0,
                                    'montoneto': rows[i].montoneto,
                                    'pending': true
                                }, { transaction: t });

                                promises.push(newPromise);
                            }
                        });

                    };

                    return Promise.all(promises);
                }).then(function (result) {

                    return models.sequelize.transaction({ autocommit: true }, function (t) {
                        for (var i = 0; i < result.length; i++) {
                            var myPromise = models.solicitudaprobacion.update({
                                idfacturacion: result[i].id.toString()
                            }, {
                                    where: { id: result[i].id }
                                }, { transaction: t });
                            s_promises.push(myPromise);

                        };

                        return Promise.all(s_promises);
                    }).then(function (result) {
                        return models.sequelize.transaction({ autocommit: true }, function (t) {
                            for (var i = 0; i < rows.length; i++) {
                                var otherPromise = models.flujopagoenvuelo.update({
                                    estadopago: 'GENERADO'
                                }, {
                                        where: { id: rows[i].id }
                                    }, { transaction: t });
                                o_promises.push(otherPromise);

                            };

                            return Promise.all(o_promises);
                        }).then(function (result) {
                            logger.debug("EXITO UPDATE DET");
                            res.json({ error_code: 0, message: "Exito!!" });
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ error_code: 1, message: err });
                        });

                    }).catch(function (err) {
                        logger.error(err)
                        res.json({ error_code: 1, message: err });
                    });


                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error_code: 1, message: err });
                });

            }).catch(function (e) {
                logger.error(e)
                res.json({ error_code: 1, message: err });
            })
    }).catch(function (e) {
        logger.error(e)
        res.json({ error_code: 1, message: err });
    })

}*/