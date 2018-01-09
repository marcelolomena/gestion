'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");
var nodeExcel = require('excel-export');
var fs = require('fs');
var nodemailer = require('nodemailer');

exports.list = function (req, res) {
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
  var sqlcount = "With Lista As   ( SELECT DISTINCT(a.id)  AS count FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto ";
  if (filters && condition != "") {
    sqlcount += " Where "+condition + " ";
  }
  sqlcount += " ) SELECT count(*) AS count FROM lista  ";

  logger.debug("sqlcount:" + sqlcount);

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + rowspp + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT DISTINCT(a.id) id1, a.*, c.id idFabricante, c.nombre nombreFab, d.id idClasificacion, d.nombre nombreClas, "+
    "e.id idTipoLic, e.nombre nombreTipoLic, f.id idTipoInst, f.nombre nombreTipoInst "+     
    "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto "+
    "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id "+
    "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id "+
    "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id "+
    "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id ";
  if (filters && condition != "") {
    sql += "WHERE " + condition + " ";
    logger.debug("**" + sql + "**");
  }
  var sql2 = sql + "ORDER BY a.alertarenovacion desc OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  logger.debug("query:" + sql2);

  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    sequelize.query(sql2).spread(function (rows) {
      return res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
      logger.error(err)
      return res.json({ error_code: 1 });
    });
  })
}

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  logger.debug("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
  {
    caption: 'Producto',
    type: 'string',
    width: 200
  },
  {
    caption: 'Estado',
    type: 'string',
    width: 50
  },
  {
    caption: 'Compradas',
    type: 'number',
    width: 40
  },
  {
    caption: 'Instaladas',
    type: 'number',
    width: 40
  },
  {
    caption: 'Snow',
    type: 'number',
    width: 40
  },
  {
    caption: 'Addm',
    type: 'number',
    width: 40
  }
  ];

  var sql = "SELECT DISTINCT(a.id) id1, IIF (a.alertarenovacion='aGris', 'Historico', IIF(a.alertarenovacion='bAl Dia', 'Al día', a.alertarenovacion)) alerta, a.*, c.id idFabricante, c.nombre nombreFab, d.id idClasificacion, d.nombre nombreClas, " +
    "e.id idTipoLic, e.nombre nombreTipoLic, f.id idTipoInst, f.nombre nombreTipoInst " +
    "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto " +
    "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id " +
    "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id " +
    "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id " +
    "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id "+
    "ORDER BY a.alertarenovacion desc";
  console.log("query:"+sql);
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        var a = [i + 1,
        proyecto[i].nombre,
        proyecto[i].alerta,
        proyecto[i].licstock,
        proyecto[i].licocupadas,
        proyecto[i].snow,
        proyecto[i].addm
        ];
        arr.push(a);
      }
      //console.log("*******"+JSON.stringify(arr));
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "ReporteComparativo.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.debug(err);
      res.json({ error_code: 100 });
    });

};