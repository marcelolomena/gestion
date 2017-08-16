var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var logger = require("../../utils/logger");

exports.getCuiServicios = function (req, res) {
 var id = req.params.id;
  
  var sql = "SELECT b.id, b.nombre FROM sip.servicio b "+
  "Where b.borrado = 1 " +
  "ORDER BY b.nombre";
      
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });
};

exports.getCuiProveedores = function (req, res) {
  var idcui = req.params.id;
  var idservicio = req.params.idservicio;
  
  var sql = "SELECT b.id, b.razonsocial FROM sip.proveedor b "+
   "Where b.id not in (Select a.idproveedor from sip.plantillapresupuesto a where a.idcui="+idcui+" and a.idservicio ="+idservicio+") "+
   "ORDER BY b.razonsocial";
      
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });

};
