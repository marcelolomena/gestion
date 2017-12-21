'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");
var fs = require('fs');

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "edit":
      //Codigo de update
      var sql = "UPDATE lic.instalacion SET estado='" + req.body.estado + "', comentariovisacion='" + req.body.comentariovisacion + "', " +
        " idtorre = "+ req.body.torre  +" WHERE id =" + req.body.id;

      console.log("query:" + sql);
      sequelize.query(sql).then(function (ok) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;
  }
}

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

  var rol = req.session.passport.sidebar[0].rid;//req.user[0].rid;
  console.log("ROL:" + rol);
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
  var sqlcount;
  if (rol == constants.JEFESERVIDOR) {
    sqlcount = "SELECT count(*) as count FROM lic.instalacion a WHERE a.idtipoinstalacion =" + 14
    if (filters && condition != "") {
      sqlcount += " WHERE " + condition + " ";
    }
  } else {
    sqlcount = "SELECT count(*) as count FROM lic.instalacion a WHERE a.idtipoinstalacion =" + 13
    if (filters && condition != "") {
      sqlcount += " WHERE " + condition + " ";
    }
  }

  var sql;
  if (rol == constants.JEFESERVIDOR) {
    sql = "DECLARE @PageSize INT; " +
      "SELECT @PageSize=" + rowspp + "; " +
      "DECLARE @PageNumber INT; " +
      "SELECT @PageNumber=" + page + "; " +
      "SELECT a.*, b.nombre, c.first_name+' '+ c.last_name AS usuario, d.nombre torre FROM lic.instalacion a JOIN lic.producto b ON a.idproducto=b.id " +
      "JOIN art_user c ON c.uid = a.idusuario " +
      "LEFT JOIN lic.torre d ON a.idtorre = d.id " +
      "WHERE a.idtipoinstalacion = " + constants.Servidor
  } else if (rol == constants.JEFEPC) {
    sql = "DECLARE @PageSize INT; " +
      "SELECT @PageSize=" + rowspp + "; " +
      "DECLARE @PageNumber INT; " +
      "SELECT @PageNumber=" + page + "; " +
      "SELECT a.*, b.nombre, c.first_name+' '+ c.last_name AS usuario FROM lic.instalacion a JOIN lic.producto b ON a.idproducto=b.id " +
      "JOIN art_user c ON c.uid = a.idusuario " +
      "WHERE a.idtipoinstalacion = " + constants.PC
  } else {
    logger.error("Sin acceso a funcionalidad");
    return res.json({ error_code: 0 });
  }
  if (filters && condition != "") {
    sql += "AND " + condition + " ";
    logger.debug("**" + sql + "**");
  }
  var sql2 = sql + "ORDER BY a.id desc OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
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

exports.getTorres = function (req, res) {

  var sql = "select id, nombre from lic.torre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.downFile = function (req, res) {

  var file = "Documento1.docx";
  var filePath = "docs\\lic";
  var sql = "SELECT nombrearchivo FROM lic.instalacion WHERE id="+req.params.id;
  sequelize.query(sql)
    .spread(function (rows) {
      file = rows[0].nombrearchivo;
      console.log("Archivo:"+file);
      fs.exists(filePath, function (exists) {
        if (exists) {
          res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + file
          });
          fs.createReadStream(filePath + '\\' + file).pipe(res);
        } else {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ERROR Archivo no Existe");
        }
      }).catch(function (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("ERROR Archivo no Existe");
      });
    });

};




