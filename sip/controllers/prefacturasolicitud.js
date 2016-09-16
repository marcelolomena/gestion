var models = require('../models');
var sequelize = require('../models/index').sequelize;

exports.getSolicitudAprob = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
  var cui = req.params.cui
  var periodo = req.params.periodo
  
  var sql = "DECLARE @PageSize INT; "+
  "SELECT @PageSize="+filas+"; "+
  "DECLARE @PageNumber INT; "+
  "SELECT @PageNumber="+page+"; "+  
  "SELECT a.*, b.razonsocial, c.periodo AS periodocompromiso FROM sip.solicitudaprobacion a JOIN sip.proveedor b ON b.id = a.idproveedor "+ 
  "JOIN sip.detallecompromiso c ON c.id=a.iddetallecompromiso "+
  "WHERE a.periodo = "+periodo+" AND a.idcui= "+cui+" ";
  var sql2 = sql + "ORDER BY b.razonsocial, a.periodo OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  console.log("query:"+sql2);
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      console.log("***ROWS***:"+rows);
      console.log("***Length***:"+rows.length);
      records=rows.length;  
    }).then(function(response){      
      sequelize.query(sql2)
        .spread(function (rows) {             
      var total=Math.ceil(records / filas);
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
   

    var sql = "DECLARE @PageSize INT; "+
  "SELECT @PageSize="+filas+"; "+
  "DECLARE @PageNumber INT; "+
  "SELECT @PageNumber="+page+"; "+ 
  "With SQLPaging As   ( "+
  "SELECT documento,tipodocumento, razonsocial, min(glosalinea) AS glosalinea, min(fechacontable) AS fechacontable, sum(monto) AS montop FROM sip.discoverer "+
  "WHERE cuiseccion="+req.query.cui+" AND idproveedor="+req.query.proveedor+" ";
  sql = sql + "GROUP BY documento,tipodocumento, razonsocial) ";
  sql = sql + "SELECT a.documento,a.tipodocumento, a.razonsocial, a.glosalinea, a.fechacontable, sum(b.monto) AS montototal ";
  sql = sql + "FROM SQLPaging a join sip.discoverer b ON a.documento=b.documento AND b.idproveedor="+req.query.proveedor+" ";
  sql = sql + "GROUP BY a.documento,a.tipodocumento, a.razonsocial, a.glosalinea, a.fechacontable ";
  sql = sql + "HAVING sum(b.monto)<>0";
  var sql2 = sql + "ORDER BY a.documento OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;  
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      console.log("***ROWS***:"+rows);
      console.log("***Length***:"+rows.length);
      records=rows.length;      
    }).then(function(response){      
      sequelize.query(sql2)
        .spread(function (rows) {           
      var total=Math.ceil(records / filas);
      res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
          res.json({ error_code: 1 });
    });
  });
}