var models = require('../models');
var sequelize = require('../models/index').sequelize;

var log = function (inst) {
  console.dir(inst.get())
}
// Create endpoint /contratos for GET

exports.getContratosPaginados = function (req, res) {
  // Use the Contratos model to find all contratos
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

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

      models.Contrato.count().then(function (records) {
        var total = Math.ceil(records / rows);

        models.Contrato.findAll({
          offset: parseInt(page), limit: parseInt(rows),
          order: ['[Contrato].nombre'],
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
          offset: parseInt(page), limit: parseInt(rows), order: ['[Contrato].nombre'],
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
        offset: parseInt(page), limit: parseInt(rows), order: ['[Contrato].nombre'],
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

/*
exports.getContratosPaginados = function (req, res) {
  // Use the Contratos model to find all contratos
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  
  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, c.*,p.razonsocial " +
    "FROM sip.contrato c join sip.proveedor p on c.idproveedor=p.id)" +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

  if (filters) {
    var jsonObj = JSON.parse(filters);

    if (JSON.stringify(jsonObj.rules) != '[]') {

      jsonObj.rules.forEach(function (item) {

        if (item.op === 'cn')
          condition += item.field + " like '%" + item.data + "%' AND"
      });

      var sql = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        "as resultNum, c.*,p.razonsocial " +
        "FROM sip.contrato c join sip.proveedor p on c.idproveedor=p.id WHERE " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.Contrato.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.Contrato.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.Contrato.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};
*/