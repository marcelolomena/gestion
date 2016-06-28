var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var constants = require("../utils/constants");

var log = function (inst) {
  console.dir(inst.get())
}
// Create endpoint /proyecto for GET
exports.getPresupuestosConfirmados = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "idcui";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  models.presupuesto.count().then(function (records) {
    var total = Math.ceil(records / rows);
        var sqlok;
        sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
        "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.secuencia " +
        "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
        "Where a.estado='Confirmado' "+
        "ORDER BY id desc) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
    });
  })
};

exports.aprueba = function (req, res) {
  console.log("****ids:"+req.params.ids);
  var ids = req.params.ids;
  var ids2 = ids.split(",");
  for (i=0; i<ids2.length; i++){
    sql = "UPDATE sip.presupuesto SET estado='Aprobado' WHERE id="+ids2[i];
    sequelize.query(sql).then(function (response) {
        res.json({ error_code: 0 });
      }).error(function (err) {
        res.json(err);
      });
  }
};