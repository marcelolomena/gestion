var models = require('../models');
var sequelize = require('../models/index').sequelize;

var log = function (inst) {
  console.dir(inst.get())
}
// Create endpoint /contratos for GET

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.Contrato.create({
        tipocontrato: req.body.tipocontrato,
        tipooc: req.body.tipooc,
        solicitudcontrato: req.body.solicitudcontrato,
        numero: req.body.numero,
        anexo: req.body.anexo,
        nombre: req.body.nombre,
        solicitudcontratoes: req.body.solicitudcontratoes,
        sap: req.body.sap,
        idproveedor: req.body.idproveedor,
        uidpmo: req.body.uidpmo,
        codigoart: req.body.codigoart,
        fechainicontrato: req.body.fechainicontrato,
        fechatercontrato: req.body.fechatercontrato,
        fechacontrol: req.body.fechacontrol,
        meses: req.body.meses,
        estado: req.body.estado,
        plazocontrato: req.body.plazocontrato,
        montototal: req.body.montototal,
        condicionnegociacion: req.body.condicionnegociacion,
        frecuenciafacturacion: req.body.frecuenciafacturacion,
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
        tipooc: req.body.tipooc,
        solicitudcontrato: req.body.solicitudcontrato,
        numero: req.body.numero,
        anexo: req.body.anexo,
        nombre: req.body.nombre,
        solicitudcontratoes: req.body.solicitudcontratoes,
        sap: req.body.sap,
        idproveedor: req.body.idproveedor,
        uidpmo: req.body.uidpmo,
        codigoart: req.body.codigoart,
        fechainicontrato: req.body.fechainicontrato,
        fechatercontrato: req.body.fechatercontrato,
        fechacontrol: req.body.fechacontrol,
        meses: req.body.meses,
        estado: req.body.estado,
        plazocontrato: req.body.plazocontrato,
        montototal: req.body.montototal,
        condicionnegociacion: req.body.condicionnegociacion,
        frecuenciafacturacion: req.body.frecuenciafacturacion,
        borrado: 1
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
  // Use the Contratos model to find all contratos
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

  if (filters) {
    var jsonObj = JSON.parse(filters);

    if (JSON.stringify(jsonObj.rules) != '[]') {

      var condition = [];
      jsonObj.rules.forEach(function (item) {

        if (item.op === 'cn') {
          condition.push(item.field + " like '%" + item.data + "%'");
        }
      });

      models.Contrato.belongsTo(models.Proveedor, { foreignKey: 'idproveedor' });

      models.Contrato.count({ where: condition }).then(function (records) {
        var total = Math.ceil(records / rows);

        models.Contrato.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: condition,
          include: [{
            model: models.Proveedor
          }]
        }).then(function (contratos) {
          //contratos.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });

      })

    } else {

      models.Contrato.belongsTo(models.Proveedor, { foreignKey: 'idproveedor' });

      models.Contrato.count().then(function (records) {
        var total = Math.ceil(records / rows);

        models.Contrato.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          include: [{
            model: models.Proveedor
          }]
        }).then(function (contratos) {
          //contratos.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          console.log(err);
          //res.json({ error_code: 1 });
        });

      })

    }

  } else {

    models.Contrato.belongsTo(models.Proveedor, { foreignKey: 'idproveedor' });

    models.Contrato.count().then(function (records) {
      var total = Math.ceil(records / rows);

      models.Contrato.findAll({
        offset: parseInt(rows * (page - 1)),
        limit: parseInt(rows),
        order: orden,
        include: [{
          model: models.Proveedor
        }]
      }).then(function (contratos) {
        //contratos.forEach(log)
        res.json({ records: records, total: total, page: page, rows: contratos });
      }).catch(function (err) {
        console.log(err);
        //res.json({ error_code: 1 });
      });

    })

  }
};
