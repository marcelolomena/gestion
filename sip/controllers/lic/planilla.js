'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var _ = require('lodash');

function update(data, res) {
  var oc = data.ordencompra == "" ? "NULL" : data.ordencompra;
  var sap = data.sap == "" ? "NULL" : data.sap;
  var idcui = (data.idcui == "0" || data.idcui == '') ? "NULL" : data.idcui;
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
  sql = sql + "comentario ='" + data.comentario + "', ";

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
  sequelize.query(sql).then(function (updated) {
    var sql2 = "UPDATE lic.producto " +
      "SET idfabricante = " + data.idfabricante + ", " +
      "idtipoinstalacion =" + data.idtipoinstalacion + ", " +
      "idclasificacion =" + data.idclasificacion + ", " +
      "idtipolicenciamiento =" + data.idtipolicenciamiento + ", " +
      "licstock = " + data.licstock + ", " +
      "licocupadas =" + data.licocupadas + ", " +
      "nombre ='" + data.nombre + "' " +
      "where id='" + data.idproducto + "'";
    console.log("sql2:" + sql2);
    sequelize.query(sql2).then(function (updated) {
      return res.json({
        error: 0,
        glosa: ''
      });
    }).catch(function (err) {
      logger.error(err);
      return res.json({
        error: 1,
        glosa: err.message
      });
    });
  }).catch(function (err) {
    logger.error(err);
    return res.json({
      error: 1,
      glosa: err.message
    });
  });
}

function destroy(id, res) {
  models.compra.destroy({
    where: {
      id: id
    }
  }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
    if (rowDeleted === 1) {
      logger.debug('Deleted successfully');
    }
    return res.json({
      success: true,
      glosa: ''
    });
  }).catch(function (err) {
    logger.error(err)
    return res.json({
      success: false,
      glosa: err.message
    });

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
          } else if (item.field == "contrato") {
          condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
        } else if (item.field == "ordencompra") {
          condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
        } else if (item.field == "idproveedor") {
          condition += 'h.' + 'razonsocial' + " like '%" + item.data + "%' AND ";
        } else{
          condition += 'a.' + item.field + "=" + item.data + " AND ";
        }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }
  var sqlcount = "SELECT count(*) AS count FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto LEFT JOIN sip.proveedor h ON b.idproveedor=h.id ";
  if (filters && condition != "") {
    sqlcount += " WHERE " + condition + " ";
  }

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + rowspp + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.*, b.*, h.razonsocial, c.nombre nombreFab, d.nombre nombreClas, " +
    "e.nombre nombreTipoLic, f.nombre nombreTipoInst, g.moneda " +
    "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto " +
    "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id " +
    "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id " +
    "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id " +
    "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id " +
    "LEFT JOIN sip.moneda g on b.idmoneda = g.id " +
    "LEFT JOIN sip.proveedor h ON b.idproveedor=h.id ";
  if (filters && condition != "") {
    sql += "WHERE " + condition + " ";
    // logger.debug("**" + sql + "**");
  }
  var sql2 = sql + "ORDER BY b.id desc OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  // logger.debug("query:" + sql2);
  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    sequelize.query(sql2).spread(function (rows) {
      res.json({
        records: records,
        total: total,
        page: page,
        rows: rows
      });
    }).catch(function (err) {
      logger.error(err)
      res.json({
        error_code: 1
      });
    });
  }).catch(function (err) {
    logger.error(err)
    res.json({
      error_code: 1
    });
  });
}


function action(req, res) {
  switch (req.body.oper) {
    case 'add':
      return create(req, res); //NO existe ADD en esta pantalla.
    case 'edit':
      return update(req.body, res);
    case 'del':
      return destroy(req.body.id, res);
  }
}



