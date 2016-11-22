var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');


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
      logger.debug("->>> " + err)
    } else {
      models.contrato.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
      models.contrato.belongsTo(models.contactoproveedor, { foreignKey: 'idcontactofacturacion' });
      models.contrato.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.contrato.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
                      model: models.proveedor
                    },{
                      model: models.contactoproveedor
                    }
          ]
        }).then(function (contratos) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};