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
    "SELECT a.*, a.montoneto+a.impuesto as totalapagar FROM sip.detallefactura a " +
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
  var montoneto = req.body.montoneto.split(".").join("").replace(",", ".");
  var impuesto = req.body.impuesto.split(".").join("").replace(",", ".");
  var montototal = req.body.montototal.split(".").join("").replace(",", ".");
  
  switch (action) {
    case "add":
      var sql = "INSERT INTO sip.factura (numero, idproveedor, fecha, montoneto, impuesto, montototal, borrado) " +
        "VALUES (" + req.body.numero + ", " + req.body.idproveedor + ", '" + req.body.fecha + "', " +
        montoneto + ", " + impuesto + ", " + montototal + ", 1)";
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
        "montoneto = " + montoneto + ", " +
        "impuesto = " + impuesto + ", " +
        "montototal = " + montototal + " " +
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
  if (req.body.montoneto != ""){
    var montoneto = req.body.montoneto.split(".").join("").replace(",", ".");
  }

  switch (action) {
    case "add":
      var sql0 = "select * from sip.detallefactura where idfacturacion=" + req.body.idfacturacion;
      console.log("query0:" + sql0);
      sequelize.query(sql0).spread(function (rows) {
        if (rows.length > 0) {
          res.json({ error_code: 100 });
        } else {
          var sql = "DECLARE @impuesto FLOAT;DECLARE @montoimpuesto FLOAT;"+
            "SELECT @impuesto=isnull(b.impuesto,0) FROM sip.solicitudaprobacion a JOIN sip.prefactura b ON a.idprefactura=b.id where a.idfacturacion="+req.body.idfacturacion+";"+
            "select @montoimpuesto=0;"+
            "IF (@impuesto <> 0) SELECT @montoimpuesto ="+montoneto+"*0.19;"+
            "INSERT INTO sip.detallefactura (idfactura, idprefactura, idfacturacion, montonetoorigen, montoneto, cantidad, montototal, borrado, glosaservicio, impuesto) " +
            "VALUES (" + idPre + ", " + idprefact + ", '" + req.body.idfacturacion + "', " +
            req.body.montonetopf + ", " + montoneto + ", " + req.body.cantidad + ", " + montoneto + "+@montoimpuesto, 1,'" + req.body.glosaservicio + "', @montoimpuesto);" +
            "DECLARE @id INT;" +
            "select @id = @@IDENTITY; " +
            "select @id as id;";
          console.log("query:" + sql);
          sequelize.query(sql).spread(function (rows) {
            var id = rows[0].id;
            sql2 = "DECLARE @monto float;" +
              "DECLARE @periodo INT;" +
              "DECLARE @factorrecupera FLOAT;" +
              "DECLARE @montoimpuesto float;"+
              "SELECT @monto=a.montoneto, @periodo=b.periodo, @montoimpuesto=a.impuesto FROM sip.detallefactura a JOIN sip.solicitudaprobacion b ON a.idfacturacion=b.id " +
              "WHERE a.idfacturacion=" + req.body.idfacturacion + ";" +
              "SELECT @factorrecupera=factorrecuperacion FROM sip.factoriva WHERE periodo=@periodo;" +
              "INSERT sip.desgloseitemfactura " +
              "SELECT " + id + ", idcui, idcuentacontable, porcentaje, porcentaje*@monto/100, porcentaje*@montoimpuesto/100, "+
              "(porcentaje*@montoimpuesto/100)*@factorrecupera, (porcentaje*@monto/100) + (porcentaje*@montoimpuesto/100)*@factorrecupera, "+
              "(porcentaje*@montoimpuesto/100)*(1-@factorrecupera),@monto*porcentaje/100+@montoimpuesto*porcentaje/100,1 "+
              "FROM sip.desglosecontable WHERE idsolicitud=" + req.body.idfacturacion;           
            console.log("query2:" + sql2);
            sequelize.query(sql2).spread(function (rows) {
              //update campo ivacredito en factura
              var sql3 = "DECLARE @monto1 FLOAT;DECLARE @monto2 FLOAT;DECLARE @monto3 FLOAT;DECLARE @monto4 FLOAT;" +
                "SELECT @monto1=sum(impuesto) FROM sip.desgloseitemfactura WHERE iddetallefactura=" + id + ";" +
                "SELECT @monto2=sum(ivanorecuperable) FROM sip.desgloseitemfactura WHERE iddetallefactura=" + id + ";" +
                "SELECT @monto3=sum(montocosto) FROM sip.desgloseitemfactura WHERE iddetallefactura=" + id + ";" +
                "SELECT @monto4=sum(ivacredito) FROM sip.desgloseitemfactura WHERE iddetallefactura=" + id + ";" +
                "UPDATE sip.detallefactura SET ivanorecuperable=@monto2, impuesto=@monto1, montocosto=@monto3, ivacredito=@monto4 WHERE id=" + id+";"+
                "DECLARE @idfactura INT;"+
                "SELECT @idfactura = idfactura FROM sip.detallefactura WHERE id="+id+";"+
                "UPDATE sip.factura SET ivanorecuperable=isnull(ivanorecuperable,0)+@monto2, montocosto=isnull(montocosto,0)+@monto3, ivacredito=isnull(ivacredito,0)+@monto4 "+
                "where id=@idfactura";                
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
      var sql = "delete from sip.desgloseitemfactura where iddetallefactura=" + req.body.id+";"+
        "DECLARE @monto1 FLOAT;DECLARE @monto2 FLOAT;DECLARE @monto3 FLOAT;DECLARE @idfactura INT; "+
        "SELECT @monto1=ivanorecuperable,@monto2=montocosto,@monto3=ivacredito FROM sip.detallefactura WHERE id="+req.body.id+"; "+
        "SELECT @idfactura=idfactura FROM sip.detallefactura WHERE id="+req.body.id+";"+
        "UPDATE sip.factura SET ivanorecuperable=isnull(ivanorecuperable,0)-@monto1, "+
        "montocosto=isnull(montocosto,0)-@monto2, ivacredito=isnull(ivacredito,0)-@monto3 "+
        "WHERE id=@idfactura;"+
        "delete from sip.detallefactura WHERE id=" + req.body.id + ";";

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
  var sql = "SELECT idprefactura,glosaservicio, montoaprobado-montomulta AS montoneto, round(montototalpesos,0) AS montoapagarpesos, " +
    "a.factorconversion "+
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

exports.getResumenContable = function (req, res) {
  logger.debug("****idfactura:" + req.params.id);
  var total=0;
  var page=1;
  sql = "DECLARE @vacio VARCHAR(10);" +
    "SELECT @vacio=' ';" +
    "WITH query AS (" +
    "SELECT convert(varchar,d.cui) AS cui,e.nombrecuenta, e.cuentacontable, a.montoneto, a.ivanorecuperable, a.montocosto,@vacio AS haber FROM sip.desgloseitemfactura a JOIN sip.detallefactura b ON a.iddetallefactura=b.id " +
    "JOIN sip.factura c ON b.idfactura=c.id JOIN sip.estructuracui d ON a.idcui=d.id " +
    "JOIN sip.cuentascontables e ON e.id=a.idcuentacontable " +
    "WHERE c.id=" + req.params.id + " " +
    "UNION " +
    "SELECT @vacio,'IVA Credito', @vacio, @vacio, @vacio, ivacredito, @vacio AS haber FROM sip.factura WHERE id=" + req.params.id + " " +
    "UNION " +
    "SELECT @vacio,'Proveedores por Pagar', @vacio, @vacio, @vacio, @vacio, montototal AS haber FROM sip.factura WHERE id=" + req.params.id + " " +
    ") SELECT * FROM query ORDER BY cui desc";
  console.log(sql);
  sequelize.query(sql).spread(function (rows) {
      var records=rows.length;
      var total=rows.length;
      res.json({ records: records, total: total, page: page, rows: rows });
  }).catch(function (err) {
    logger.error(err)
    res.json(err);
  });

};