function excel(req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  var conf = {}

  conf.cols = [{
      caption: 'id',
      type: 'number',
      width: 3
    },
    {
      caption: 'Contrato',
      type: 'string',
      width: 30
    },
    {
      caption: 'O.C.',
      type: 'string',
      width: 30
    },
    {
      caption: 'CUI',
      type: 'string',
      width: 30
    },
    {
      caption: 'SAP',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fabricante',
      type: 'string',
      width: 80
    },
    {
      caption: 'Proveedor',
      type: 'string',
      width: 80
    },
    {
      caption: 'Software',
      type: 'string',
      width: 80
    },
    {
      caption: '¿Donde está instalada?',
      type: 'string',
      width: 30
    },
    {
      caption: 'Clasificación',
      type: 'string',
      width: 30
    },
    {
      caption: 'Tipo de Licenciamiento',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fecha Compra',
      type: 'string',
      width: 10
    },
    {
      caption: 'Fecha Expiración',
      type: 'string',
      width: 10
    },
    {
      caption: 'Tipo de Contrato',
      type: 'string',
      width: 10
    },
    {
      caption: 'N° Lic Compradas',
      type: 'string',
      width: 10
    },
    {
      caption: 'Moneda',
      type: 'string',
      width: 10
    },
    {
      caption: 'Valor Licencias',
      type: 'string',
      width: 10
    },
    {
      caption: 'Valor Soporte',
      type: 'string',
      width: 10
    },
    {
      caption: 'Fecha Renovación Soporte',
      type: 'string',
      width: 10
    },
    {
      caption: 'Factura',
      type: 'string',
      width: 10
    },
    {
      caption: 'Instalada por Producto',
      type: 'string',
      width: 10
    },
    {
      caption: 'Alerta Renovación',
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
      width: 1000
    }
  ];
  var sql = "SELECT b.contrato, b.ordencompra, convert(VARCHAR(10), b.idcui) as idcui, convert(VARCHAR(10), b.sap) as sap, c.nombre as nombreFab, h.razonsocial, a.nombre, f.nombre as nombreTipoInst, d.nombre as nombreClas,  " +
    "e.nombre as nombreTipoLic, convert(VARCHAR(10), b.fechacompra,105) as fechacompra, convert(VARCHAR(10), b.fechaexpiracion,105) as fechaexpiracion,  b.perpetua,  " +
    "convert(VARCHAR(10), b.liccompradas) as liccompradas, g.moneda, Format( valorlicencia ,'N','en-US' ) as valorlicencia, Format( valorsoporte ,'N','en-US' ) as valorsoporte,  " +
    "convert(VARCHAR(10), b.fecharenovasoporte,105) as fecharenovasoporte, b.factura, convert(VARCHAR(10), a.licocupadas) as licocupadas, b.alertarenovacion, b.comprador, b.correocomprador, b.comentario  " +
    "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto  " +
    "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id  " +
    "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id  " +
    "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id  " +
    "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id  " +
    "LEFT JOIN sip.moneda g on b.idmoneda = g.id  " +
    "LEFT JOIN sip.proveedor h ON b.idproveedor=h.id";
  sequelize.query(sql)
    .spread(function (planilla) {
      var arr = []

      for (var i = 0; i < planilla.length; i++) {
        var alerta = ''
        if (planilla[i].alertarenovacion == 'aGris') {
          alerta = 'HISTORICO'
        } else if (planilla[i].alertarenovacion == 'Vencida') {
          alerta = 'VENCIDA'
        } else if (planilla[i].alertarenovacion == 'Renovar') {
          alerta = 'RENOVAR'
        } else if (planilla[i].alertarenovacion == 'bAl Dia') {
          var alerta = 'AL DIA'
        }
        var a = [i + 1,
          (planilla[i].contrato == null) ? '' : planilla[i].contrato,
          (planilla[i].ordencompra == null) ? '' : planilla[i].ordencompra,
          (planilla[i].idcui == null) ? '' : planilla[i].idcui,
          (planilla[i].sap == null) ? '' : planilla[i].sap,
          (planilla[i].nombreFab == null) ? '' : planilla[i].nombreFab,
          (planilla[i].razonsocial == null) ? '' : planilla[i].razonsocial,
          (planilla[i].nombre == null) ? '' : planilla[i].nombre,
          (planilla[i].nombreTipoInst == null) ? '' : planilla[i].nombreTipoInst,
          (planilla[i].nombreClas == null) ? '' : planilla[i].nombreClas,
          (planilla[i].nombreTipoLic == null) ? '' : planilla[i].nombreTipoLic,
          (planilla[i].fechacompra == null) ? '' : planilla[i].fechacompra,
          (planilla[i].fechaexpiracion == null) ? '' : planilla[i].fechaexpiracion,
          (planilla[i].perpetua == 1) ? 'Perpetua' : 'Transitoria',
          (planilla[i].liccompradas == null) ? '' : planilla[i].liccompradas,
          (planilla[i].moneda == null) ? '' : planilla[i].moneda,
          (planilla[i].valorlicencia == null) ? '' : planilla[i].valorlicencia,
          (planilla[i].valorsoporte == null) ? '' : planilla[i].valorsoporte,
          (planilla[i].fecharenovasoporte == null) ? '' : planilla[i].fecharenovasoporte,
          (planilla[i].factura == null) ? '' : planilla[i].factura,
          (planilla[i].licocupadas == null) ? '' : planilla[i].licocupadas,
          alerta,
          (planilla[i].comprador == null) ? '' : planilla[i].comprador,
          (planilla[i].correocomprador == null) ? '' : planilla[i].correocomprador,
          (planilla[i].comentario == null) ? '' : planilla[i].comentario
        ];
        arr.push(a);
        // console.log(a);
        // console.log("JSON:" + JSON.stringify(a));
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "InventarioLicencias.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({
        error_code: 100
      });
    });
}

