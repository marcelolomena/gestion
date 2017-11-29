'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");
var secuencia = require("../../utils/secuencia");

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

  secuencia.getSecuencia(0, function (err, sec) {
    console.log("***Secuencia:"+sec);

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
  var sqlcount = "SELECT count(*) AS count FROM lic.reserva a JOIN lic.producto b ON a.idproducto=b.id "+
  "WHERE a.estado = '"+constants.RECHAZADO+"' OR a.estado='"+constants.ALAESPERA+"'";
  if (filters && condition != "") {
    sqlcount += sqlcount + " AND " + condition + " ";
  }

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + rowspp + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.*, b.nombre, c.first_name+' '+c.last_name AS usuario, d.first_name+' '+d.last_name AS usuariojefe " +
    "FROM lic.reserva a JOIN lic.producto b ON a.idproducto=b.id " +
    "LEFT JOIN art_user c ON a.idusuario = c.uid " +
    "LEFT JOIN art_user d ON a.idusuariojefe = d.uid " +
    "WHERE a.estado = '"+constants.RECHAZADO+"' OR a.estado='"+constants.ALAESPERA+"' ";

  if (filters && condition != "") {
    sql += " AND " + condition + " ";
    logger.debug("**" + sql + "**");
  }
  var sql2 = sql + "ORDER BY a.estado OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
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
  })
}) //end secuencia

}


