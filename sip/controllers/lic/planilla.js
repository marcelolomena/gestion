'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var _ = require('lodash');

var entity = models.producto;
entity.belongsTo(models.fabricante, { foreignKey: 'idFabricante' });
entity.belongsTo(models.clasificacion, { foreignKey: 'idClasificacion' });
entity.belongsTo(models.tipoInstalacion, { foreignKey: 'idTipoInstalacion' });
entity.belongsTo(models.tipoLicenciamiento, { foreignKey: 'idTipoLicenciamiento' });
entity.hasMany(models.compra, { sourceKey: 'id', foreignKey: 'idProducto' });
var includes = [
    {
        model: models.fabricante
    }, {
        model: models.clasificacion
    }, {
        model: models.tipoInstalacion
    }, {
        model: models.tipoLicenciamiento
    }, {
        model: models.compra,
        include: [
            {
                model: models.moneda
            }, {
                model: models.proveedor
            }
        ]
    }
];
var childEntity = models.compra;

function excelMapper(data) {
    var result = [];
    _.each(data, function (item) {
        if (item.compras) {
            _.each(item.compras, function (sItem) {
                result.push([sItem.contrato,
                sItem.ordenCompra || '',
                sItem.estructuracuibch ? sItem.estructuracuibch.cui : '',
                sItem.sap || '',
                item.fabricante ? item.fabricante.nombre : '',
                sItem.proveedor.razonsocial,
                item.nombre,
                item.tipoInstalacion ? item.tipoInstalacion.nombre : '',
                item.clasificacion ? item.clasificacion.nombre : '',
                item.clasificacion ? item.tipoLicenciamiento.nombre : '',
                base.fromDate(sItem.fechaCompra),
                base.fromDate(sItem.fechaExpiracion),
                sItem.licCompradas || '',
                sItem.cantidadSoporte || '',
                sItem.moneda.moneda,
                sItem.valorLicencia || '',
                sItem.valorSoporte || '',
                base.fromDate(sItem.fechaRenovaSoporte),
                sItem.factura || '',
                item.licStock || '',
                item.licOcupadas || '',
                item.alertaRenovacion ? 'Al día' : 'Vencida',
                sItem.comprador || '',
                sItem.correoComprador || '',
                item.utilidad || '',
                item.comentarios || '']
                );
            });
        }
    });
    return result;
}

