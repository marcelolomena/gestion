var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
exports.action = function (req, res) {
  var action = req.body.oper;
  var fecha;

  if (action != "del") {
    if (req.body.fecha != "")
      fecha = req.body.fecha.split("-").reverse().join("-")
  }

  switch (action) {
    case "add":
      models.iniciativafecha.create({
        idiniciativaprograma: req.body.parent_id,
        tipofecha: req.body.tipofecha,
        fecha: fecha,
        comentario: req.body.comentario,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
    
      break;
    case "edit":
      models.iniciativafecha.update({
        idiniciativaprograma: req.body.parent_id,
        idtipofecha: req.body.idtipofecha,
        fecha: fecha,
        comentario: req.body.comentario
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.iniciativafecha.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
  }
}

// Create endpoint /iniciativaprograma for GET
exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "fecha";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idiniciativaprograma",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.iniciativafecha.count({
        where: data
      }).then(function (records) {
          logger.debug("campos: "+records);
        var total = Math.ceil(records / rows);
        models.iniciativafecha.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (iniciativas) {
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};


exports.actualizaDuracion = function (req, res) {
  var nuevaduracion = 0;
  var fechamenor = new Date (2099,12,30);
  var fechamayor = new Date (1900,01,01);
  var fechaok = false;
  models.iniciativafecha.findAll({
    where: {
      idiniciativaprograma: req.params.id
    }
  }).then(function (iniciativasp) {
          iniciativasp.forEach(function(element) {
            if(element.tipofecha=="Inicio Trabajo Mesa Multidisciplinaria"){
              fechamenor=element.fecha;
              fechaok = true;
            }
            if(element.fecha>fechamayor){
              fechamayor=element.fecha;
            } 
          }, this);
          //logger.debug("fecha menor: "+fechamenor);
          //logger.debug("fecha mayor: "+fechamayor);
          //logger.debug("fecha ok?: "+fechaok);
          if(fechaok){
            var resta = fechamayor.getTime() - fechamenor.getTime(); 
            nuevaduracion = Math.floor(resta / (1000 * 60 * 60 * 24));
            //logger.debug("nueva duracion: "+nuevaduracion);
          }
      }).then(function (records) { 
        models.iniciativaprograma.update({
        duracion: nuevaduracion
      }, {
          where: {
            id: req.params.id
          }
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
})
};