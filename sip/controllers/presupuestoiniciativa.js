var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
  var action = req.body.oper;

  var porcentaje1, porcentaje2, dolar, uf = 0

  if (action != "del") {
    if (req.body.porcentaje1 != "")
      porcentaje1 = req.body.porcentaje1;//.split(".").join("").replace(",", ".")

    if (req.body.porcentaje2 != "")
      porcentaje2 = req.body.porcentaje2;//.split(".").join("").replace(",", ".")

    if (req.body.dolar != "")
      dolar = req.body.dolar;//.split(".").join("").replace(",", ".")

    if (req.body.uf != "")
      uf = req.body.uf;//.split(".").join("").replace(",", ".")
  }

  switch (action) {
    case "add":
      models.presupuestoiniciativa.create({
        idiniciativaprograma: req.body.parent_id,
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.uidlider,
        uidjefeproyecto: req.body.uidjefeproyecto,
        fechaconversion: req.body.fechaconversion,
        dolar: dolar,
        uf: uf,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.presupuestoiniciativa.update({
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: req.body.porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: req.body.porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.uidlider,
        uidjefeproyecto: req.body.uidjefeproyecto,
        fechaconversion: req.body.fechaconversion,
        dolar: req.body.dolar,
        uf: req.body.uf
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.presupuestoiniciativa.destroy({
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

// Create endpoint /iniciativaprograma for GET
exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "cuifinanciamiento1";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idiniciativaprograma",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.presupuestoiniciativa.belongsTo(models.user, { foreignKey: 'uidlider' });
      models.presupuestoiniciativa.count({
        where: data
      }).then(function (records) {
        console.log("campos: " + records);
        var total = Math.ceil(records / rows);

        models.presupuestoiniciativa.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [
            { model: models.user }
          ]
        }).then(function (iniciativas) {
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          console.log('EL ERROR: ' + err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};