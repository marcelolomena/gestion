var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var constants = require("../utils/constants");

exports.getFacturas = function (req, res) {
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
        if (item.op === 'cn')
          if (item.field == 'razonsocial') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'numero') {
            condition += 'a.' + item.field + "=" + item.data + " AND ";
          } else {
            //nada
          }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }
  sqlcount = "SELECT count(*) AS count FROM sip.factura a JOIN sip.proveedor b ON b.id = a.idproveedor ";
  if (filters && condition != "") {
    sqlcount += "WHERE " + condition + " ";
  }

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + rowspp + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.*, b.razonsocial " +
    "FROM sip.factura a JOIN sip.proveedor b ON b.id = a.idproveedor ";
  if (filters && condition != "") {
    sql += "WHERE " + condition + " ";
    logger.debug("**" + sql + "**");
  }
  var sql2 = sql + "ORDER BY a.numero OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
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

exports.getDetalleFacturas = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var id = req.params.id

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + filas + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.* FROM sip.detallefactura a " +
    "LEFT JOIN sip.prefactura b ON b.id = a.idprefactura " +
    "WHERE a.idfactura=" + id + " ";
  var sql2 = sql + "ORDER BY a.id OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  logger.debug("query:" + sql2);
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      logger.debug("***ROWS***:" + rows);
      logger.debug("***Length***:" + rows.length);
      records = rows.length;
    }).then(function (response) {
      sequelize.query(sql2)
        .spread(function (rows) {
          var total = Math.ceil(records / filas);
          res.json({ records: records, total: total, page: page, rows: rows });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error_code: 1 });
        });
    });
}