function update(entity, data, res) {
    var oc = data.ordencompra == "" ? "NULL" : data.ordencompra;
    var sap = data.sap == "" ? "NULL" : data.sap;
    var idcui = data.idcui == "0" ? "NULL" : data.idcui;
    var sql = "UPDATE lic.compra SET " +
        "idproducto = " + data.idproducto + ", " +
        "contrato = '" + data.contrato + "', " +
        "ordencompra = " + oc + ", " +
        "idcui =" + idcui + ", " +
        "sap = " + sap + ", " +
        "perpetua = " + data.perpetua + ", " +
        "idproveedor = " + data.idproveedor + ", ";
    console.log("fechacompra:'" + data.fechacompra + "', " + data.fechacompra.length);
    if (data.fechacompra.length > 0) {
        sql = sql + "fechacompra = '" + base.strToDateDB(data.fechacompra) + "', ";
    } else {
        sql = sql + "fechacompra = NULL, ";
    }

    if (data.fechaexpiracion.length > 0) {
        sql = sql + "fechaexpiracion = '" + base.strToDateDB(data.fechaexpiracion) + "', ";
    } else {
        sql = sql + "fechaexpiracion = NULL, ";
    }
    sql = sql + "liccompradas = " + data.liccompradas + ", ";
    sql = sql + "idmoneda = " + data.idmoneda + ", ";
    sql = sql + "valorlicencia = " + data.valorlicencia + ", ";
    sql = sql + "valorsoporte = " + data.valorsoporte + ", ";
    if (data.factura.length > 0) {
        sql = sql + "factura = " + data.factura + ", ";
    } else {
        sql = sql + "factura = NULL, ";
    }
    if (data.fecharenovasoporte.length > 0) {
        sql = sql + "fecharenovasoporte = '" + base.strToDateDB(data.fecharenovasoporte) + "', ";
    } else {
        sql = sql + "fecharenovasoporte = NULL, ";
    }
    sql = sql + "comprador = '" + data.comprador + "', ";
    sql = sql + "correocomprador ='" + data.correocomprador;
    sql = sql + "' where id=" + data.id;
    console.log("sql:" + sql);
    sequelize.query(sql
    ).then(function (updated) {
        var sql2 = "UPDATE lic.producto " +
            "SET idfabricante = " + data.idfabricante + ", " +
            "idtipoinstalacion =" + data.idtipoinstalacion + ", " +
            "idclasificacion =" + data.idclasificacion + ", " +
            "idtipolicenciamiento =" + data.idtipolicenciamiento + ", " +
            "licstock = " + data.licstock + ", " +
            "licocupadas =" + data.licocupadas + ", " +
            "comentarios ='" + data.comentarios + "', " +
            "nombre ='" + data.nombre + "' " +
            "where id='" + data.idproducto + "'";
        console.log("sql2:" + sql2);
        sequelize.query(sql2).then(function (updated) {
            return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1, glosa: err.message });
        });
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error: 1, glosa: err.message });
    });
}
function destroy(entity, id, res) {
    models.compra.destroy({
        where: {
          id: id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        return res.json({ success: true, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ success: false, glosa: err.message });

    });
}

function list(req, res) {
    var page = req.query.page;
    var rowspp = req.query.rows;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var cui = req.params.cui
    var periodo = req.params.periodo
    var proveedor = req.params.proveedor
    var filters = req.query.filters;
    var condition = "";
  
    if (filters) {
      var jsonObj = JSON.parse(filters);
      if (JSON.stringify(jsonObj.rules) != '[]') {
        jsonObj.rules.forEach(function (item) {
          if (item.op === 'cn' || item.op === 'eq')
            if (item.field == 'nombre') {
              condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
            } else {
              condition += 'a.' + item.field + "=" + item.data + " AND ";
            } 
        });
        condition = condition.substring(0, condition.length - 5);
        logger.debug("***CONDICION:" + condition);
      }
    }
    var sqlcount = "SELECT count(*) AS count FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto ";
    if (filters && condition != "") {
      sqlcount += " WHERE "+condition + " ";
    }
  
    var sql = "DECLARE @PageSize INT; " +
      "SELECT @PageSize=" + rowspp + "; " +
      "DECLARE @PageNumber INT; " +
      "SELECT @PageNumber=" + page + "; " +
      "SELECT a.*, b.*, h.razonsocial, c.nombre nombreFab, d.nombre nombreClas, "+
      "e.nombre nombreTipoLic, f.nombre nombreTipoInst, g.moneda "+     
      "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto "+
      "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id "+
      "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id "+
      "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id "+
      "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id "+
      "LEFT JOIN sip.moneda g on b.idmoneda = g.id "+
      "LEFT JOIN sip.proveedor h ON b.idproveedor=h.id ";
    if (filters && condition != "") {
      sql += "WHERE " + condition + " ";
      logger.debug("**" + sql + "**");
    }
    var sql2 = sql + "ORDER BY b.id desc OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
    var records;
    logger.debug("query:" + sql2);
    sequelize.query(sqlcount).spread(function (recs) {
      var records = recs[0].count;
      var total = Math.ceil(parseInt(recs[0].count) / rowspp);
      sequelize.query(sql2).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
      });
    }).catch(function (err) {
      logger.error(err)
      res.json({ error_code: 1 });
    });
  }


function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return create(entity, map(req), res);
        case 'edit':
            return update(entity, req.body, res);
        case 'del':
            return destroy(entity, req.body.id, res);
    }
}

