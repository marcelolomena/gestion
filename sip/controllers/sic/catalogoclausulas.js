var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.clase.create({
        nombre: req.body.nombre,
        secuencia: req.body.secuencia,
        borrado: 1
      }).then(function (clase) {
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.clase.update({
        nombre: req.body.nombre,
        secuencia: req.body.secuencia
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (clase) {
          res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.clase.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;

  }
}

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = "[clase]." + sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (data) {
      //logger.debug(data)
      models.clase.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.clase.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (clase) {
          //logger.debug(solicitudcotizacion)
          res.json({ records: records, total: total, page: page, rows: clase });
        }).catch(function (err) {
          logger.error(err.message);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.list2 = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "codigo";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "cid",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      //logger.debug("->>> " + err)
    } else {
      models.plantillaclausula.count({
        where: data
      }).then(function (records) {
          //logger.debug("campos: "+records);
        var total = Math.ceil(records / rows);
        models.plantillaclausula.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (plantillaclausula) {
          res.json({ records: records, total: total, page: page, rows: plantillaclausula });
        }).catch(function (err) {
          //logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.action2 = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.plantillaclausula.create({
        cid: req.body.parent_id,
        codigo: req.body.codigo,
        glosaclausula: req.body.glosaclausula,
        borrado: 1
      }).then(function (plantillaclausula) {
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.plantillaclausula.update({
        codigo: req.body.codigo,
        glosaclausula: req.body.glosaclausula
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantillaclausula) {
          res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.plantillaclausula.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;

  }
}