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
    sidx = "iniciativaprograma.nombre";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;
  
  

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.nuevosproyectos.belongsTo(models.iniciativaprograma, { foreignKey: 'idiniciativaprograma' });
      models.nuevosproyectos.belongsTo(models.moneda, { foreignKey: 'idmoneda' });
      //models.iniciativaprograma.belongsTo(models.nuevosproyectos, { foreignKey: 'idiniciativaprograma' });
      models.iniciativaprograma.belongsTo(models.iniciativa, { foreignKey: 'idiniciativa' });
      models.iniciativa.belongsTo(models.iniciativaprograma, { foreignKey: 'id', through: models.iniciativaprograma});
      //models.iniciativaprograma.belongsTo(models.iniciativa, { foreignKey: 'idiniciativa' });
      models.nuevosproyectos.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.nuevosproyectos.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.iniciativaprograma,
            include: [{ model: models.iniciativa }]
          },{
            model: models.moneda
          }]
        }).then(function (iniciativas) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          console.log(err);
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
      models.nuevosproyectos.create({
        idiniciativaprograma: req.body.idiniciativaprograma,
        idmoneda: req.body.idmoneda,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.nuevosproyectos.update({
        idiniciativaprograma: req.body.idiniciativaprograma,
        idmoneda: req.body.idmoneda
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contrato) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.nuevosproyectos.destroy({
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