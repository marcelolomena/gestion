var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');


exports.getCuiServicios = function (req, res) {
 var id = req.params.id;
  
  var sql = "SELECT b.id, b.nombre FROM sip.servicio b "+
  "ORDER BY b.nombre";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getCuiProveedores = function (req, res) {
  var id = req.params.id;
  
  var sql = "SELECT b.id, b.razonsocial FROM sip.proveedor b "+
   "ORDER BY b.razonsocial";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};
