var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}

exports.excel = function (req, res) {
}

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.Contrato.create({
        tipocontrato: req.body.tipocontrato,
        tipodocumento: req.body.tipodocumento,
        solicitudcontrato: req.body.solicitudcontrato,
        idtiposolicitud: req.body.idtiposolicitud,
        tiposolicitud: req.body.tiposolicitud,
        idestadosol: req.body.idestadosol,
        estadosolicitud: req.body.estadosolicitud,
        numero: req.body.numero,
        nombre: req.body.nombre,
        idproveedor: req.body.idproveedor,
        uidpmo: req.body.uidpmo,
        pmoresponsable: req.body.pmoresponsable,
        borrado: 1
      }).then(function (contrato) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.Contrato.update({
        tipocontrato: req.body.tipocontrato,
        tipodocumento: req.body.tipodocumento,
        solicitudcontrato: req.body.solicitudcontrato,
        idtiposolicitud: req.body.idtiposolicitud,
        tiposolicitud: req.body.tiposolicitud,
        idestadosol: req.body.idestadosol,
        estadosolicitud: req.body.estadosolicitud,
        numero: req.body.numero,
        nombre: req.body.nombre,
        idproveedor: req.body.idproveedor,
        uidpmo: req.body.uidpmo,
        pmoresponsable: req.body.pmoresponsable
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
      models.Contrato.destroy({
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

  var orden = "[Contrato]." + sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.Contrato.belongsTo(models.Proveedor, { foreignKey: 'idproveedor' });
      models.Contrato.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.Contrato.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.Proveedor
          }]
        }).then(function (contratos) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};
