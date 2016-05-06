var models = require('../models');
var sequelize = require('../models/index').sequelize;


exports.postIniciativa = function (req, res) {
  // Save the iniciativa and check for errors

  models.Iniciativa.create({
    codigoart: req.body.codigoart,
    nombreproyecto = req.body.nombreproyecto,
    iddivision = req.body.iddivision,
    divisionsponsor = req.body.divisionsponsor,
    uidsponsor1 = req.body.uidsponsor1,
    sponsor1 = req.body.sponsor1,
    uidsponsor2 = req.body.uidsponsor2,
    sponsor2 = req.body.sponsor2,
    uidgerente = req.body.uidgerente,
    gerenteresponsable = req.body.gerenteresponsable,
    idpmo = req.body.idpmo,
    pmoresponsable = req.body.pmoresponsable,
    idtipo = req.body.idtipo,
    tipo = req.body.tipo,
    idcategoria = req.body.idcategoria,
    categoria = req.body.categoria,
    ano = req.body.ano,
    anoq = req.body.anoq,
    q1 = req.body.q1,
    q2 = req.body.q2,
    q3 = req.body.q3,
    q4 = req.body.q4,
    fechacomite = req.body.fechacomite,
    pptoestimadousd = req.body.pptoestimadousd
  }).then(function (iniciativa) {
    res.json({ message: 'Iniciativa added!', data: iniciativa });
  });

};

// Create endpoint /iniciativas for GET
exports.getIniciativasPaginados = function (req, res) {
  // Use the Iniciativas model to find all iniciativas
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var condition = "";

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY nombreproyecto asc) " +
    "as resultNum, * " +
    "FROM iniciativa )" +
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
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY nombreproyecto asc) " +
        "as resultNum, * " +
        "FROM iniciativa WHERE " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.Iniciativa.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.Iniciativa.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.Iniciativa.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};