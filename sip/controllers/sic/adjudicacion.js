var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var nodeExcel = require('excel-export');
var async = require('async');
var csv = require('csv');
var co = require('co');
var bulk = require("../../utils/bulk");
var nodeExcel = require('excel-export');

exports.list = function (req, res) {
    sequelize.query(`select 
    b.id as idserviciorequerido,
    b.idsolicitudcotizacion,
    d.nombre, 
    b.glosaservicio, 
    b.porcentajeservicio, 
    b.porcentajeeconomico, 
    1-(b.porcentajeeconomico) as porcentajetecnico, 
    e.nombre as clase
    from sic.cotizacionservicio a 
    join sic.serviciosrequeridos b on a.idserviciorequerido=b.id
    join sip.proveedor c on a.idproveedor = c.id
    join sip.servicio d on b.idservicio=d.id
    join sic.claseevaluaciontecnica e on b.claseevaluaciontecnica=e.id
    where b.idsolicitudcotizacion = :idsolicitudcotizacion
    group by b.id,
    b.idsolicitudcotizacion,
    d.nombre, 
    b.glosaservicio, 
    b.porcentajeservicio, 
    b.porcentajeeconomico,
    e.nombre`,
        { replacements: { idsolicitudcotizacion: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (data1) {
        //const nodeData = data1.map((node) => node.get({ plain: true }));
        var eljsonfinal = []
        var promesas = []

        for (var i = 0; i < data1.length; i++) {
            var idserviciorequerido = data1[i].idserviciorequerido
            console.log("PARA EL SERVICIO: " + idserviciorequerido)
            promesas.push(matrizAjustada(idserviciorequerido, data1[i]))
        }

        Promise.all(promesas)
            .then(function (result) {

                return res.json({ rows: result });
            })
        //res.json({ rows: eljsonfinal })


    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

var matrizAjustada = function (id, ladata) {

    return new Promise(function (resolve, reject) {
        try {
            matrizEvaluacion(id, function (err, todo) {
                var data = todo[0]
                var data2 = todo[1]
                var total = []
                var total2 = []
                var totales = []
                var proveedores = []
                for (var i = 0; i < data.length; i++) {
                    var porcentaje = parseFloat(data[i].porcentaje) / 100
                    var fila = JSON.stringify(data[i]).replace('}', '').split(",")

                    var datum = []
                    for (var j = 4; j < fila.length; j++) {
                        datum.push(porcentaje * parseFloat(fila[j].split(":")[1]))
                        if (i == 0)
                            proveedores.push(fila[j].split(":")[0].replace(/["']/g, ""))
                    }
                    total.push(datum)
                }
                //console.dir(total)
                var sum = (r, a) => r.map((b, i) => a[i] + b);
                var tot1 = total.reduce(sum)
                //console.log("EL TOTAL" + tot1);
                var maxim = tot1.max()
                //console.log(maxim);
                var ponderados = []
                for (var k = 0; k < tot1.length; k++) {
                    if (tot1[k] === maxim) {
                        ponderados.push(100)
                    } else {
                        ponderados.push((tot1[k] / maxim) * 100)
                    }
                }


                //console.dir(proveedores)
                var eljson = []
                for (var l = 0; l < proveedores.length; l++) {
                    var item = {}
                    var name = proveedores[l]
                    item[name] = ponderados[l]
                    eljson.push(item)

                }
                //console.dir(eljson)
                var patron = /},{/g
                var o = JSON.stringify(eljson).replace(patron, ",");
                //console.dir(JSON.parse(o));
                //console.dir(ladata);
                var lala = []
                var lolo = JSON.parse(o)

                var fila2 = JSON.stringify(data2[0]).replace('}', '').split(",")
                var proveedores2 = []

                var datum2 = []
                for (var j = 1; j < fila2.length; j++) {
                    datum2.push(parseFloat(fila2[j].split(":")[1]))
                    proveedores2.push(fila2[j].split(":")[0].replace(/["']/g, ""))
                }

                
                total2.push(datum2)
                
                var tot2 = total2.reduce(sum)
                
                var maxim2 = tot2.min()
                //console.log(maxim2);
                var ponderados2 = []
                for (var k = 0; k < tot2.length; k++) {
                    if (tot2[k] === maxim2) {
                        ponderados2.push(100)
                    } else {
                        ponderados2.push((maxim2 / tot2[k]) * 100)
                    }
                }
                var eljsoneco = []
                for (var l = 0; l < proveedores2.length; l++) {
                    var item2 = {}
                    var name2 = proveedores2[l]
                    item2[name2] = ponderados2[l]
                    eljsoneco.push(item2)

                }
                //console.dir(eljsoneco)
                var o2 = JSON.stringify(eljsoneco).replace(patron, ",");
                //console.dir(JSON.parse(o2));
                var lala2 = []
                var lolo2 = JSON.parse(o2)



                console.dir(lolo[0])
                //console.dir(ladata)
                console.dir(lolo2[0])

                var merged = {}

                for (key in lolo[0])
                    merged[key] = (parseFloat(lolo[0][key])*ladata.porcentajetecnico)+(parseFloat(lolo2[0][key])*ladata.porcentajeeconomico)

                for (key in ladata)
                    merged[key] = ladata[key]
                //console.dir(lolo[0].concat(ladata))



                //var juntos = JSON.parse(o).concat(ladata)
                logger.debug(merged)

                //return JSON.parse(o);
                resolve(merged);
            })
        } catch (err) {
            reject(err);
        }
    })
};

var matrizEvaluacion = function (id, callback) {
    var todo = []
    sequelize.query(`DECLARE @cols NVARCHAR(MAX), @sql NVARCHAR(MAX)

SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(b.razonsocial)
            FROM sic.notaevaluaciontecnica a
			join sip.proveedor b on a.idproveedor=b.id
			where a.idserviciorequerido= :idserviciorequerido 
            ORDER BY 1
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'),1,1,'')

SET @sql = 'SELECT idcriterioevaluacion, idserviciorequerido, porcentaje, nombre, ' + @cols + '
              FROM
            (
              SELECT idcriterioevaluacion, idserviciorequerido, razonsocial, nota
                FROM sic.notaevaluaciontecnica r
				join sip.proveedor x on r.idproveedor = x.id
				where idserviciorequerido= `+ id + ` 
            ) s
			join sic.criterioevaluacion x on s.idcriterioevaluacion = x.id
			
            PIVOT
            (
              MAX(nota) FOR razonsocial IN (' + @cols + ')
            ) p'

EXECUTE(@sql)
    `,
        { replacements: { idserviciorequerido: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (data) {
        todo.push(data)
        sequelize.query(`DECLARE @cols NVARCHAR(MAX), @sql NVARCHAR(MAX)

SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(b.razonsocial)
            FROM sic.cotizacionservicio a
			join sip.proveedor b on a.idproveedor=b.id
			where a.idserviciorequerido=:idserviciorequerido
            ORDER BY 1
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'),1,1,'')

SET @sql = 'SELECT moneda, ' + @cols + '
              FROM
            (
              SELECT idmoneda, razonsocial, idserviciorequerido, costototal
                FROM sic.cotizacionservicio r
				join sip.proveedor x on r.idproveedor = x.id
				where idserviciorequerido= `+ id + `
            ) s
			join sip.moneda x on s.idmoneda = x.id
			
            PIVOT
            (
              MAX(costototal) FOR razonsocial IN (' + @cols + ')
            ) p'

EXECUTE(@sql)
    `,
            { replacements: { idserviciorequerido: id }, type: sequelize.QueryTypes.SELECT }
        ).then(function (dataeco) {
            todo.push(dataeco)

            //res.json({rows: user});
            callback(undefined, todo);
        }).catch(function (err) {
            //logger.error(err)
            //res.json({ error_code: 1 });
            callback(err, undefined);
        });
    }).catch(function (err) {
        //logger.error(err)
        //res.json({ error_code: 1 });
        callback(err, undefined);
    });

}

var matrizEvaluacionEconomica = function (id, callback) {
    sequelize.query(`DECLARE @cols NVARCHAR(MAX), @sql NVARCHAR(MAX)

SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(b.razonsocial)
            FROM sic.cotizacionservicio a
			join sip.proveedor b on a.idproveedor=b.id
			where a.idserviciorequerido=:idserviciorequerido
            ORDER BY 1
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'),1,1,'')

SET @sql = 'SELECT moneda, ' + @cols + '
              FROM
            (
              SELECT idmoneda, razonsocial, idserviciorequerido, costototal
                FROM sic.cotizacionservicio r
				join sip.proveedor x on r.idproveedor = x.id
				where idserviciorequerido= `+ id + `
            ) s
			join sip.moneda x on s.idmoneda = x.id
			
            PIVOT
            (
              MAX(costototal) FOR razonsocial IN (' + @cols + ')
            ) p'

EXECUTE(@sql)
    `,
        { replacements: { idserviciorequerido: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (data) {
        //res.json({rows: user});
        callback(undefined, data);
    }).catch(function (err) {
        //logger.error(err)
        //res.json({ error_code: 1 });
        callback(err, undefined);
    });

}


exports.columnas = function (req, res) {
    sequelize.query(`SELECT DISTINCT b.razonsocial
            FROM sic.notaevaluaciontecnica a
			join sip.proveedor b on a.idproveedor=b.id
			join sic.serviciosrequeridos c on c.id=a.idserviciorequerido
			where c.idsolicitudcotizacion=:idsolicitud
            ORDER BY 1
    `,
        { replacements: { idsolicitud: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.listadjudicados = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idserviciorequerido",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.solicitudcontrato.belongsTo(models.serviciosrequeridos, { foreignKey: 'idserviciorequerido' });
            models.solicitudcontrato.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.solicitudcontrato.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.solicitudcontrato.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [{
                        model: models.proveedor
                    }]

                }).then(function (solicitudcontrato) {
                    return res.json({ records: records, total: total, page: page, rows: solicitudcontrato });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.action = function (req, res) {
    var action = req.body.oper;
    var costototal = req.body.costototal
    
    var fecha = req.body.fechaadjudicacion

    if (action != "del") {
        if (fecha != "")
            fecha = fecha.split("-").reverse().join("-")
    }
    switch (action) {
        case "add":
            models.solicitudcontrato.create({
                idserviciorequerido: req.body.parent_id,
                idproveedor: req.body.idproveedor,
                idsolicitudcotizacion: req.body.abuelo,
                fechaadjudicacion: fecha,
                descripcion: req.body.descripcion,
                borrado: 1,
                traspaso: 0
            }).then(function (solicitudcontrato) {
                bitacora.registrarhijo(
                    req.body.abuelo,
                    'solicitudcontrato',
                    solicitudcontrato.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.solicitudcontrato,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: solicitudcontrato.id, parent: req.body.abuelo, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: solicitudcontrato.id, parent: req.body.abuelo, message: 'Falla', success: false });
                        }
                    }
                )
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false })
            });
            break;


        case "del":
            models.solicitudcontrato.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (respuesta) {
                bitacora.registrarhijo(
                    req.body.abuelo,
                    'solicitudcontrato',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.solicitudcontrato,
                    function (err, data) {
                        if (!err) {
                            models.solicitudcontrato.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', sucess: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
            })
            break;
    }
}