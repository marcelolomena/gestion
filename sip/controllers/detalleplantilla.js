var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

exports.list = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var id   = req.params.id
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "plantillapresupuesto.id";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  condition = "plantillapresupuesto.idcui =" +id+" AND plantillapresupuesto.borrado = 1 and ";
  
  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, plantillapresupuesto.id, plantillapresupuesto.idcui, plantillapresupuesto.idservicio, plantillapresupuesto.idproveedor, " +
    "estructuracui.cui, estructuracui.nombre as nombrecui ,estructuracui.uid, estructuracui.nombreresponsable, estructuracui.idgerencia, estructuracui.gerencia,estructuracui.nombregerente, " +
    "servicio.nombre,cuentas.cuentacontable+'  '+cuentas.nombrecuenta as cuentacontable,servicio.tarea, " +
    "proveedor.numrut, proveedor.dvrut, proveedor.razonsocial " +
    "FROM sip.plantillapresupuesto plantillapresupuesto " +
    " LEFT OUTER JOIN sip.estructuracui estructuracui ON plantillapresupuesto.idcui = estructuracui.id " +
    " LEFT OUTER JOIN (sip.servicio servicio LEFT OUTER JOIN sip.cuentascontables cuentas ON servicio.idcuenta = cuentas.id) " +
    " ON plantillapresupuesto.idservicio = servicio.id " +
    " LEFT OUTER JOIN sip.proveedor proveedor ON plantillapresupuesto.idproveedor = proveedor.id " +
    " where plantillapresupuesto.idcui = "+id+" AND plantillapresupuesto.borrado = 1 ORDER BY cui asc) " +
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
        "as resultNum, plantillapresupuesto.id, plantillapresupuesto.idcui, plantillapresupuesto.idservicio, plantillapresupuesto.idproveedor, " +
        "estructuracui.cui, estructuracui.nombre as nombrecui ,estructuracui.uid, estructuracui.nombreresponsable, estructuracui.idgerencia, estructuracui.gerencia,estructuracui.nombregerente, " +
        "servicio.nombre, cuentas.cuentacontable+'  '+cuentas.nombrecuenta as cuentacontable,servicio.tarea, " +
        "proveedor.numrut, proveedor.dvrut, proveedor.razonsocial " +
        "FROM sip.plantillapresupuesto plantillapresupuesto " +
        " LEFT OUTER JOIN sip.estructuracui estructuracui ON plantillapresupuesto.idcui = estructuracui.id " +
        " LEFT OUTER JOIN (sip.servicio servicio LEFT OUTER JOIN sip.cuentascontables cuentas ON servicio.idcuenta = cuentas.id) " +
        " ON plantillapresupuesto.idservicio = servicio.id " +
        " LEFT OUTER JOIN sip.proveedor proveedor ON plantillapresupuesto.idproveedor = proveedor.id " +
        "WHERE  plantillapresupuesto.idcui =" +id+" AND plantillapresupuesto.borrado = 1 and " + condition.substring(0, condition.length - 4) + " ORDER BY cui asc) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.plantillapresupuesto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {

            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.plantillapresupuesto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.plantillapresupuesto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};