function excelOld(req, res) {
    var cols = [
        {
            caption: 'Contrato',
            type: 'string',
            width: 80
        }, {
            caption: 'OrdenCompra',
            type: 'string',
            width: 80
        }, {
            caption: 'CUI',
            type: 'string',
            width: 80
        }, {
            caption: 'SAP',
            type: 'string',
            width: 80
        }, {
            caption: 'Fabricante',
            type: 'string',
            width: 180
        }, {
            caption: 'Proveedor',
            type: 'string',
            width: 300
        }, {
            caption: 'Software',
            type: 'string',
            width: 200
        }, {
            caption: 'DondeEstaInstalada',
            type: 'string',
            width: 160
        }, {
            caption: 'Clasificacion',
            type: 'string',
            width: 170
        }, {
            caption: 'TipoLicenciamiento',
            type: 'string',
            width: 200
        }, {
            caption: 'FechaCompra',
            type: 'string',
            width: 125
        }, {
            caption: 'FechaExpiracion',
            type: 'string',
            width: 70
        }, {
            caption: 'LicenciaCompradas',
            type: 'string',
            width: 110
        }, {
            caption: 'Soporte',
            type: 'string',
            width: 110
        }, {
            caption: 'Moneda',
            type: 'string',
            width: 110
        }, {
            caption: 'ValorLicencias',
            type: 'string',
            width: 125
        }, {
            caption: 'ValorSoportes',
            type: 'string',
            width: 80
        }, {
            caption: 'FechaRenovacion',
            type: 'string',
            width: 125
        }, {
            caption: 'Factura',
            type: 'string',
            width: 125
        }, {
            caption: 'NLicenciaCompradas',
            type: 'string',
            width: 100
        }, {
            caption: 'NLicenciaInstaladas',
            type: 'string',
            width: 100
        }, {
            caption: 'AlertaRenovacion',
            type: 'string',
            width: 40
        }, {
            caption: 'Comprador',
            type: 'string',
            width: 200
        }, {
            caption: 'CorreoComprador',
            type: 'string',
            width: 200
        }, {
            caption: 'Utilidad',
            type: 'string',
            width: 200
        }, {
            caption: 'Comentarios',
            type: 'string',
            width: 200
        }
    ];
    base.exportList(req, res, entity, includes, excelMapper, cols, 'InventarioLicencias');
}
module.exports = {
    list: list,
    action: action,
    excel: excel
}

