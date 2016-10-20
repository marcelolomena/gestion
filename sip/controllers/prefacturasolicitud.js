var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var constants = require("../utils/constants");

exports.getSolicitudAprob = function (req, res) {
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
    "SELECT a.*, b.razonsocial, d.nombre, c.periodo AS periodocompromiso FROM sip.solicitudaprobacion a JOIN sip.proveedor b ON b.id = a.idproveedor " +
    "JOIN sip.detallecompromiso c ON c.id=a.iddetallecompromiso JOIN sip.servicio d ON a.idservicio=d.id " +
    "WHERE a.periodo = " + periodo + " AND a.idcui= " + cui + "  AND idprefactura IS NULL ";
    if (proveedor != "0"){
      sql=sql+"AND idproveedor="+proveedor+" ";
    }    
  var sql2 = sql + "ORDER BY b.razonsocial, a.periodo OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  console.log("query:" + sql2);
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      console.log("***ROWS***:" + rows);
      console.log("***Length***:" + rows.length);
      records = rows.length;
    }).then(function (response) {
      sequelize.query(sql2)
        .spread(function (rows) {
          var total = Math.ceil(records / filas);
          res.json({ records: records, total: total, page: page, rows: rows });
        }).catch(function (err) {
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
      console.log("***ROWS***:" + rows);
      console.log("***Length***:" + rows.length);
      records = rows.length;
    }).then(function (response) {
      sequelize.query(sql2)
        .spread(function (rows) {
          var total = Math.ceil(records / filas);
          res.json({ records: records, total: total, page: page, rows: rows });
        }).catch(function (err) {
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
  console.log("Action:" + action);
  console.log("Id:" + req.body.id);

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
       sequelize.query(sql).then(function (contrato) {
          console.log("Aprobado:" + req.body.aprobado);
          if (req.body.aprobado == 1) {
            console.log("Dentro Aprobado:" + req.body.montoapagar + "," + req.body.montoaprobado);
            if (req.body.montoapagar == req.body.montoaprobado) {
              //deja compromiso en estado pagado
              var sql = "UPDATE sip.detallecompromiso SET estadopago='PAGADO', saldopago=0 " +
                "WHERE id=" + req.body.iddetallecompromiso;
              console.log("query:" + sql);
              sequelize.query(sql)
                .spread(function (rows) {
                  res.json(rows);
                });

            } else {
              //deja compromiso en estado abonado
              var sql = "UPDATE sip.detallecompromiso SET estadopago='ABONADO'," +
                "saldopago=" + req.body.montoapagar + "-" + req.body.montoaprobado + " " +
                "WHERE id=" + req.body.iddetallecompromiso;
              console.log("query:" + sql);
              sequelize.query(sql)
                .spread(function (rows) {
                  res.json(rows);
                });
            }
          } else if (req.body.aprobado == 2) {
            //deja compromiso en estado rechazado
            var sql = "UPDATE sip.detallecompromiso SET estadopago='RECHAZADO' " +
              "WHERE id=" + req.body.iddetallecompromiso;
            console.log("query:" + sql);
            sequelize.query(sql)
              .spread(function (rows) {
                res.json(rows);
              });
          }

          //res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });

      break;
    case "del":
      //nada
      break;

  }
}

exports.cuisprefactura = function (req, res) {
  var rol = req.user[0].rid;
  console.log("******usr*********:" + req.user[0].uid);
  console.log("******rol*********:" + req.user[0].rid);
  console.log("*ROLADM*:" + constants.ROLADMDIVOT);
  var periodo = req.params.periodo
  if (rol == constants.ROLADMDIVOT) {  
    var sql = "SELECT id, nombre, cui FROM sip.estructuracui "+
      "where id IN (SELECT DISTINCT idcui FROM sip.solicitudaprobacion WHERE periodo="+periodo+
      " AND idprefactura is NULL) "+
      "ORDER BY nombre";
    sequelize.query(sql)
      .spread(function (rows) {
        res.json(rows);
      }).catch(function (err) {
        res.json({ error_code: 1 });
      });    
  } else {
    var idcui = req.params.id
    var sql = "select a.id, a.nombre, a.cui "+
      "from   sip.estructuracui a "+
      "where  a.cui = "+idcui +" AND a.id IN (SELECT DISTINCT idcui FROM sip.solicitudaprobacion WHERE periodo="+periodo+"  AND idprefactura is NULL) "+
      "union "+
      "select b.id, b.nombre, b.cui "+
      "from   sip.estructuracui a,sip.estructuracui b "+
      "where  a.cui = "+idcui +" AND a.id IN (SELECT DISTINCT idcui FROM sip.solicitudaprobacion WHERE periodo="+periodo+" AND idprefactura is NULL) "+
      "  and  a.cui = b.cuipadre "+
      "union "+
      "select c.id, c.nombre, c.cui "+
      "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c "+
      "where  a.cui = "+idcui +" AND a.id IN (SELECT DISTINCT idcui FROM sip.solicitudaprobacion WHERE periodo="+periodo+" AND idprefactura is NULL) "+
      "  and  a.cui = b.cuipadre "+
      "  and  b.cui = c.cuipadre "+
      "union "+
      "select d.id, d.nombre, d.cui "+
      "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d "+
      "where  a.cui = "+idcui +" AND a.id IN (SELECT DISTINCT idcui FROM sip.solicitudaprobacion WHERE periodo="+periodo+" AND idprefactura is NULL) "+
      "  and  a.cui = b.cuipadre "+
      "  and  b.cui = c.cuipadre "+
      "  and  c.cui = d.cuipadre ";

    sequelize.query(sql)
      .spread(function (rows) {
        res.json(rows);
      });
  }
};

exports.getProveedores = function (req, res) {
  var cui = req.params.cui
  var periodo = req.params.periodo
  var sql = "SELECT DISTINCT a.idproveedor, b.razonsocial  FROM sip.solicitudaprobacion a JOIN sip.proveedor b ON a.idproveedor=b.id"+
    " WHERE periodo="+ periodo +" AND idcui="+cui;
  console.log("query:"+sql)
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};