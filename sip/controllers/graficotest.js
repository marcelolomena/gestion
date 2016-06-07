var models = require('../models');
var sequelize = require('../models/index').sequelize;

exports.graficoDataOld = function (req, res) {

  var data = '{"titulo":"Erogaciones por SAP","data":[{"name":"Motor Pagos","y":43,"dId":6079},{"name":"Migración Tarjetas","y":96,"dId":6293},{"name":"Renovación Leasing","y":70,"dId":6355},{"name":"Hub Contable","y":43,"dId":6637},{"name":"Control de Margenes","y":13,"dId":6935},{"name":"Camara Compensación","y":38,"dId":6949}],"showInLegend":false}';
  res.json(data);
};


exports.graficoData = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  
 var sql = " SELECT nombre, presupuestopesos "+
 "FROM sip.detalleproyecto "+
 "WHERE idproyecto=237";
    
    sequelize.query(sql)
      .spread(function (proyecto) {
      var data = "{\"titulo\":\"Erogaciones por SAP\",\"data\":[";
      for (var i = 0; i < proyecto.length; i++) {
        var linea = "{\"name\":\""+proyecto[i].nombre+"\",\"y\":"+proyecto[i].presupuestopesos+",\"dId\":6079},"
        console.log(linea);
        data = data + linea;
      }
      data = data.substring(0,data.length-1);
      data = data + "\"],\"showInLegend\":false}";
      console.log(data);
      res.json(JSON.stringify(data));
    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};