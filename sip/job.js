var path = require("path");
var models = require('./models');
var sequelize = require('./models/index').sequelize;
var iniDate = new Date();
var mes = parseInt(iniDate.getMonth()) + 1
var mm = mes < 10 ? '0' + mes : mes;
var periodo = iniDate.getFullYear() + '' + mm;

console.log("PARTIO")
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
sequelize.query(sql,
    {
        replacements: { periodo: periodo },
        type: sequelize.QueryTypes.SELECT
    }).then(function (rows) {
        console.log(rows)
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
                    //'montoapagar': rows[i].montoapagar,
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
            console.log("EXITO GEN SOL");
        }).catch(function (err) {
            console.error(err)
            process.exit(1)
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
            console.log("EXITO UPDATE DET");
        }).catch(function (err) {
            console.error(err)
            process.exit(1)
        });

    }).catch(function (e) {
        console.error(e)
        process.exit(1)
    })
process.exit(0)