exports.getCausalMulta = function (req, res) {
  var sql = "SELECT id, nombre FROM sip.parametro WHERE tipo='causalmulta'";
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getCalificacion = function (req, res) {
  var sql = "SELECT id, nombre FROM sip.parametro WHERE tipo='calificacion'";
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getEstadoSolicitud = function (req, res) {
  var sql = "SELECT valor as id, nombre FROM sip.parametro WHERE tipo='estadosolicitudapr'";
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.action = function (req, res) {
  var action = req.body.oper;
  logger.debug("Action:" + action);
  logger.debug("Id:" + req.body.id);

  switch (action) {
    case "add":
      var sql = "INSERT INTO sip.factura (numero, idproveedor, fecha, subtotal, impuesto, total, borrado) " +
        "VALUES (" + req.body.numero + ", " + req.body.idproveedor + ", '" + req.body.fecha + "', " +
        req.body.subtotal + ", " + req.body.impuesto + ", " + req.body.total + ", 1)";
      console.log("query:" + sql);
      sequelize.query(sql)
        .spread(function (rows) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "edit":
      var sql = "UPDATE sip.factura  SET " +
        "numero = " + req.body.numero + ", " +
        "idproveedor = " + req.body.idproveedor + ", " +
        //"idcui = "+req.body.idcui+", "+
        "fecha = '" + req.body.fecha + "', " +
        "subtotal = " + req.body.subtotal + ", " +
        "impuesto = " + req.body.impuesto + ", " +
        "total = " + req.body.total + " " +
        "WHERE id=" + req.body.id;
      logger.debug("sql:" + sql);
      sequelize.query(sql).then(function (factura) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "del":
      var sql = "delete from sip.detallefactura " +
        "WHERE idfactura=" + req.body.id + "; " +
        "delete from sip.factura " +
        "WHERE id=" + req.body.id;
      logger.debug("sql:" + sql);
      sequelize.query(sql).then(function (factura) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;

  }
}

exports.actionDetalle = function (req, res) {
  var action = req.body.oper;
  var idPre = req.params.id
  logger.debug("Action:" + action);
  logger.debug("Id:" + req.params.id);
  console.log("req.body.idprefactura:" + req.body.idprefactura);
  var idprefact = (req.body.idprefactura > 0) ? req.body.idprefactura : 'NULL';

  switch (action) {
    case "add":
      var sql0 = "select * from sip.detallefactura where idfacturacion=" + req.body.idfacturacion;
      console.log("query0:" + sql0);
      sequelize.query(sql0).spread(function (rows) {
        if (rows.length > 0) {
          res.json({ error_code: 100 });
        } else {
          var sql = "INSERT INTO sip.detallefactura (idfactura, idprefactura, idfacturacion, montoneto, montopesos, cantidad, total, borrado, glosaservicio) " +
            "VALUES (" + idPre + ", " + idprefact + ", '" + req.body.idfacturacion + "', " +
            req.body.montoneto + ", " + req.body.montopesos + ", " + req.body.cantidad + ", " + req.body.total + ", 1,'" + req.body.glosaservicio + "');" +
            "DECLARE @id INT;" +
            "select @id = @@IDENTITY; " +
            "select @id as id;";
          console.log("query:" + sql);
          sequelize.query(sql).spread(function (rows) {
            var id = rows[0].id;
            sql2 = "DECLARE @monto float;" +
              "DECLARE @periodo INT;" +
              "DECLARE @factorrecupera FLOAT;" +
              "SELECT @monto=a.montopesos, @periodo=b.periodo FROM sip.detallefactura a JOIN sip.solicitudaprobacion b ON a.idfacturacion=b.id " +
              "WHERE a.idfacturacion=" + req.body.idfacturacion + ";" +
              "SELECT @factorrecupera=factorrecuperacion FROM sip.factoriva WHERE periodo=@periodo;" +
              "INSERT sip.desgloseitemfactura " +
              "SELECT " + id + ", idcui, idcuentacontable, porcentaje*@monto/100, porcentaje, 1, (porcentaje*@monto/100)*(1 + @factorrecupera*0.19), (porcentaje*@monto/100)*@factorrecupera*0.19 " +
              "FROM sip.desglosecontable WHERE idsolicitud=" + req.body.idfacturacion;
            console.log("query2:" + sql2);
            sequelize.query(sql2).spread(function (rows) {
              //update campo ivacredito en factura
              var sql3 = "DECLARE @monto FLOAT;" +
                "SELECT @monto=sum(proporcional) FROM sip.desgloseitemfactura WHERE iddetallefactura=" + id + ";" +
                "UPDATE sip.detallefactura SET ivacredito=@monto WHERE id=" + id;
                console.log("query3:" + sql3);
              sequelize.query(sql3).spread(function (rows) {
                res.json({ error_code: 0 });
              }).catch(function (err) {
                logger.error(err);
                res.json({ error_code: 1 });
              });
            }).catch(function (err) {
              logger.error(err);
              res.json({ error_code: 1 });
            });
          }).catch(function (err) {
            logger.error(err);
            res.json({ error_code: 1 });
          });
        }
      });
      break;
    case "edit":
      var sql = "UPDATE sip.detallefactura  SET " +
        "idfacturacion = " + req.body.idfacturacion + ", " +
        "montoneto = " + req.body.montoneto + ", " +
        "montopesos = " + req.body.montopesos + ", " +
        "cantidad = " + req.body.cantidad + ", " +
        "total = " + req.body.total + ", " +
        "glosaservicio = '" + req.body.glosaservicio + "' " +
        "WHERE id=" + req.body.id;
      logger.debug("sql:" + sql);
      sequelize.query(sql).then(function (factura) {
        sql2 = "DECLARE @monto float;" +
          "DECLARE @periodo INT;" +
          "DECLARE @factorrecupera FLOAT;" +
          "delete from sip.desgloseitemfactura where iddetallefactura=" + req.body.id + ";" +
          "SELECT @monto=a.montopesos, @periodo=b.periodo FROM sip.detallefactura a JOIN sip.solicitudaprobacion b ON a.idfacturacion=b.id " +
          "WHERE a.idfacturacion=" + req.body.idfacturacion + ";" +
          "SELECT @factorrecupera=factorrecuperacion FROM sip.factoriva WHERE periodo=@periodo;" +
          "INSERT sip.desgloseitemfactura " +
          "SELECT " + req.body.id + ", idcui, idcuentacontable, porcentaje*@monto/100, porcentaje, 1, (porcentaje*@monto/100)*(1 + @factorrecupera*0.19) " +
          "FROM sip.desglosecontable WHERE idsolicitud=" + req.body.idfacturacion;
        sequelize.query(sql2).then(function (factura) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "del":
      var sql = "delete from sip.detallefactura " +
        "WHERE id=" + req.body.id + ";" +
        "delete from sip.desgloseitemfactura where iddetallefactura=" + req.body.id;
      logger.debug("sql:" + sql);
      sequelize.query(sql).then(function (factura) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;

  }
}

exports.getProveedores = function (req, res) {
  var cui = req.params.cui
  var periodo = req.params.periodo
  var sql = "SELECT DISTINCT a.idproveedor as id, b.razonsocial as nombre FROM sip.solicitudaprobacion a JOIN sip.proveedor b ON a.idproveedor=b.id";
  console.log("query:" + sql)
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getSolicitudAprob = function (req, res) {
  var idfacturacion = req.params.id
  var periodo = req.params.periodo
  var sql = "SELECT idprefactura,glosaservicio, round(montoaprobado, 0) AS montoneto, round(montoaprobadopesos,0) AS montoapagarpesos " +
    "from sip.solicitudaprobacion a JOIN sip.factura b ON a.idproveedor=b.idproveedor " +
    "where idfacturacion=" + idfacturacion + " and  b.id =" + req.params.idproveedor;
  console.log("query:" + sql)
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getDesglose = function (req, res) {
  var idfacturacion = req.params.id
  var sql = "SELECT a.*, b.cui, c.cuentacontable, c.nombrecuenta " +
    "FROM sip.desgloseitemfactura a LEFT JOIN sip.estructuracui b ON a.idcui=b.id " +
    "LEFT JOIN sip.cuentascontables c ON a.idcuentacontable=c.id " +
    "WHERE a.iddetallefactura=" + req.params.id;
  console.log("query:" + sql)
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};