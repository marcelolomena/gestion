var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');


exports.getCuiServicios = function (req, res) {
 var id = req.params.id;
  
  var sql = "SELECT b.id, b.nombre FROM sip.plantillapresupuesto a JOIN sip.servicio b ON a.idservicio=b.id "+
  "WHERE a.idcui="+id+" "+
  "GROUP BY b.id, b.nombre  "+
  "ORDER BY b.nombre";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getCuiProveedores = function (req, res) {
  var id = req.params.id;
  
  var sql = "SELECT b.id, b.razonsocial FROM sip.plantillapresupuesto a JOIN sip.proveedor b ON a.idproveedor=b.id "+
  "WHERE  a.idcui="+id+" "+
  "GROUP BY b.id , b.razonsocial  "+
  "ORDER BY b.razonsocial";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};
