'use strict';
var models = require('../../models');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");
var fs = require('fs');
var path = require('path');

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
        if (item.data != '0') {
          if (item.op === 'cn' || item.op === 'eq')
            if (item.field == 'codautorizacion' ) {
              condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
            } else {
              condition += 'a.' + item.field + "=" + item.data + " AND ";
            }
        }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }
  var sqlcount;
  sqlcount = "SELECT count(*) as count FROM lic.instalacion a where idusuario IS NOT NULL ";

  if (filters && condition != "") {
    sqlcount += " and " + condition + " ";
  }

  var sql;
  sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + rowspp + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.*, b.nombre, c.first_name+' '+ c.last_name AS usuario, d.nombre torre FROM lic.instalacion a JOIN lic.producto b ON a.idproducto=b.id " +
    "JOIN art_user c ON c.uid = a.idusuario " +
    "LEFT JOIN lic.torre d ON a.idtorre = d.id ";
  if (filters && condition != "") {
    sql += " WHERE " + condition + " ";
    logger.debug("**" + sql + "**");
  }
  var sql2 = sql + " ORDER BY a.id desc OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
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

exports.downFile = function (req, res) {

  var file = "Documento1.docx";
  var filePath = "docs"+path.sep+"lic";
  var sql = "SELECT nombrearchivo FROM lic.instalacion WHERE id=" + req.params.id;
  sequelize.query(sql)
    .spread(function (rows) {
      file = rows[0].nombrearchivo;
      console.log("Archivo:" + filePath+ path.sep +file);
      fs.exists(filePath+ path.sep + file, function (exists) {
        if (exists) {
          res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + file
          });
          fs.createReadStream(filePath + path.sep + file).pipe(res);
        } else {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ERROR Archivo no Existe");
        }
      });
    });

};

exports.getProductoInstalacion = function (req, res) {
  var idFabricante = req.params.idFabricante;
  var sql = 'select distinct a.id, a.nombre from lic.producto a ' +
    'join lic.instalacion b on a.id = b.idproducto AND b.idusuario IS NOT NULL';
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });

};

exports.getUsuariosInstalacion = function (req, res) {
  var idFabricante = req.params.idFabricante;
  var sql = "SELECT DISTINCT a.uid, a.first_name +' '+ a.last_name  AS nombre " +
    "FROM art_user a JOIN lic.instalacion b ON a.uid=b.idusuario";
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });

};




