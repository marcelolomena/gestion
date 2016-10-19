var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.action = function (req, res) {
    logger.debug("lala : " + req);
  var action = req.body.oper;
  var costounitario = 0
  var fechainicio;
  var fechafin;
  logger.debug(action);

  if (action != "del") {
    if (req.body.costounitario != "")
      costounitario = req.body.costounitario.split(".").join("").replace(",", ".")

    if (req.body.fechainicio != "")
      fechainicio = req.body.fechainicio.split("-").reverse().join("-")

    if (req.body.fechafin != "")
      fechafin = req.body.fechafin.split("-").reverse().join("-")
  }
  logger.debug(action);
  switch (action) {
    case "add":
      models.tareaenvuelo.create({
        idpresupuestoenvuelo: req.body.parent_id,
        glosa: req.body.glosa,
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        tarea: req.body.tarea,
        idtipopago: req.body.idtipopago,
        fechainicio: fechainicio,
        fechafin: fechafin,
        reqcontrato: req.body.reqcontrato,
        idmoneda: req.body.idmoneda,
        costounitario: costounitario,
        cantidad: req.body.cantidad,
        coniva: req.body.coniva,
        extension: req.body.extension,
        numerocontrato: req.body.numerocontrato,
        numerosolicitudcontrato: req.body.numerosolicitudcontrato,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.tareaenvuelo.update({
        idpresupuestoenvuelo: req.body.parent_id,
        glosa: req.body.glosa,
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        tarea: req.body.tarea,
        idtipopago: req.body.idtipopago,
        fechainicio: fechainicio,
        fechafin: fechafin,
        reqcontrato: req.body.reqcontrato,
        idmoneda: req.body.idmoneda,
        costounitario: costounitario,
        cantidad: req.body.cantidad,
        coniva: req.body.coniva,
        extension: req.body.extension,
        numerocontrato: req.body.numerocontrato,
        numerosolicitudcontrato: req.body.numerosolicitudcontrato
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contrato) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.tareaenvuelo.destroy({
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

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "estructuracui.cui";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idpresupuestoenvuelo",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.tareaenvuelo.belongsTo(models.moneda, { foreignKey: 'idmoneda' });
      models.tareaenvuelo.belongsTo(models.parametro, { foreignKey: 'idtipopago' });
      models.tareaenvuelo.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
      models.tareaenvuelo.belongsTo(models.servicio, { foreignKey: 'idservicio' });
      models.tareaenvuelo.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
      models.tareaenvuelo.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.tareaenvuelo.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [
            {
              model: models.servicio
            },
            {
              model: models.estructuracui
            },
            {
              model: models.parametro
            },
            {
              model: models.moneda
            },
            {
              model: models.proveedor
            }]
        }).then(function (iniciativas) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};


