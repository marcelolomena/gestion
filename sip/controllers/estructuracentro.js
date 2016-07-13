var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "id";

  if (!sord)
    sord = "asc";

  var orden =  sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.estructuracentro.belongsTo(models.user, { foreignKey: 'uidresponsable' });
      models.estructuracentro.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.estructuracentro.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.user
          }]
        }).then(function (centros) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: centros });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};