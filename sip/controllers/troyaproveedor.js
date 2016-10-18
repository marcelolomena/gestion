var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
exports.getGrillaProveedor = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
  var id = req.params.idsap
  
  var sql = "DECLARE @PageSize INT; "+
  "SELECT @PageSize="+filas+"; "+
  "DECLARE @PageNumber INT; "+
  "SELECT @PageNumber="+page+"; "+  
  "SELECT cuiseccion, nombrecentrocosto AS nombrecui, cuentacontable, nombrecuenta, sum(monto) AS monto FROM sip.discoverer "+ 
  "WHERE idproveedor = "+req.params.id+" "+
  "GROUP BY nombrecentrocosto, cuiseccion, cuentacontable, nombrecuenta ";
  var sql2 = sql + "ORDER BY cuiseccion OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
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

exports.getGraficoProveedor = function (req, res) {
  var id = req.params.id
  console.log("proveedor:"+id);
  
 var sql = "SELECT nombrecentrocosto AS name, cuiseccion, sum(monto) AS monto FROM sip.discoverer "+ 
"WHERE idproveedor = "+id+" "+
"GROUP BY nombrecentrocosto, cuiseccion";

    sequelize.query(sql)
      .spread(function (proyecto) {
      var data = '{"titulo":"Línea de Gasto","data":[';
      var total = 0;
      if (proyecto.length > 0) {
        for (var i = 0; i < proyecto.length; i++) {
          var linea = '{"name":"'+proyecto[i].name+'","y":'+proyecto[i].monto+',"idcui":'+proyecto[i].cuiseccion+'},'
          console.log(linea);
          data = data + linea;
          total = total + parseInt(proyecto[i].monto);
        }
      } else {
        data = data + '{"name":"SIN DATOS","y":0,"idcui":"SIN DATOS"},';    
      }
      console.log("Total:"+total);
      data = data.substring(0,data.length-1);
      data = data + '],"showInLegend":false, "total":'+total+'}';
      console.log(data);
      var obj = JSON.parse(data);
      res.json(obj);
    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};

exports.getDetalleFacturas = function (req, res) {
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