var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "tipo";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.valores.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.valores.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (valores) {
          res.json({ records: records, total: total, page: page, rows: valores });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}

exports.action = function (req, res) {
  var action = req.body.oper;
  var valor = req.body.valor;
 
  if (valor == '') {valor = null}

  switch (action) {
    case "add":
      models.valores.create({
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        valor: valor,
        borrado: 1
      }).then(function (valores) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.valores.update({
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        valor: valor
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (valores) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.valores.destroy({
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

exports.getTipos = function (req, res) {

  var sql = "select distinct tipo from sic.valores " +
    "where borrado=1 order by tipo";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};