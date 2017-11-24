'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "edit":
      //Codigo de update
      var sql="UPDATE lic.reserva SET estado='"+req.body.estado+"', comentarioaprobacion='"+req.body.comentarioaprobacion+"', "+
      "cui="+req.body.cui +", fechaaprobacion=getdate() WHERE id ="+req.body.id;
      console.log("query:"+sql);
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

  var superCui = function (uid, callback) {
    var rol = req.session.passport.sidebar[0].rid;
    console.log("ROLNEGOCIO:"+rol);
    if (rol == constants.JEFELIC) {
      var idcui=0;
      var sql1 = "DECLARE @email VARCHAR(255); " +
        "SELECT @email=email FROM art_user WHERE uid=" + uid + ";" +
        "SELECT cui FROM RecursosHumanos WHERE emailTrab=@email AND periodo=(SELECT max(periodo) FROM RecursosHumanos)";
      logger.debug("query:" + sql1);
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            logger.debug("query:" + rows + ", valor:" + rows[0].cui);
            idcui = rows[0].cui;
          } else {
            idcui = 0; //cui no existente para que no encuentre nada
          }
        }).then(function (servicio) {
          var sql = "DECLARE @idcui INT;" +
            "SET @idcui=" + idcui + ";" +
            "select a.cui " +
            "from   lic.estructuracuibch a " +
            "where  a.cui =  @idcui  " +
            "union " +
            "select b.cui " +
            "from   lic.estructuracuibch a,lic.estructuracuibch b " +
            "where  a.cui =  @idcui  " +
            "  and  a.cui = b.cuipadre " +
            "union " +
            "select c.cui " +
            "from   lic.estructuracuibch a,lic.estructuracuibch b,lic.estructuracuibch c " +
            "where  a.cui =  @idcui  " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "union " +
            "select d.cui " +
            "from   lic.estructuracuibch a,lic.estructuracuibch b,lic.estructuracuibch c,lic.estructuracuibch d " +
            "where  a.cui =  @idcui  " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "  and  c.cui = d.cuipadre";
          sequelize.query(sql)
            .spread(function (rows) {
              var cuis = "";
              logger.debug("En cuis:" + rows);
              for (var i = 0; i < rows.length; i++) {
                //logger.debug("cui:" + rows[i].id);
                cuis = cuis + rows[i].cui + ",";
              }
              //return cuis.substring(0, cuis.length - 1);
              logger.debug("antes call:" + cuis.substring(0, cuis.length - 1));
              callback(cuis.substring(0, cuis.length - 1));
            });
        });
    } else {
      callback("*");
    }
  };

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
    sqlcount += " WHERE " + condition + " ";
  }

  superCui(req.session.passport.user, function (elcui) {//req.user[0].uid
    logger.debug('elcui:' + elcui)
    var rol = req.session.passport.sidebar[0].rid;//req.user[0].rid;
    var sqlok;
    if (rol == constants.JEFELIC) {
      var sql = "DECLARE @PageSize INT; " +
        "SELECT @PageSize=" + rowspp + "; " +
        "DECLARE @PageNumber INT; " +
        "SELECT @PageNumber=" + page + "; " +
        "SELECT a.*, b.nombre "+ 
        "FROM lic.reserva a JOIN lic.producto b ON a.idproducto=b.id "+
        "WHERE cui IN (" + elcui + ") ";

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
      })
    }
  })
}



