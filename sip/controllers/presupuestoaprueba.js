var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var constants = require("../utils/constants");
var logger = require("../utils/logger");
var log = function (inst) {
  console.dir(inst.get())
}
// Create endpoint /proyecto for GET
exports.getPresupuestosConfirmados = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "idcui";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn')
          if (item.field == 'CUI' || item.field == 'nombre' || item.field == 'nombreresponsable') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'estado') {
            condition += "a.estado like '%" + item.data + "%' AND ";
          } else {
            condition += 'c.' + item.field + "=" + item.data + " AND ";
          }
      });
      condition = condition.substring(0, condition.length - 5);
      console.log("***CONDICION:" + condition);
    }
  }
  sqlcount = "Select count(*) AS count FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id JOIN sip.ejercicios c ON c.id=a.idejercicio ";
  if (filters && condition != "") {
    sqlcount += "WHERE " + condition + " ";
  }
  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    var sqlok;
    sqlok = "declare @rowsPerPage as bigint; " +
      "declare @pageNum as bigint;" +
      "set @rowsPerPage=" + rowspp + "; " +
      "set @pageNum=" + page + ";   " +
      "With SQLPaging As   ( " +
      "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY a.estado desc) " +
      "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable, c.ejercicio " +
      "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id " +
      "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
      "Where a.estado='Confirmado' or a.estado='Aprobado' ";
    if (filters && condition != "") {
      console.log("**" + condition + "**");
      sqlok += "AND " + condition + " ";
    }
    sqlok += "ORDER BY a.estado desc) " +
      "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
      
    sequelize.query(sqlok).spread(function (rows) {
      res.json({ records: records, total: total, page: page, rows: rows });
    });
  });
}

  exports.aprueba = function (req, res) {
    console.log("****ids:" + req.params.ids);
    var ids = req.params.ids;
    var ids2 = ids.split(",");
    for (i = 0; i < ids2.length; i++) {
      sql = "UPDATE sip.presupuesto SET estado='Aprobado' WHERE id=" + ids2[i];
      sequelize.query(sql).then(function (response) {
        res.json({ error_code: 0 });
      }).error(function (err) {
        res.json(err);
      });
    }
  };

  exports.desaprueba = function (req, res) {
    console.log("****ids:" + req.params.ids);
    var ids = req.params.ids;
    var ids2 = ids.split(",");
    for (i = 0; i < ids2.length; i++) {
      sql = "UPDATE sip.presupuesto SET estado='Confirmado' WHERE id=" + ids2[i];
      sequelize.query(sql).then(function (response) {
        res.json({ error_code: 0 });
      }).error(function (err) {
        res.json(err);
      });
    }
  };