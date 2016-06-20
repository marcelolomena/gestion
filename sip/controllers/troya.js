var models = require('../models');
var sequelize = require('../models/index').sequelize;

exports.cuitroya = function (req, res) {
  var idcui = req.params.id
  var sql = "select a.id, a.nombre "+
    "from   sip.estructuracui a "+
    "where  a.cui = "+idcui +" "+
    "union "+
    "select b.id, b.nombre "+
    "from   sip.estructuracui a,sip.estructuracui b "+
    "where  a.cui = "+idcui +" "+
    "  and  a.cui = b.cuipadre "+
    "union "+
    "select c.id, c.nombre "+
    "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c "+
    "where  a.cui = "+idcui +" "+
    "  and  a.cui = b.cuipadre "+
    "  and  b.cui = c.cuipadre "+
    "union "+
    "select d.id, d.nombre "+
    "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d "+
    "where  a.cui = "+idcui +" "+
    "  and  a.cui = b.cuipadre "+
    "  and  b.cui = c.cuipadre "+
    "  and  c.cui = d.cuipadre ";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.proveedorcui = function (req, res) {
  var idcui = req.params.id
  var sql = "SELECT a.idproveedor, b.razonsocial "+
    "FROM sip.plantillapresupuesto a JOIN sip.proveedor b ON a.idproveedor=b.id "+
    "where  a.idcui = "+idcui +" "+
    "GROUP BY a.idproveedor, b.razonsocial "+
    "ORDER BY b.razonsocial ";
    
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getcui = function (req, res) {
console.log('user:'+req.user[0].nombre);  
  console.log("******usr*********:"+req.user[0].uid);
  var sql = "SELECT cui FROM sip.estructuracui WHERE uid="+req.user[0].uid;
  console.log("query:"+sql);
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
}

exports.getfacturas = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
  var id = req.params.idsap
  
  var sql = "DECLARE @cui INT; "+
  "SELECT @cui=cui FROM sip.estructuracui WHERE id="+req.query.cui+"; "
  
  sql = sql +"With SQLPaging As   ( "+
  "SELECT documento,tipodocumento, razonsocial, min(glosalinea) AS glosalinea, min(fechacontable) AS fechacontable, sum(monto) AS montop FROM sip.discoverer "+
  "WHERE cuiseccion=@cui AND idproveedor="+req.query.proveedor+" ";
  if (req.query.factura != "") {
    sql = sql +"AND documento="+req.query.factura+" ";
  }
  if (req.query.fechaini != "") {
    sql = sql +"AND fechacontable >= convert(datetime, '"+req.query.fechaini+"', 103) ";
    sql = sql +"AND fechacontable <= convert(datetime, '"+req.query.fechafin+"', 103) ";
  }
  sql = sql + "GROUP BY documento,tipodocumento, razonsocial) ";
  sql = sql + "SELECT a.documento,a.tipodocumento, a.razonsocial, a.glosalinea, a.fechacontable, sum(b.monto) AS montototal FROM SQLPaging a join sip.discoverer b ON a.documento=b.documento ";
  sql = sql + "GROUP BY a.documento,a.tipodocumento, a.razonsocial, a.glosalinea, a.fechacontable ";
  sql = sql + "HAVING sum(b.monto)>0";//OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY
  sequelize.query(sql)
    .spread(function (rows) {
      //res.json(rows);
      console.log("***ROWS***:"+rows);
      console.log("***Length***:"+rows.length);
      var records=rows.length;      
      var total=Math.ceil(records / filas);
      res.json({ records: records, total: total, page: page, rows: rows });
    });
}

exports.getDetalle = function (req, res) {
  var id = req.params.id
  
  var sql = "With SQLPaging As   (  "+ 
    "SELECT cuiseccion, nombrecentrocosto, cuentacontable, nombrecuentaorigen, min(id) AS id, sum(monto) as monto "+
    "FROM sip.discoverer "+
    "WHERE documento='"+id+"' "+
    "GROUP BY cuiseccion, nombrecentrocosto, cuentacontable, nombrecuentaorigen) "+
    "SELECT * FROM SQLPaging "+ 
    "WHERE monto > 0";
  
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
}