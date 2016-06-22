var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.iniciativafecha.create({
        idiniciativaprograma: req.body.parent_id,
        tipofecha: req.body.tipofecha,
        fecha: req.body.fecha,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
    
      break;
    case "edit":
      models.iniciativafecha.update({
        idiniciativaprograma: req.body.parent_id,
        idtipofecha: req.body.idtipofecha,
        fecha: req.body.fecha,
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
      models.iniciativafecha.destroy({
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
      models.presupuestoiniciativa.belongsTo(models.user, { foreignKey: 'uidlider'});
      models.presupuestoiniciativa.count({
        where: data
      }).then(function (records) {
          console.log("campos: "+records);
        var total = Math.ceil(records / rows);

        models.presupuestoiniciativa.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [
            {model: models.user}
            ]
        }).then(function (iniciativas) {
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          console.log('EL ERROR: '+err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};