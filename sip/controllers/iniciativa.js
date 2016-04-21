// Create endpoint /proveedores for GET
exports.getIniciativasPaginados = function (req, res) {
  // Use the Proveedores model to find all proveedores
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var condition = "";

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
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY razonsocial asc) " +
        "as resultNum, * " +
        "FROM proveedor WHERE " + condition.substring(0, condition.length - 4) + ")" +
        "select id,CAST(numrut AS VARCHAR) + '-' + dvrut numrut,razonsocial from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.Proveedor.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {
      var sql = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY razonsocial asc) " +
        "as resultNum, * " +
        "FROM proveedor )" +
        "select id,CAST(numrut AS VARCHAR) + '-' + dvrut numrut,razonsocial from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.Proveedor.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {
    var sql = "declare @rowsPerPage as bigint; " +
      "declare @pageNum as bigint;" +
      "set @rowsPerPage=" + rows + "; " +
      "set @pageNum=" + page + ";   " +
      "With SQLPaging As   ( " +
      "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY razonsocial asc) " +
      "as resultNum, * " +
      "FROM proveedor )" +
      "select id,CAST(numrut AS VARCHAR) + '-' + dvrut numrut,razonsocial from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    models.Proveedor.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};