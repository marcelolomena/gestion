var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var logger = require("../utils/logger");
// Create endpoint /proyecto for GET
exports.getProyectosTareas = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idproyecto="+id;

  if (!sidx)
    sidx = "cui";

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
    "FROM sip.detalleproyecto where idproyecto="+id+" and isnull(estado,'') <> 'HISTORICO')" +
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
        "FROM sip.detalleproyecto WHERE " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        
        logger.debug(sql);

      models.detalleproyecto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.detalleproyecto.count({ where: [filtrosubgrilla] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.detalleproyecto.count({ where: [filtrosubgrilla] }).then(function (records) {
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
    
  logger.debug("En getExcel");
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
      caption: 'Nombre',
      type: 'string',
      width: 15
    },    
    {
      caption: 'Numero Tarea',
      type: 'string',
      width: 15
    },
    {
      caption: 'Nombre Tarea',
      type: 'string',
      width: 50
    },
    {
      caption: 'Presupuesto',
      type: 'number',
      width: 20
    },
    {
      caption: 'Compromisos',
      type: 'number',
      width: 20
    },
    {
      caption: 'Real Acumulado',
      type: 'number',  
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

  
    var sql = "SELECT b.sap, b.nombre, a.* FROM sip.detalleproyecto a join sip.proyecto b ON a.idproyecto=b.id where idproyecto="+id;
    
    //models.Proyecto.findAll().then(function (proyecto) {
    sequelize.query(sql)
      .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1,
          proyecto[i].sap,
          proyecto[i].nombre,
          proyecto[i].tarea,
          proyecto[i].nombre,
          (proyecto[i].presupuestopesos=='0')?'0':proyecto[i].presupuestopesos,
          (proyecto[i].compromiso=='0')? '0':proyecto[i].compromiso,
          (proyecto[i].realacumuladopesos=='0')?'0':proyecto[i].realacumuladopesos,
          proyecto[i].saldopesos
        ];
        //logger.debug("compromiso:"+proyecto[i].compromiso)
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "TareasProyecto.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });
  
};