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
                //console.dir(data)
                //res.json({ rows: data });
                /*
                var total = []
        var totales = []
        var proveedores = []

        var moneda = data[0].moneda
        var fila = JSON.stringify(data[0]).replace('}', '').split(",")

        var datum = []
        for (var j = 1; j < fila.length; j++) {
            datum.push(parseFloat(fila[j].split(":")[1]))
            proveedores.push(fila[j].split(":")[0].replace(/["']/g, ""))
        }
        total.push(datum)


        console.dir(total)
        var sum = (r, a) => r.map((b, i) => a[i] + b);
        var tot1 = total.reduce(sum)
        console.log("EL TOTAL" + tot1);
        var maxim = tot1.min()
        console.log(maxim);
        var ponderados = []
        for (var k = 0; k < tot1.length; k++) {
            if (tot1[k] === maxim) {
                ponderados.push(100)
            } else {
                ponderados.push((maxim / tot1[k]) * 100)
            }
        }

        console.dir(proveedores)
        var eljson = []
        for (var l = 0; l < proveedores.length; l++) {
            var item = {}
            var name = proveedores[l]
            item[name] = ponderados[l]
            eljson.push(item)

        }
        console.dir(eljson)
        var patron = /},{/g
        var o = JSON.stringify(eljson).replace(patron, ",");
        console.dir(JSON.parse(o));*/
                //console.dir(todo[0])
                //console.dir(todo[1])
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

