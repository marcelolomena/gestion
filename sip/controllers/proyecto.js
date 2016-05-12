var models = require('../models');
var sequelize = require('../models/index').sequelize;
// Create endpoint /proyecto for GET
exports.getProyectosPaginados = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var condition = "";

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY nombre asc) " +
    "as resultNum, *, presupuestogasto+presupuestoinversion AS totalpresupuesto, "+
    "compromisogasto+compromisoinversion AS totalcompromiso, "+ 
    "realacumuladogasto+realacumuladoinversion AS totalacumulado,  "+
    "saldogasto+saldoinversion AS totalsaldo, avance*100 AS avance2  " +
    "FROM sip.proyecto ORDER BY sap)" +
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
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY nombre asc) " +
        "as resultNum, *, presupuestogasto+presupuestoinversion AS totalpresupuesto, "+
        "compromisogasto+compromisoinversion AS totalcompromiso, "+ 
        "realacumuladogasto+realacumuladoinversion AS totalacumulado, "+
        "saldogasto+saldoinversion AS totalsaldo, avance*100 AS avance2 " +
        "FROM sip.proyecto WHERE " + condition.substring(0, condition.length - 4) + " ORDER BY sap) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        
        console.log(sql);

      models.Proyecto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.Proyecto.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.Proyecto.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};