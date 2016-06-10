var models = require('../models');
var sequelize = require('../models/index').sequelize;

exports.cuitroya = function (req, res) {
  var idcui = req.params.idsap
  var sql = "select a.cui, a.nombre "+
    "from   sip.estructuracui a "+
    "where  a.cui = "+idcui +" "+
    "union "+
    "select b.cui, b.nombre "+
    "from   sip.estructuracui a,sip.estructuracui b "+
    "where  a.cui = "+idcui +" "+
    "  and  a.cui = b.cuipadre "+
    "union "+
    "select c.cui, c.nombre "+
    "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c "+
    "where  a.cui = "+idcui +" "+
    "  and  a.cui = b.cuipadre "+
    "  and  b.cui = c.cuipadre "+
    "union "+
    "select d.cui, d.nombre "+
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
  var idcui = req.params.idsap
  var sql = "SELECT a.idproveedor, b.razonsocial "+
    "FROM sip.plantillapresupuesto a JOIN sip.proveedor b ON a.idproveedor=b.id "+
    "where  a.cui = "+idcui +
    "GROUP BY a.idproveedor, b.razonsocial "+
    "ORDER BY b.razonsocial ";
    
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getcui = function (req, res) {
  
  console.log("******usr*********:"+req.param.user[0].uid);
  var sql = "SELECT cui FROM sip.estructuracui WHERE uid="+req.param.user[0].uid;
  console.log("query:"+sql);
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
}