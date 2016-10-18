var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var log = function (inst) {
  console.dir(inst.get())
}

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
      console.log("->>> " + err)
    } else {
      models.parametro.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.parametro.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (parametros) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: parametros });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.parametro.create({
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        valor: req.body.valor,
        borrado: 1
      }).then(function (parametro) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.parametro.update({
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        valor: req.body.valor
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (parametro) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.parametro.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          console.log('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;

  }

}

exports.getTipos = function (req, res) {

  var sql = "select distinct tipo from sip.parametro " +
    "where borrado=1 order by tipo";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};