var models = require('../models');
var sequelize = require('../models/index').sequelize;


exports.postIniciativa = function (req, res) {
  // Create a new instance of the Iniciativa model
  var iniciativa = new models.Iniciativa();

  iniciativa.codigoart = req.body.codigoart;
  iniciativa.nombreproyecto = req.body.nombreproyecto;
  iniciativa.iddivision = req.body.iddivision;
  iniciativa.divisionsponsor = req.body.divisionsponsor;
  iniciativa.uidsponsor1 = req.body.uidsponsor1;
  iniciativa.sponsor1 = req.body.sponsor1;
  iniciativa.uidsponsor2 = req.body.uidsponsor2;
  iniciativa.sponsor2 = req.body.sponsor2;
  iniciativa.uidgerente = req.body.uidgerente;
  iniciativa.gerenteresponsable = req.body.gerenteresponsable;
  iniciativa.idpmo = req.body.idpmo;
  iniciativa.pmoresponsable = req.body.pmoresponsable;
  iniciativa.idtipo = req.body.idtipo;
  iniciativa.tipo = req.body.tipo;
  iniciativa.idcategoria = req.body.idcategoria;
  iniciativa.categoria = req.body.categoria;
  iniciativa.ano = req.body.ano;
  iniciativa.anoq = req.body.anoq;
  iniciativa.q1 = req.body.q1;
  iniciativa.q2 = req.body.q2;
  iniciativa.q3 = req.body.q3;
  iniciativa.q4 = req.body.q4;
  iniciativa.fechacomite = req.body.fechacomite;
  iniciativa.pptoestimadousd = req.body.pptoestimadousd;

  // Save the iniciativa and check for errors
  models.Iniciativa.save(function (err) {
    if (err)
      res.send(err);

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