// function excel(req, res) {
//   var conf = {}
//   conf.cols = [
//     {
//       caption: 'CUI',
//       type: 'number',
//       width: 50
//     },
//     {
//       caption: 'Cuenta',
//       type: 'string',
//       width: 50
//     },
//     {
//       caption: 'Monto',
//       type: 'number',
//       width: 50
//     }
//   ];

//   models.desgloseitemfactura.belongsTo(models.detallefactura, { foreignKey: 'iddetallefactura' });
//   models.desgloseitemfactura.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
//   models.desgloseitemfactura.belongsTo(models.cuentascontables, { foreignKey: 'idcuentacontable' });
//   models.detallefactura.belongsTo(models.factura, { foreignKey: 'idfactura' });
//   models.factura.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

//   return models.desgloseitemfactura.findAll({
//     attributes: [['montoneto', 'montoneto'], ['ivanorecuperable', 'ivanorecuperable'], ['montocosto', 'montocosto']],
//     include: [
//       {
//         attributes: [['cui', 'cui']],
//         model: models.estructuracui
//       },
//       {
//         attributes: [['nombrecuenta', 'nombrecuenta'], ['cuentacontable', 'cuentacontable']],
//         model: models.cuentascontables
//       },
//       {
//         attributes: [['id', 'id']],
//         model: models.detallefactura,
//         include: [
//           {
//             attributes: [['id', 'id']],
//             model: models.factura,
//             where: { id: req.params.id }, include: [{
//               attributes: [['razonsocial', 'razonsocial']],
//               model: models.proveedor,
//             }]
//           },
//         ]
//       }]
//   }).then(function (desgloseitemfactura) {
//     var rows = []
//     for (var f in desgloseitemfactura) {
//       console.log(desgloseitemfactura[f].estructuracui.cui)
//       console.log(desgloseitemfactura[f].cuentascontable.nombrecuenta)
//       console.log(desgloseitemfactura[f].cuentascontable.cuentacontable)
//       console.log(desgloseitemfactura[f].detallefactura.factura.proveedor.razonsocial)
//       var item = [
//         //desgloseitemfactura[f].detallefactura.factura.proveedor.razonsocial,
//         desgloseitemfactura[f].estructuracui.cui,
//         //desgloseitemfactura[f].cuentascontable.nombrecuenta,
//         desgloseitemfactura[f].cuentascontable.cuentacontable,
//         desgloseitemfactura[f].montoneto,
//         //desgloseitemfactura[f].ivanorecuperable,
//         //desgloseitemfactura[f].montocosto
//       ]
//       rows.push(item);
//     }

//     conf.rows = rows;

//     var result = nodeExcel.execute(conf);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformates');
//     res.setHeader("Content-Disposition", "attachment;filename=" + "asiento_" + Math.floor(Date.now()) + ".xlsx");
//     res.end(result, 'binary');

//   }).catch(function (e) {
//     logger.error(e);
//     throw e;
//   });
// }


module.exports = {
  list: list,
  action: action,
  excel: excel
}




// function excel(req, res) {
//   var page = req.query.page;
//   var rows = req.query.rows;
//   var filters = req.query.filters;
//   var sidx = req.query.sidx;
//   var sord = req.query.sord;
//   var condition = "";
//   logger.debug("En getExcel");
//   var conf = {}

