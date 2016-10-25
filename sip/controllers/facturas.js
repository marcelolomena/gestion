var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var constants = require("../utils/constants");

exports.getFacturas = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var cui = req.params.cui
  var periodo = req.params.periodo
  var proveedor = req.params.proveedor

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + filas + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.*, b.razonsocial "+ 
    "FROM sip.factura a JOIN sip.proveedor b ON b.id = a.idproveedor ";
  var sql2 = sql + "ORDER BY a.numero OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
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

exports.getDetalleSolicitud = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var id = req.params.idsap


  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + filas + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "With SQLPaging As   ( " +
    "SELECT documento,tipodocumento, razonsocial, min(glosalinea) AS glosalinea, min(fechacontable) AS fechacontable, sum(monto) AS montop FROM sip.discoverer " +
    "WHERE cuiseccion=" + req.query.cui + " AND idproveedor=" + req.query.proveedor + " ";
  sql = sql + "GROUP BY documento,tipodocumento, razonsocial) ";
  sql = sql + "SELECT a.documento,a.tipodocumento, a.razonsocial, a.glosalinea, a.fechacontable, sum(b.monto) AS montototal ";
  sql = sql + "FROM SQLPaging a join sip.discoverer b ON a.documento=b.documento AND b.idproveedor=" + req.query.proveedor + " ";
  sql = sql + "GROUP BY a.documento,a.tipodocumento, a.razonsocial, a.glosalinea, a.fechacontable ";
  sql = sql + "HAVING sum(b.monto)<>0";
  var sql2 = sql + "ORDER BY a.documento OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
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
      //nada
      break;
    case "edit":
      var sql="UPDATE sip.solicitudaprobacion SET "+
      "aprobado="+req.body.aprobado+", montoaprobado="+req.body.montoaprobado+
      ", glosaaprobacion='"+req.body.glosaaprobacion+"', montoaprobadopesos="+parseInt(req.body.montoaprobado)+"*factorconversion"+
      ", montomulta="+req.body.montomulta+", montomultapesos="+parseInt(req.body.montomulta)+"*factorconversion"+
      ", glosamulta='"+req.body.glosamulta+"', idcalificacion="+req.body.idcalificacion+
      ", idcausalmulta="+req.body.idcausalmulta+" "+
      "WHERE id="+req.body.id;
      logger.debug("sql:" + sql);
       sequelize.query(sql).then(function (contrato) {
          logger.debug("Aprobado:" + req.body.aprobado);

          if (req.body.aprobado == 1) {
            logger.debug("Dentro Aprobado:" + req.body.montoapagar + "," + req.body.montoaprobado);
            if (req.body.montoneto == req.body.montoaprobado) {
              //deja compromiso en estado pagado
              var sql = "UPDATE sip.detallecompromiso SET estadopago='PAGADO', saldopago=0 " +
                "WHERE id=" + req.body.iddetallecompromiso;
              logger.debug("query:" + sql);
              sequelize.query(sql)
                .spread(function (rows) {
                  res.json(rows);
                });

            } else {
              //deja compromiso en estado abonado
              var sql = "UPDATE sip.detallecompromiso SET estadopago='ABONADO'," +
                "saldopago=" + req.body.montoneto + "-" + req.body.montoaprobado + " " +
                "WHERE id=" + req.body.iddetallecompromiso;
              logger.debug("query:" + sql);
              sequelize.query(sql)
                .spread(function (rows) {
                  res.json(rows);
                });
            }
          } else if (req.body.aprobado == 2) {
            //deja compromiso en estado rechazado
            var sql = "UPDATE sip.detallecompromiso SET estadopago='RECHAZADO' " +
              "WHERE id=" + req.body.iddetallecompromiso;
            logger.debug("query:" + sql);
            sequelize.query(sql)
              .spread(function (rows) {
                res.json(rows);
              });
          }

          //res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });

      break;
    case "del":
      //nada
      break;

  }
}

exports.getProveedores = function (req, res) {
  var cui = req.params.cui
  var periodo = req.params.periodo
  var sql = "SELECT DISTINCT a.idproveedor, b.razonsocial  FROM sip.solicitudaprobacion a JOIN sip.proveedor b ON a.idproveedor=b.id";
  console.log("query:"+sql)
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};