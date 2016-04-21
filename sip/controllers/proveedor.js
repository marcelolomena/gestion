var models = require('../models');
var sequelize = require('../models/index').sequelize;
// Create endpoint /api/proveedores for POST
exports.postProveedores = function (req, res) {
  // Create a new instance of the Proveedor model
  var proveedor = new Proveedor();

  // Set the proveedor properties that came from the POST data
  proveedor.razonsocial = req.body.razonsocial;
  proveedor.numrut = req.body.numrut;
  proveedor.dvrut = req.body.dvrut;

  // Save the proveedor and check for errors
  proveedor.save(function (err) {
    if (err)
      res.send(err);

    res.json({ message: 'Proveedor added!', data: proveedor });
  });
};

// Create endpoint /proveedores for GET
exports.getProveedores = function (req, res) {
  models.Proveedor.findAll().then(function (proveedores) {
    res.json(proveedores);
  }).error(function (err) {
    res.send(err);
  });
};

// Create endpoint /proveedores for GET
exports.getProveedoresPaginados = function (req, res) {
  // Use the Proveedores model to find all proveedores
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var condition = "";

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY razonsocial asc) " +
    "as resultNum, * " +
    "FROM proveedor )" +
    "select id,CAST(numrut AS VARCHAR) + '-' + dvrut numrut,razonsocial from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

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

      models.Proveedor.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.Proveedor.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

// Create endpoint /proveedores/:id for GET
exports.getProveedor = function (req, res) {
  // Use the Proveedor model to find a specific proveedor
  models.Proveedor.find({ where: { 'id': req.params.id } }).then(function (proveedor) {
    res.json(proveedor);
  }).error(function (err) {
    res.send(err);
  });
};

// Create endpoint /proveedores/:id for PUT
exports.putProveedor = function (req, res) {
  // Use the Proveedor model to find a specific proveedor
  models.Proveedor.update({ id: req.params.id }, function (err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message: num + ' updated' });
  });
};

// Create endpoint /proveedores/:id for DELETE
exports.deleteProveedor = function (req, res) {
  // Use the Proveedor model to find a specific proveedor and remove it
  models.Proveedor.remove({ id: req.params.id }, function (err) {
    if (err)
      res.send(err);

    res.json({ message: 'Proveedor removed!' });
  });
};