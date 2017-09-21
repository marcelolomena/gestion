var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var logger = require("../../utils/logger");

exports.getCuiServicios = function (req, res) {
  var id = req.params.id;

  sequelize.query(
    'select tipocontrato from sic.solicitudcotizacion ' +
    'where id =:id ',
    { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
  ).then(function (tipocontrato) {
    var tipocontra = ''
    var tcontra1 = 'Proyecto'
    var tcontra2 = 'Continuidad'
    tipocontra = tipocontrato[0].tipocontrato;

    if (tipocontra == 1) {
      var sql = "SELECT b.id, b.nombre FROM sip.servicio b " +
        "Where b.borrado = 1 and tiposervicio = 'Continuidad' " +
        "ORDER BY b.nombre";
      sequelize.query(sql)
        .spread(function (rows) {
          return res.json(rows);
        });
    } else {
      var sql = "SELECT b.id, b.nombre FROM sip.servicio b " +
        "Where b.borrado = 1 and tiposervicio = 'Proyecto' " +
        "ORDER BY b.nombre";
      sequelize.query(sql)
        .spread(function (rows) {
          return res.json(rows);
        });
    }
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error: 1 });
  });
};


exports.getCuiProveedores = function (req, res) {
  var idcui = req.params.id;
  var idservicio = req.params.idservicio;

  var sql = "SELECT b.id, b.razonsocial FROM sip.proveedor b " +
    "Where b.id not in (Select a.idproveedor from sip.plantillapresupuesto a where a.idcui=" + idcui + " and a.idservicio =" + idservicio + ") " +
    "ORDER BY b.razonsocial";

  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });

};
