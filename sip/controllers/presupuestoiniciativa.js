var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
  var action = req.body.oper;

  var porcentaje1, porcentaje2, dolar, uf = 0

  if (action != "del") {
    if (req.body.porcentaje1 != "")
      porcentaje1 = req.body.porcentaje1;//.split(".").join("").replace(",", ".")

    if (req.body.porcentaje2 != "")
      porcentaje2 = req.body.porcentaje2;//.split(".").join("").replace(",", ".")

    if (req.body.dolar != "")
      dolar = req.body.dolar;//.split(".").join("").replace(",", ".")

    if (req.body.uf != "")
      uf = req.body.uf;//.split(".").join("").replace(",", ".")
  }

  switch (action) {
    case "add":
      models.presupuestoiniciativa.create({
        idiniciativaprograma: req.body.parent_id,
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.lider,
        uidjefeproyecto: req.body.jefeproyecto,
        fechaconversion: req.body.uidjefeproyecto,
        dolar: dolar,
        uf: uf,
        glosa: req.body.glosa,
        sap: req.body.sap,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.presupuestoiniciativa.update({
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: req.body.porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: req.body.porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.uidlider,
        uidjefeproyecto: req.body.uidjefeproyecto,
        fechaconversion: req.body.fechaconversion,
        dolar: req.body.dolar,
        glosa: req.body.glosa,
        sap: req.body.sap,
        uf: req.body.uf
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.presupuestoiniciativa.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          console.log('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
  }
}

exports.list = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;  
  var filters = req.query.filters;
  var condition = "";
  var idiniciativaprograma = req.params.id;

  if (!sidx)
    sidx = "id";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe "+
	"FROM [sip].[presupuestoiniciativa] a "+
	   "JOIN [dbo].[art_user] lider  ON a.[uidlider] = lider.[uid] "+ 
	   "JOIN  [dbo].[art_user] jefeproyecto  ON a.uidjefeproyecto = jefeproyecto.[uid] "+
     "WHERE (a.[idiniciativaprograma] = "+idiniciativaprograma+" AND a.[borrado] = 1) " +
    ") " +
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
        "as resultNum, a.*, lider.[first_name]as nombrelider ,lider.[last_name] as apellidolider, jefeproyecto.[first_name] as nombrejefe, jefeproyecto.[last_name] as apellidojefe "+
	"FROM [sip].[presupuestoiniciativa] a "+
	   "JOIN [dbo].[art_user] lider  ON a.[uidlider] = lider.[uid] "+ 
	   "JOIN  [dbo].[art_user] jefeproyecto  ON a.uidjefeproyecto = jefeproyecto.[uid] "+
     "WHERE (a.[idiniciativaprograma] = "+idiniciativaprograma+" AND a.[borrado] = 1) AND " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        
        console.log(sql);

      models.presupuestoiniciativa.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.presupuestoiniciativa.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.presupuestoiniciativa.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};