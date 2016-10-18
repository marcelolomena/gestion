var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
exports.graficoDataOld = function (req, res) {

  var data = '{"titulo":"Erogaciones por SAP","data":[{"name":"Motor Pagos","y":43,"dId":6079},{"name":"Migración Tarjetas","y":96,"dId":6293},{"name":"Renovación Leasing","y":70,"dId":6355},{"name":"Hub Contable","y":43,"dId":6637},{"name":"Control de Margenes","y":13,"dId":6935},{"name":"Camara Compensación","y":38,"dId":6949}],"showInLegend":false}';
  res.json(data);
};


exports.graficoDataPres = function (req, res) {
  var id = req.params.idsap
  console.log("sap:"+id);
  
 var sql = " SELECT nombre, presupuestopesos as monto, id "+
 "FROM sip.detalleproyecto "+
 "WHERE idproyecto="+id;
    
    sequelize.query(sql)
      .spread(function (proyecto) {
      var data = '{"titulo":"Erogaciones por SAP","data":[';
      for (var i = 0; i < proyecto.length; i++) {
        var linea = '{"name":"'+proyecto[i].nombre+'","y":'+proyecto[i].monto+',"dId":'+proyecto[i].id+'},'
        console.log(linea);
        data = data + linea;
      }
      data = data.substring(0,data.length-1);
      data = data + '],"showInLegend":false}';
      console.log(data);
      var obj = JSON.parse(data);
      res.json(obj);
    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};

exports.graficoDataReal = function (req, res) {
  var id = req.params.idsap
  console.log("sap:"+id);
  
 var sql = " SELECT nombre, realacumuladopesos as monto, id "+
 "FROM sip.detalleproyecto "+
 "WHERE idproyecto="+id;
    
    sequelize.query(sql)
      .spread(function (proyecto) {
      var data = '{"titulo":"REAL Erogaciones por SAP","data":[';
      for (var i = 0; i < proyecto.length; i++) {
        var linea = '{"name":"'+proyecto[i].nombre+'","y":'+proyecto[i].monto+',"dId":'+proyecto[i].id+'},'
        console.log(linea);
        data = data + linea;
      }
      data = data.substring(0,data.length-1);
      data = data + '],"showInLegend":false}';
      console.log(data);
      var obj = JSON.parse(data);
      res.json(obj);
    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};

exports.sapgrafico = function (req, res) {
  
  console.log("--------------------->>" + req.user[0].uid)
    models.proyecto.findAll({
        attributes: ['id', 'sap', 'nombre']
    }).then(function (proyecto) {
        //console.dir(proyecto)
        //res.json({ resultado: proyecto, uid: req.user[0].uid });
        res.json(proyecto);
    }).catch(function (err) {
        //console.log(err);
        res.json({ error_code: 1 });
    });
}