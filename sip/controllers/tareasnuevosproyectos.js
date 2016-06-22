var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

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
    sidx = "estructuracui.cui";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;
  
  var additional = [{
        "field": "idpresupuestoiniciativa",
        "op": "eq",
        "data": req.params.id
    }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.tareasnuevosproyectos.belongsTo(models.moneda, { foreignKey: 'idmoneda' });
      models.tareasnuevosproyectos.belongsTo(models.parametro, { foreignKey: 'idtipopago' });
      models.tareasnuevosproyectos.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
      models.tareasnuevosproyectos.belongsTo(models.servicio, { foreignKey: 'idservicio' });
      models.tareasnuevosproyectos.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
      models.tareasnuevosproyectos.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.tareasnuevosproyectos.findAll({
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
      models.tareasnuevosproyectos.create({
        idnuevosproyectos: req.params.idd,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.tareasnuevosproyectos.update({
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor
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
      models.tareasnuevosproyectos.destroy({
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