function excel(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var condition = "";
    logger.debug("En getExcel");
    var conf = {}
/*
Contrato
O.C.
CUI
SAP
Fabricante
Proveedor
Software
¿Donde está instalada?
Clasificación
Tipo de Licenciamiento
Fecha Compra
Fecha Expiración
Perpetua
N° Lic Compradas
Moneda
Valor Licencias
Valor Soportes
Fecha Renovación Soporte
Factura
Cant. Compradas
N° Lic. Instaladas
Alerta de Renovación
Comprador
Correo Comprador
Comentarios
*/
    conf.cols = [{
      caption: 'id',
      type: 'number',
      width: 3
    },
      {
        caption: 'Contrato',
        type: 'string',
        width: 10
      },
      {
        caption: 'CUI',
        type: 'string',
        width: 40
      },
      {
        caption: 'SAP',
        type: 'string',
        width: 40
      },
      {
        caption: 'Fabricante',
        type: 'string',
        width: 20
      },
      {
        caption: 'Proveedor',
        type: 'string',
        width: 10
      },
      {
        caption: '¿Donde está instalada?',
        type: 'string',
        width: 15
      },
      {
        caption: 'Clasificación',
        type: 'string',
        width: 15
      },
      {
        caption: 'Tipo de Licenciamiento',
        type: 'string',
        width: 15
      },
      {
        caption: 'Fecha Compra',
        type: 'string',
        width: 30
      },
      {
        caption: 'Fecha Expiración',
        type: 'string',
        width: 30
      },
      {
        caption: 'Perpetua',
        type: 'string',
        width: 30
      },
      {
        caption: 'N° Lic Compradas',
        type: 'string',
        width: 30
      },
      {
        caption: 'Moneda',
        type: 'string',
        width: 30
      },
      {
        caption: 'Valor Licencias',
        type: 'string',
        width: 30
      },
      {
        caption: 'Valor Soportes',
        type: 'string',
        width: 30
      },
      {
        caption: 'Fecha Renovación Soporte',
        type: 'string',
        width: 30
      },
      {
        caption: 'Factura',
        type: 'string',
        width: 30
      },
      {
        caption: 'Cant. Compradas',
        type: 'string',
        width: 30
      },
      {
        caption: 'N° Lic. Instaladas',
        type: 'string',
        width: 30
      },
      {
        caption: 'Alerta de Renovación',
        type: 'string',
        width: 30
      },
      {
        caption: 'Comprador',
        type: 'string',
        width: 30
      },
      {
        caption: 'Correo Comprador',
        type: 'string',
        width: 30
      },
      {
        caption: 'Comentarios',
        type: 'string',
        width: 30
      }
    ];
  
    var sql = "SELECT a.*, b.*, c.id idFabricante, h.razonsocial, c.nombre nombreFab, d.id idClasificacion, d.nombre nombreClas, "+
    "e.id idTipoLic, e.nombre nombreTipoLic, f.id idTipoInst, f.nombre nombreTipoInst, g.moneda  "+
    "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto  "+
    "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id  "+
    "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id  "+
    "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id  "+
    "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id  "+
    "LEFT JOIN sip.moneda g on b.idmoneda = g.id  "+
    "LEFT JOIN sip.proveedor h ON b.idproveedor=h.id ";
  
    sequelize.query(sql)
      .spread(function (planilla) {
        var arr = []
        for (var i = 0; i < planilla.length; i++) {
/*id, idfabricante, nombre, idtipoinstalacion, idclasificacion, idtipolicenciamiento, licstock, licocupadas, alertarenovacion, comentarios,
 lictramite, ilimitado, snow, addm, estado, id, idproducto, contrato, ordencompra, idcui, sap, idproveedor, fechacompra, fechaexpiracion,
  liccompradas, cantidadsoporte, idmoneda, valorlicencia, valorsoporte, fecharenovasoporte, factura, comprador, correocomprador, 
  alertarenovacion, perpetua, fechacambioalerta, idFabricante, razonsocial, nombreFab, idClasificacion, nombreClas, idTipoLic, 
  nombreTipoLic, idTipoInst, nombreTipoInst, moneda */ 
          a = [i + 1, planilla[i].contrato,
            planilla[i].ordencompra,
            planilla[i].idcui,
            planilla[i].sap,
            planilla[i].nombreFab,
            planilla[i].razonsocial,
            planilla[i].nombre,
            planilla[i].nombreTipoInst,
            planilla[i].nombreClas,
            planilla[i].nombreTipoLic,
            planilla[i].fechacompra,
            planilla[i].fechaexpiracion,
            planilla[i].perpetua,
            planilla[i].licstock,
            planilla[i].moneda,
            planilla[i].valorlicencia,
            planilla[i].valorsoporte,
            planilla[i].fecharenovasoporte,
            planilla[i].factura,
            planilla[i].liccompradas,
            planilla[i].licocupadas,
            planilla[i].alertarenovacion,
            planilla[i].comprador,
            planilla[i].correocomprador,
            planilla[i].comentarios,                        
          ];
          arr.push(a);
        }
        conf.rows = arr;
  
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        res.setHeader("Content-Disposition", "attachment;filename=" + "InventarioLicencias.xlsx");
        res.end(result, 'binary');
  
      }).catch(function (err) {
        logger.err(err);
        res.json({ error_code: 100 });
      });
  
  };