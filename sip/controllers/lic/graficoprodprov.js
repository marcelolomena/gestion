var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var logger = require("../../utils/logger");
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
      logger.debug("***ROWS***:"+rows);
      logger.debug("***Length***:"+rows.length);
      records=rows.length;  
    }).then(function(response){      
      sequelize.query(sql2)
        .spread(function (rows) {             
      var total=Math.ceil(records / filas);
      res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
      logger.error(err)
          res.json({ error_code: 1 });
    });
  });
}

exports.getGraficoLicencia = function (req, res) {
  var id = req.params.id
  logger.debug("fabricante:"+id);
  
 var sql = "SELECT a.idproducto, b.nombre, sum(isnull(a.valorlicencia,0)) monto FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id "+
 "WHERE b.idfabricante = "+id +" and a.valorlicencia is not null "+
 "GROUP BY a.idproducto, b.nombre;";

console.log("sql:"+sql)
    sequelize.query(sql)
      .spread(function (proyecto) {
      var data = '{"titulo":"Compras Por Fabricante","data":[';
      var total = 0;
      if (proyecto.length > 0) {
        for (var i = 0; i < proyecto.length; i++) {
          var linea = '{"name":"'+proyecto[i].nombre+'","y":'+proyecto[i].monto+',"idprod":'+proyecto[i].idproducto+'},'
          logger.debug(linea);
          data = data + linea;
          total = total + parseInt(proyecto[i].monto);
        }
      } else {
        data = data + '{"name":"SIN DATOS","y":0},';    
      }
      logger.debug("Total:"+total);
      data = data.substring(0,data.length-1);
      data = data + '],"showInLegend":false, "total":'+total+'}';
      //logger.debug(data);
      var obj = JSON.parse(data);
      res.json(obj);
    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};

exports.getGraficoSoporte = function (req, res) {
  var id = req.params.id
  logger.debug("fabricante:"+id);
  
 var sql = "SELECT a.idproducto, b.nombre, sum(isnull(a.valorsoporte,0)) monto FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id "+
 "WHERE b.idfabricante = "+id +" and a.valorlicencia is not null "+
 "GROUP BY a.idproducto, b.nombre;";

console.log("sql:"+sql)
    sequelize.query(sql)
      .spread(function (proyecto) {
      var data = '{"titulo":"Soporte por Proveedor","data":[';
      var total = 0;
      if (proyecto.length > 0) {
        for (var i = 0; i < proyecto.length; i++) {
          var linea = '{"name":"'+proyecto[i].nombre+'","y":'+proyecto[i].monto+',"idprod":'+proyecto[i].idproducto+'},'
          logger.debug(linea);
          data = data + linea;
          total = total + parseInt(proyecto[i].monto);
        }
      } else {
        data = data + '{"name":"SIN DATOS","y":0},';    
      }
      logger.debug("Total:"+total);
      data = data.substring(0,data.length-1);
      data = data + '],"showInLegend":false, "total":'+total+'}';
      logger.debug(data);
      var obj = JSON.parse(data);
      res.json(obj);
    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};

exports.getCompras = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
   

    var sql = "DECLARE @PageSize INT; "+
  "SELECT @PageSize="+filas+"; "+
  "DECLARE @PageNumber INT; "+
  "SELECT @PageNumber="+page+"; "+ 
  //"With SQLPaging As   ( "+
  "SELECT a.id, b.nombre, a.fechacompra, c.razonsocial, a.valorlicencia, a.comprador "+ 
  "FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id "+
  "JOIN sip.proveedor c ON a.idproveedor=c.id "+
  "WHERE a.idproducto="+req.params.id+" ";
  var sql2 = sql + "ORDER BY b.nombre OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;  
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      logger.debug("***ROWS***:"+rows);
      logger.debug("***Length***:"+rows.length);
      records=rows.length;      
    }).then(function(response){      
      sequelize.query(sql2)
        .spread(function (rows) {           
      var total=Math.ceil(records / filas);
      res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
      logger.error(err)
          res.json({ error_code: 1 });
    });
  });
}

exports.getComprasSoporte = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
   

    var sql = "DECLARE @PageSize INT; "+
  "SELECT @PageSize="+filas+"; "+
  "DECLARE @PageNumber INT; "+
  "SELECT @PageNumber="+page+"; "+ 
  //"With SQLPaging As   ( "+
  "SELECT a.id, b.nombre, a.fechacompra, c.razonsocial, a.valorsoporte, a.comprador "+ 
  "FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id "+
  "JOIN sip.proveedor c ON a.idproveedor=c.id "+
  "WHERE a.idproducto="+req.params.id+" ";
  var sql2 = sql + "ORDER BY b.nombre OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;  
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      logger.debug("***ROWS***:"+rows);
      logger.debug("***Length***:"+rows.length);
      records=rows.length;      
    }).then(function(response){      
      sequelize.query(sql2)
        .spread(function (rows) {           
      var total=Math.ceil(records / filas);
      res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
      logger.error(err)
          res.json({ error_code: 1 });
    });
  });
}

exports.getFabricantesConCompras = function (req, res) {
  
    var sql = "SELECT DISTINCT(a.nombre), a.id FROM lic.fabricante a JOIN lic.producto b ON a.id=b.idfabricante "+
     "JOIN lic.compra c ON b.id=c.idproducto";
  
    sequelize.query(sql)
      .spread(function (rows) {
        res.json(rows);
      });
  
  };
  