var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');


exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      var rut = req.body.numrut.substring(0, req.body.numrut.length - 2);
      var digito = req.body.numrut.substring(req.body.numrut.length - 1, req.body.numrut.length);

      models.Proveedor.create({
        numrut: rut,
        dvrut: digito,
        razonsocial: req.body.razonsocial,
        negociadordivot: req.body.negociadordivot,
        borrado: 1
      }).then(function (proveedor) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
      var rut = req.body.numrut.substring(0, req.body.numrut.length - 2);
      var digito = req.body.numrut.substring(req.body.numrut.length - 1, req.body.numrut.length);
      models.Proveedor.update({
        numrut: rut,
        dvrut: digito,
        razonsocial: req.body.razonsocial,
        negociadordivot: req.body.negociadordivot,
        borrado: 1
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (proveedor) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.Proveedor.destroy({
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

};

exports.combobox = function (req, res) {
  models.Proveedor.findAll({
    order: 'razonsocial'
  }).then(function (proveedores) {
    //iniciativas.forEach(log)
    res.json(proveedores);
  }).catch(function (err) {
    //console.log(err);
    res.json({ error_code: 1 });
  });
}

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "razonsocial";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.Proveedor.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.Proveedor.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (proveedores) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: proveedores });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}