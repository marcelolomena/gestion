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
      models.solicitudcotizacion.create({
        idcui: req.body.idcui,
        idtecnico: req.body.idtecnico,
        tipocontrato: req.body.tipocontrato,
        program_id: req.body.program_id,
        codigoart: req.body.codigoart,
        sap: req.body.sap,
        descripcion: req.body.descripcion,
        codigosolicitud: req.body.codigosolicitud,
        clasificacionsolicitud: req.body.clasificacionsolicitud,
        idnegociador: req.body.idnegociador,
        correonegociador: req.body.correonegociador,
        fononegociador: req.body.fononegociador,
        numerorfp: req.body.numerorfp,
        fechaenviorfp: req.body.fechaenviorfp,
        nombreinterlocutor1: req.body.nombreinterlocutor1,
        correointerlocutor1: req.body.correointerlocutor1,
        fonointerlocutor1: req.body.fonointerlocutor1,
        nombreinterlocutor2: req.body.nombreinterlocutor2,
        correointerlocutor2: req.body.correointerlocutor2,
        fonointerlocutor2: req.body.fonointerlocutor2,
        borrado: 1
      }).then(function (solicitudcotizacion) {
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.solicitudcotizacion.update({
        idcui: req.body.idcui,
        idtecnico: req.body.idtecnico,
        tipocontrato: req.body.tipocontrato,
        program_id: req.body.program_id,
        codigoart: req.body.codigoart,
        sap: req.body.sap,
        descripcion: req.body.descripcion,
        codigosolicitud: req.body.codigosolicitud,
        clasificacionsolicitud: req.body.clasificacionsolicitud,
        idnegociador: req.body.idnegociador,
        correonegociador: req.body.correonegociador,
        fononegociador: req.body.fononegociador,
        numerorfp: req.body.numerorfp,
        fechaenviorfp: req.body.fechaenviorfp,
        nombreinterlocutor1: req.body.nombreinterlocutor1,
        correointerlocutor1: req.body.correointerlocutor1,
        fonointerlocutor1: req.body.fonointerlocutor1,
        nombreinterlocutor2: req.body.nombreinterlocutor2,
        correointerlocutor2: req.body.correointerlocutor2,
        fonointerlocutor2: req.body.fonointerlocutor2
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (solicitudcotizacion) {
          res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.solicitudcotizacion.destroy({
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