exports.matriznivel2 = function (req, res) {
    sequelize.query(`DECLARE @cols NVARCHAR(MAX), @sql NVARCHAR(MAX)

SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(b.razonsocial)
            FROM sic.notaevaluaciontecnica2 a
			join sip.proveedor b on a.idproveedor=b.id
			join sic.criterioevaluacion2 f on f.id=a.idcriterioevaluacion2
			where f.idcriterioevaluacion=:idcriterioevaluacion
            ORDER BY 1
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'),1,1,'')

SET @sql = 'SELECT idcriterioevaluacion2, nombre, porcentaje, ' + @cols + '
              FROM
            (
              SELECT idcriterioevaluacion2, razonsocial, nota
                FROM sic.notaevaluaciontecnica2 r
				join sip.proveedor x on r.idproveedor = x.id
				join sic.criterioevaluacion2 t on t.id=r.idcriterioevaluacion2
				where t.idcriterioevaluacion=`+ req.params.id + `
            ) s
			join sic.criterioevaluacion2 x on s.idcriterioevaluacion2 = x.id
			
            PIVOT
            (
              MAX(nota) FOR razonsocial IN (' + @cols + ')
            ) p'

EXECUTE(@sql)
    `,
        { replacements: { idcriterioevaluacion: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json({ rows: user });
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.columnaseco = function (req, res) {
    sequelize.query(`SELECT DISTINCT b.razonsocial
            FROM sic.cotizacionservicio a
			join sip.proveedor b on a.idproveedor=b.id
			where a.idserviciorequerido= :idserviciorequerido
            ORDER BY 1
    `,
        { replacements: { idserviciorequerido: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.matrizeco = function (req, res) {
    matrizEvaluacionEconomica(req.params.id, function (err, data) {
        //console.dir(data)
        res.json({ rows: data });
    })
};

exports.matriztotalajustada = function (req, res) {
    matrizEvaluacion(req.params.id, function (err, data) {
        //console.dir(data)
        //res.json({ rows: data });
        var total = []
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

        console.dir(total)
        var sum = (r, a) => r.map((b, i) => a[i] + b);
        var tot1 = total.reduce(sum)
        console.log("EL TOTAL" + tot1);
        var maxim = tot1.max()
        console.log(maxim);
        var ponderados = []
        for (var k = 0; k < tot1.length; k++) {
            if (tot1[k] === maxim) {
                ponderados.push(100)
            } else {
                ponderados.push((tot1[k] / maxim) * 100)
            }
        }
        var ponderados2 = []
        for (var k = 0; k < tot1.length; k++) {
            ponderados2.push(tot1[k])

        }
        console.dir(proveedores)
        var eljson = []
        for (var l = 0; l < proveedores.length; l++) {
            var item = {}
            var name = proveedores[l]
            item[name] = ponderados[l]
            eljson.push(item)

        }
        console.dir(eljson)
        var patron = /},{/g
        var o = JSON.stringify(eljson).replace(patron, ",");
        console.dir(JSON.parse(o));

        var eljson2 = []
        for (var l = 0; l < proveedores.length; l++) {
            var item = {}
            var name = proveedores[l]
            item[name] = ponderados2[l]
            eljson2.push(item)

        }
        console.dir(eljson2)
        var o2 = JSON.stringify(eljson2).replace(patron, ",");
        console.dir(JSON.parse(o2));

        res.json({ rows: JSON.parse(o), rows2: JSON.parse(o2) });
    })
};

exports.matriztotaleco = function (req, res) {

    matrizEvaluacionEconomica(req.params.id, function (err, data) {
        //console.dir(data)
        //res.json({ rows: data });
        var total = []
        var totales = []
        var proveedores = []

        var moneda = data[0].moneda
        var fila = JSON.stringify(data[0]).replace('}', '').split(",")

        var datum = []
        for (var j = 1; j < fila.length; j++) {
            datum.push(parseFloat(fila[j].split(":")[1]))
            proveedores.push(fila[j].split(":")[0].replace(/["']/g, ""))
        }
        total.push(datum)


        console.dir(total)
        var sum = (r, a) => r.map((b, i) => a[i] + b);
        var tot1 = total.reduce(sum)
        console.log("EL TOTAL" + tot1);
        var maxim = tot1.min()
        console.log(maxim);
        var ponderados = []
        for (var k = 0; k < tot1.length; k++) {
            if (tot1[k] === maxim) {
                ponderados.push(100)
            } else {
                ponderados.push((maxim / tot1[k]) * 100)
            }
        }

        console.dir(proveedores)
        var eljson = []
        for (var l = 0; l < proveedores.length; l++) {
            var item = {}
            var name = proveedores[l]
            item[name] = ponderados[l]
            eljson.push(item)

        }
        console.dir(eljson)
        var patron = /},{/g
        var o = JSON.stringify(eljson).replace(patron, ",");
        console.dir(JSON.parse(o));




        res.json({ rows: JSON.parse(o) });
    })



    /*
    sequelize.query(`DECLARE @cols NVARCHAR(MAX), @sql NVARCHAR(MAX), @costobarato float, @sqlfinal NVARCHAR(MAX), @query NVARCHAR(MAX), @alias NVARCHAR(MAX), @num INT = 0
 
SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(b.razonsocial)
            FROM sic.cotizacionservicio a
            join sip.proveedor b on a.idproveedor=b.id
            where a.idserviciorequerido=`+ req.params.id + `
            ORDER BY 1
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'),1,1,'')
 
DECLARE @intBandera INT =  0
DECLARE @intTamano INT =  0
DECLARE @proveedorbarato INT
DECLARE @strValor NVARCHAR(MAX) = ''
DECLARE @strCadena NVARCHAR(MAX) = @cols
 
DECLARE @sumas table (suma NVARCHAR(MAX));
 
SELECT @proveedorbarato=idproveedor, @costobarato = costototal
FROM sic.cotizacionservicio
where idserviciorequerido=`+ req.params.id + ` and costototal = (SELECT MIN(costototal) FROM sic.cotizacionservicio where idserviciorequerido=` + req.params.id + `)
 
 
WHILE @intBandera = 0
 
BEGIN
  BEGIN TRY
    SET @strValor = RIGHT(LEFT(@strCadena,CHARINDEX(',', @strCadena,1)-1),CHARINDEX(',', @strCadena,1)-1)
 
    if  (select id from sip.proveedor where razonsocial=@strValor)=@proveedorbarato
    BEGIN 
    print ('ENTRAMOS 1')
 
    SET @sql = ' select SUM('+@strValor+') as '+@strValor+' from (
            SELECT moneda, ' + @cols + '
              FROM
            (
 
            SELECT idmoneda, razonsocial, idserviciorequerido, 100 as costototal
                FROM sic.cotizacionservicio r
                join sip.proveedor x on r.idproveedor = x.id
                where idserviciorequerido=`+ req.params.id + ` 
                ) s
            join sip.moneda x on s.idmoneda = x.id
            PIVOT
            (
              MAX(costototal) FOR razonsocial IN (' + @cols + ')
            ) p ) a'
      
    END 
    ELSE 
  BEGIN 
  print ('ENTRAMOS 2')
      SET @sql = ' select SUM('+@strValor+') as '+@strValor+' from (
            SELECT moneda, ' + @cols + '
              FROM
            (
 
            SELECT idmoneda, razonsocial, idserviciorequerido, ((SELECT costototal
FROM sic.cotizacionservicio
where idserviciorequerido=`+ req.params.id + ` and costototal = (SELECT MIN(costototal) FROM sic.cotizacionservicio where idserviciorequerido=` + req.params.id + `))/costototal)*100 as costototal
                FROM sic.cotizacionservicio r
                join sip.proveedor x on r.idproveedor = x.id
                where idserviciorequerido=`+ req.params.id + ` 
                ) s
            join sip.moneda x on s.idmoneda = x.id
            PIVOT
            (
              MAX(costototal) FOR razonsocial IN (' + @cols + ')
            ) p ) a'
  END
	
 
            insert into @sumas values (@sql)
 
            SET @intTamano = LEN(@strValor)
     
 
    SET @strCadena = SUBSTRING(@strCadena,@intTamano + 2, LEN(@strCadena)) 
  END TRY
  BEGIN CATCH
 
 if  (select id from sip.proveedor where razonsocial=@strValor)=@proveedorbarato
    BEGIN 
    print ('ENTRAMOS 3')
 
    SET @sql = ' select SUM('+@strCadena+') as '+@strCadena+' from (
            SELECT moneda, ' + @cols + '
              FROM
            (
 
            SELECT idmoneda, razonsocial, idserviciorequerido, 100 as costototal
                FROM sic.cotizacionservicio r
                join sip.proveedor x on r.idproveedor = x.id
                where idserviciorequerido=`+ req.params.id + ` 
                ) s
            join sip.moneda x on s.idmoneda = x.id
            PIVOT
            (
              MAX(costototal) FOR razonsocial IN (' + @cols + ')
            ) p ) a'
      
    END 
    ELSE 
  BEGIN 
  print ('ENTRAMOS 4')
      SET @sql = ' select SUM('+@strCadena+') as '+@strCadena+' from (
            SELECT moneda, ' + @cols + '
              FROM
            (
 
            SELECT idmoneda, razonsocial, idserviciorequerido, ((SELECT costototal
FROM sic.cotizacionservicio
where idserviciorequerido=`+ req.params.id + ` and costototal = (SELECT MIN(costototal) FROM sic.cotizacionservicio where idserviciorequerido=` + req.params.id + `))/costototal)*100 as costototal
                FROM sic.cotizacionservicio r
                join sip.proveedor x on r.idproveedor = x.id
                where idserviciorequerido=`+ req.params.id + ` 
                ) s
            join sip.moneda x on s.idmoneda = x.id
            PIVOT
            (
              MAX(costototal) FOR razonsocial IN (' + @cols + ')
            ) p ) a'
  END
 
            insert into @sumas values (@sql)
 
            SET @intBandera = 1
  END CATCH 
END
 
 
SET @sqlfinal = 'select ''Calificación económica ajustada'' as moneda, * from ( '
 
declare CURSOR1 cursor for 
select suma from @sumas 
open CURSOR1
fetch next from CURSOR1 
into @query 
while @@fetch_status = 0 
        begin 
        SET @num = @num+1
        SET @alias = 'alias'+CONVERT(varchar(10), @num)
        SET @sqlfinal = @sqlfinal+@query+') as '+@alias+',('
 
        fetch next from CURSOR1 
        into @query 
        end 
close CURSOR1 
deallocate CURSOR1
 
SET @sqlfinal = SUBSTRING (@sqlfinal, 1, Len(@sqlfinal) - 2 )
 
 
 
 
EXECUTE(@sqlfinal)
    `,
        { replacements: { idserviciorequerido: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json({ rows: user });
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
    */
};

exports.matriztotal = function (req, res) {
    sequelize.query(`DECLARE @cols NVARCHAR(MAX), @sql NVARCHAR(MAX),  @sqlfinal NVARCHAR(MAX), @query NVARCHAR(MAX), @alias NVARCHAR(MAX), @num INT = 0


SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(b.razonsocial)
            FROM sic.notaevaluaciontecnica a
			join sip.proveedor b on a.idproveedor=b.id
			where a.idserviciorequerido=`+ req.params.id + `
            ORDER BY 1
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'),1,1,'')

--print (@cols)
DECLARE @intBandera INT =  0
DECLARE @intTamano INT =  0
DECLARE @strValor NVARCHAR(MAX) = ''
DECLARE @strCadena NVARCHAR(MAX) = @cols

DECLARE @sumas table (suma NVARCHAR(MAX));
 
WHILE @intBandera = 0
BEGIN
  BEGIN TRY
    SET @strValor = RIGHT(LEFT(@strCadena,CHARINDEX(',', @strCadena,1)-1),CHARINDEX(',', @strCadena,1)-1)
    

	SET @sql = ' select SUM('+@strValor+') as '+@strValor+' from (
			SELECT idcriterioevaluacion, idserviciorequerido, nombre, ' + @cols + '
              FROM
            (
              SELECT idcriterioevaluacion, idserviciorequerido, razonsocial, nombre, nota*(porcentaje/100) as resultado
                FROM sic.notaevaluaciontecnica r
				join sip.proveedor x on r.idproveedor = x.id
				join sic.criterioevaluacion l on r.idcriterioevaluacion = l.id
				where idserviciorequerido=`+ req.params.id + ` 
            ) s
			--join sic.criterioevaluacion x on s.idcriterioevaluacion = x.id
			
            PIVOT
            (
              MAX(resultado) FOR razonsocial IN (' + @cols + ')
            ) p ) a'

			insert into @sumas values (@sql)

    SET @intTamano = LEN(@strValor)
	 
 
    SET @strCadena = SUBSTRING(@strCadena,@intTamano + 2, LEN(@strCadena)) 
  END TRY
  BEGIN CATCH 
    SET @sql = ' select SUM('+@strCadena+') as '+@strCadena+' from (
			SELECT idcriterioevaluacion, idserviciorequerido, nombre, ' + @cols + '
              FROM
            (
              SELECT idcriterioevaluacion, idserviciorequerido, razonsocial, nombre, nota*(porcentaje/100) as resultado
                FROM sic.notaevaluaciontecnica r
				join sip.proveedor x on r.idproveedor = x.id
				join sic.criterioevaluacion l on r.idcriterioevaluacion = l.id
				where idserviciorequerido=`+ req.params.id + ` 
            ) s
			--join sic.criterioevaluacion x on s.idcriterioevaluacion = x.id
			
            PIVOT
            (
              MAX(resultado) FOR razonsocial IN (' + @cols + ')
            ) p ) a'
	insert into @sumas values (@sql)
    SET @intBandera = 1
  END CATCH 
END
SET @sqlfinal = 'select ''Calificación técnica ajustada'' as porcentaje, * from ( '

declare CURSOR1 cursor for 
select suma from @sumas 
open CURSOR1
fetch next from CURSOR1 
into @query 
while @@fetch_status = 0 
        begin 
		SET @num = @num+1
        SET @alias = 'alias'+CONVERT(varchar(10), @num)
		SET @sqlfinal = @sqlfinal+@query+') as '+@alias+',('

        fetch next from CURSOR1 
        into @query 
        end 
close CURSOR1 
deallocate CURSOR1

SET @sqlfinal = SUBSTRING (@sqlfinal, 1, Len(@sqlfinal) - 2 )

--PRINT (@sqlfinal)
EXECUTE (@sqlfinal)
    `,
        { replacements: { idserviciorequerido: req.params.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json({ rows: user });
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};