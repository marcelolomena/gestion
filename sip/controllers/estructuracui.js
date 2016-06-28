var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

exports.getEstructuraCui = function (req, res) {
  var idcui = req.params.id;
  
  var sql = "SELECT b.id, b.razonsocial FROM sip.proveedor b "+
   "Where b.id not in (Select a.idproveedor from sip.plantillapresupuesto a where a.idcui="+idcui+" and a.idservicio ="+idservicio+") "
   "ORDER BY b.razonsocial";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.cabecera = function (req, res) {
    var id = req.params.id;
    
  var sql = "SELECT  id,nombre,iddivision,e.division,first_name+' '+last_name as responsable  FROM sip.estructuracentro e, " +
  "dbo.art_user u Where e.id ="+id+" and e.uidresponsable = u.uid ";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.responsables = function (req, res) {
  
  var sql = "SELECT  uid as id, first_name+' '+last_name as nombre FROM dbo.art_user "+
  "ORDER BY first_name+' '+last_name";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};