var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
// Create endpoint /iniciativas for GET
exports.getErogacionesPaginados = function (req, res) {
  // Use the Iniciativas model to find all iniciativas
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla="iddetalleproyecto="+id;

  if (!sidx)
    sidx = "razonsocial";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
    
  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, * " +
    "FROM sip.erogacionproyecto where iddetalleproyecto="+id+")" +
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
        "as resultNum, * " +
        "FROM sip.erogacionproyecto WHERE iddetalleproyecto="+id+" and " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.erogacionproyecto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.erogacionproyecto.count({ where: [filtrosubgrilla] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.erogacionproyecto.count({ where: [filtrosubgrilla] }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idproyecto="+id;
    
  console.log("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'SAP',
      type: 'number',
      width: 10
    },  
    {
      caption: 'Nombre Proyecto',
      type: 'string',
      width: 30
    },  
    {
      caption: 'Nombre Proveedor',
      type: 'string',
      width: 30
    },
    {
      caption: 'Numero Factura',
      type: 'number',
      width: 15
    },
    {
      caption: 'Fecha GL',
      type: 'string',
      width: 20
    },
    {
      caption: 'Tarea Ajustada',
      type: 'string',
      width: 15
    },
    {
      caption: 'Tarea Original',
      type: 'string',  
      width: 15
    },
    {
      caption: 'Total',
      type: 'number',
      width: 15
    }
  ];

  if (!sidx)
    sidx = "sap";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

    var sql = "SELECT sap, nombre, id, razonsocial, factura,  CONVERT(VARCHAR(10),fechagl, 110) AS fechagl, "+
    "numerotarea, toriginalactual, montosum "+
    "FROM sip.erogacionproyecto WHERE iddetalleproyecto="+id;
    
    //models.Proyecto.findAll().then(function (proyecto) {
    sequelize.query(sql)
      .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1,
          proyecto[i].sap,
          proyecto[i].nombre, 
          proyecto[i].razonsocial,
          proyecto[i].factura,
          proyecto[i].fechagl,
          proyecto[i].numerotarea,
          proyecto[i].toriginalactual,
          proyecto[i].montosum
        ];
        //console.log("compromiso:"+proyecto[i].compromiso)
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "ErogacionesProyectos.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};