//   conf.cols = [{
//       caption: 'id',
//       type: 'number',
//       width: 3
//     },
//     {
//       caption: 'Contrato',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'O.C.',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'CUI',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'SAP',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Fabricante',
//       type: 'string',
//       width: 40
//     },
//     {
//       caption: 'Proveedor',
//       type: 'string',
//       width: 40
//     },
//     {
//       caption: 'Software',
//       type: 'string',
//       width: 40
//     },
//     {
//       caption: '¿Donde está instalada?',
//       type: 'string',
//       width: 15
//     },
//     {
//       caption: 'Clasificación',
//       type: 'string',
//       width: 15
//     },
//     {
//       caption: 'Tipo de Licenciamiento',
//       type: 'string',
//       width: 15
//     },
//     {
//       caption: 'Fecha Compra',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Fecha Expiración',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Perpetua',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'N° Lic Compradas',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Moneda',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Valor Licencias',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Valor Soporte',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Fecha Renovación Soporte',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Factura',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Cant. Compradas',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'N° Lic. Instaladas',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Alerta de Renovación',
//       type: 'string',
//       width: 10
//     },
//     {
//       caption: 'Comprador',
//       type: 'string',
//       width: 30
//     },
//     {
//       caption: 'Correo Comprador',
//       type: 'string',
//       width: 30
//     },
//     {
//       caption: 'Comentarios',
//       type: 'string',
//       width: 50
//     }
//   ];

//   var sql = "SELECT a.*, b.id, b.idproducto, b.contrato, b.ordencompra, b.idcui, b.sap, b.idproveedor, convert(VARCHAR(10), b.fechacompra,105) fechacompra, " +
//     "convert(VARCHAR(10), b.fechaexpiracion,105) fechaexpiracion, convert(VARCHAR(10), b.liccompradas) liccompradas, " +
//     "b.cantidadsoporte, b.idmoneda, Format( valorlicencia ,'N','en-US' ) valorlicencia, Format( valorsoporte ,'N','en-US' ) valorsoporte, convert(VARCHAR(10), b.fecharenovasoporte,105) fecharenovasoporte, b.factura, b.comprador, b.correocomprador, " +
//     "b.alertarenovacion, b.perpetua, b.fechacambioalerta, c.id idFabricante, h.razonsocial, c.nombre nombreFab, d.id idClasificacion, d.nombre nombreClas, " +
//     "e.id idTipoLic, e.nombre nombreTipoLic, f.id idTipoInst, f.nombre nombreTipoInst, g.moneda  " +
//     "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto  " +
//     "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id  " +
//     "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id  " +
//     "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id  " +
//     "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id  " +
//     "LEFT JOIN sip.moneda g on b.idmoneda = g.id  " +
//     "LEFT JOIN sip.proveedor h ON b.idproveedor=h.id";
//   console.log("query excel:" + sql);
//   sequelize.query(sql)
//     .spread(function (planilla) {
//       var arr = []
//       for (var i = 0; i < planilla.length; i++) {
//         var a = [i + 1, planilla[i].contrato,
//           planilla[i].ordencompra,
//           planilla[i].idcui,
//           planilla[i].sap,
//           planilla[i].nombreFab,
//           planilla[i].razonsocial,
//           planilla[i].nombre,
//           planilla[i].nombreTipoInst,
//           planilla[i].nombreClas,
//           planilla[i].nombreTipoLic,
//           planilla[i].fechacompra,
//           planilla[i].fechaexpiracion,
//           (planilla[i].perpetua == 1) ? 'Perpetua' : 'Transitoria',
//           planilla[i].licstock,
//           planilla[i].moneda,
//           planilla[i].valorlicencia,
//           planilla[i].valorsoporte,
//           planilla[i].fecharenovasoporte,
//           planilla[i].factura,
//           planilla[i].liccompradas,
//           planilla[i].licocupadas,
//           (planilla[i].alertarenovacion == 'bAl Dia' || planilla[i].alertarenovacion == 'aGris') ? planilla[i].alertarenovacion.substring(1) : planilla[i].alertarenovacion,
//           planilla[i].comprador,
//           planilla[i].correocomprador,
//           planilla[i].comentarios
//         ];
//         arr.push(a);
//         console.log(a);
//         console.log("JSON:" + JSON.stringify(a));
//       }
//       conf.rows = arr;

//       var result = nodeExcel.execute(conf);
//       res.setHeader('Content-Type', 'application/vnd.openxmlformates');
//       res.setHeader("Content-Disposition", "attachment;filename=" + "InventarioLicencias.xlsx");
//       res.end(result, 'binary');

//     }).catch(function (err) {
//       logger.error(err);
//       res.json({
//         error_code: 100
//       });
//     });

// };