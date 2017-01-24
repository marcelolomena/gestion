var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
exports.getContactos = function (req, res) {
  //var idContrato = req.params.id
  logger.debug(">>>>>>>>>>>>>>>>>>>>>>> idproveedor [" + req.params.id + "]");
  models.contactoproveedor.findAll({ where: [{ 'borrado': 1 }, { 'idproveedor': req.params.id }], order: 'contacto' }).then(function (contacto) {
    res.json(contacto);
  }).catch(function (err) {
    logger.error(e)
    res.json({ error_code: 1 });
  });
};

exports.action = function (req, res) {
  var action = req.body.oper;
  //parent_id
  switch (action) {
    case "add":
      models.contactoproveedor.create({
        idproveedor: req.body.parent_id,
        contacto: req.body.contacto,
        fono: req.body.fono,
        correo: req.body.correo,
        tipo: req.body.tipo,
        borrado: 1
      }).then(function (contactos) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(e)
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
      models.contactoproveedor.update({
        contacto: req.body.contacto,
        fono: req.body.fono,
        correo: req.body.correo,
        tipo: req.body.tipo,
        borrado: 1
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contactos) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.contactoproveedor.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(e)
        res.json({ error_code: 1 });
      });
      break;
  }

};
exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "contacto";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idproveedor",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.err(err)
    } else {
      models.contactoproveedor.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.contactoproveedor.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (contactos) {
          res.json({ records: records, total: total, page: page, rows: contactos });
        }).catch(function (err) {
          logger.error(e)
          res.json({ error_code: 1 });
        });
      })
    }
  });

}