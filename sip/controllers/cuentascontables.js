var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}
// 
exports.getConceptos = function (req, res) {

    models.conceptospresupuestarios.findAll({ where: { 'borrado': 1 }, order: 'id' }).then(function (conceptos) {
        res.json(conceptos);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

};
exports.list = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "cuentacontable";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, [cuentascontables].[id], [cuentascontables].[cuentacontable], [cuentascontables].[nombrecuenta], "+ 
    " [cuentascontables].[invgasto], [cuentascontables].[idconcepto], [cuentascontables].[cuentaorigen], "+
    " [cuentascontables].[borrado], [conceptospresupuestario].[id] AS [conceptospresupuestario.id], "+
    " case [cuentascontables].[invgasto] when 1 then 'Inversión' when 2 then 'Gasto' else '' End as glosatipo, "+
    " [conceptospresupuestario].[conceptopresupuestario] AS [conceptospresupuestario.conceptopresupuestario], "+
    " [conceptospresupuestario].[glosaconcepto] AS [conceptospresupuestario.glosaconcepto] "+
    " FROM [sip].[cuentascontables] AS [cuentascontables] "+
    " LEFT OUTER JOIN [sip].[conceptospresupuestarios] AS [conceptospresupuestario] ON [cuentascontables].[idconcepto] = [conceptospresupuestario].[id] "+ 
    " where [cuentascontables].borrado = 1 ORDER BY cuentacontable asc) " +
    " select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

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
        "as resultNum, [cuentascontables].[id], [cuentascontables].[cuentacontable], [cuentascontables].[nombrecuenta], "+ 
        " [cuentascontables].[invgasto], [cuentascontables].[idconcepto], [cuentascontables].[cuentaorigen], "+
        " [cuentascontables].[borrado], [conceptospresupuestario].[id] AS [conceptospresupuestario.id], "+
        " case [cuentascontables].[invgasto] when 1 then 'Inversión' when 2 then 'Gasto' else '' End as glosatipo, "+
        " [conceptospresupuestario].[conceptopresupuestario] AS [conceptospresupuestario.conceptopresupuestario], "+
        " [conceptospresupuestario].[glosaconcepto] AS [conceptospresupuestario.glosaconcepto] "+
        " FROM [sip].[cuentascontables] AS [cuentascontables] "+
        " LEFT OUTER JOIN [sip].[conceptospresupuestarios] AS [conceptospresupuestario] ON [cuentascontables].[idconcepto] = [conceptospresupuestario].[id] "+ 
        " WHERE [cuentascontables].borrado = 1 and " + condition.substring(0, condition.length - 4) + " ORDER BY cuentacontable asc) " +
        " select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.cuentascontables.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {

            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.cuentascontables.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.cuentascontables.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
   
    case "add":    
    var concepto = req.body.idconcepto      
    if (concepto == 0) 
    {  concepto = null }
      models.cuentascontables.create({
        idconcepto: concepto,
        cuentacontable: req.body.cuentacontable,
        nombrecuenta: req.body.nombrecuenta,
        cuentaorigen: req.body.cuentaorigen,
        invgasto: req.body.invgasto,
        borrado: 1
      }).then(function (cuentas) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
    var concepto = req.body.idconcepto      
    if (concepto == 0) 
    {  concepto = null }
      models.cuentascontables.update({
        idconcepto: concepto,
        nombrecuenta: req.body.nombrecuenta,
        cuentaorigen: req.body.cuentaorigen,
        invgasto: req.body.invgasto,
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (cuentas) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.cuentascontables.destroy({
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

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  console.log("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 5
   },
   {
      caption: 'cuentacontable',
      type: 'string',
      width: 20
    },
    {
      caption: 'nombrecuenta',
      type: 'string',
      width: 50
    },
    {
      caption: 'glosatipo',
      type: 'string',
      width: 50
    },
    {
      caption: 'cuentaorigen',
      type: 'string',
      width: 50
    },
    {
      caption: 'conceptopresupuestario',
      type: 'string',
      width: 50
    },
    {
      caption: 'glosaconcepto',
      type: 'string',
      width: 50
    }
  ];

  var sql = "SELECT  [cuentascontables].[id], [cuentascontables].[cuentacontable], [cuentascontables].[nombrecuenta], "+    
    " case [cuentascontables].[invgasto] when 1 then 'Inversión' when 2 then 'Gasto' else '' End as glosatipo, "+
    " [cuentascontables].[cuentaorigen],[conceptospresupuestario].[conceptopresupuestario] AS conceptopresupuestario, "+
    " [conceptospresupuestario].[glosaconcepto] AS glosaconcepto"+
    " FROM [sip].[cuentascontables] AS [cuentascontables] "+
    " LEFT OUTER JOIN [sip].[conceptospresupuestarios] AS [conceptospresupuestario] ON [cuentascontables].[idconcepto] = [conceptospresupuestario].[id] "+ 
    " where [cuentascontables].borrado = 1 ORDER BY cuentacontable asc "
  
  sequelize.query(sql)
    .spread(function (cuentas) {
      var arr = []
      for (var i = 0; i < cuentas.length; i++) {

        a = [i + 1, 
          cuentas[i].cuentacontable,
          cuentas[i].nombrecuenta,
          cuentas[i].glosatipo,
          cuentas[i].cuentaorigen,
          cuentas[i].conceptopresupuestario,
          cuentas[i].glosaconcepto
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "cuentascontables.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};