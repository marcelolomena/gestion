var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var logger = require("../utils/logger");
// Create endpoint /proyecto for GET
exports.getProyectosPaginados = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "sap";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, *, isnull(presupuestogasto,0)+isnull(presupuestoinversion,0) AS totalpresupuesto, " +
    "isnull(compromisogasto,0)+isnull(compromisoinversion,0) AS totalcompromiso, " +
    "isnull(realacumuladogasto,0)+isnull(realacumuladoinversion,0) AS totalacumulado,  " +
    "isnull(saldogasto,0)+isnull(saldoinversion,0) AS totalsaldo, avance*100 AS avance2  " +
    "FROM sip.proyecto)" +
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
        "as resultNum, *, isnull(presupuestogasto,0)+isnull(presupuestoinversion,0) AS totalpresupuesto, " +
        "isnull(compromisogasto,0)+isnull(compromisoinversion,0) AS totalcompromiso, " +
        "isnull(realacumuladogasto,0)+isnull(realacumuladoinversion,0) AS totalacumulado,  " +
        "isnull(saldogasto,0)+isnull(saldoinversion,0) AS totalsaldo, avance*100 AS avance2 " +
        "FROM sip.proyecto WHERE " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      logger.debug(sql);

      models.proyecto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.proyecto.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.proyecto.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

exports.lastdateLoad = function (req, res) {

  models.detallecargas.findAll({
    limit: 1,
    attributes: ['fechaarchivo'],
    order: 'fechaarchivo DESC',
    where: { idlogcargas: 5 }
  }).then(function (detallecargas) {
    console.dir(detallecargas)
    return res.json({ date: detallecargas[0].fechaarchivo });
  }).catch(function (err) {
    logger.error(err);
    //res.json({ error_code: 1 });
  });

}

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  logger.debug("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
  {
    caption: 'Numero Proyecto',
    type: 'number',
    width: 15
  },
  {
    caption: 'Nombre Proyecto',
    type: 'string',
    width: 50
  },
  {
    caption: 'Categoria_2',
    type: 'string',
    width: 20
  },
  {
    caption: 'PMO',
    type: 'string',
    width: 20
  },
  {
    caption: 'Fecha Creación',
    type: 'string',
    width: 15
  },
  {
    caption: 'Estado2',
    type: 'string',
    width: 15
  },
  {
    caption: 'Fecha Vigencia',
    type: 'string',
    width: 15
  },
  {
    caption: 'Avance %',
    type: 'number',
    width: 15
  },
  {
    caption: 'Ultimo Pago',
    type: 'string',
    width: 15
  },
  {
    caption: 'Paso Producción Comprometido',
    type: 'string',
    width: 15
  },
  {
    caption: 'Cep',
    type: 'number',
    width: 15
  },
  {
    caption: 'Acoplado',
    type: 'number',
    width: 15
  },
  {
    caption: 'Presupuesto Gasto',
    type: 'number',
    width: 15
  },
  {
    caption: 'Presupuesto Inversion',
    type: 'number',
    width: 15
  },
  {
    caption: 'Compromiso Gasto',
    type: 'number',
    width: 15
  },
  {
    caption: 'Compromiso Inversion',
    type: 'number',
    width: 15
  },
  {
    caption: 'Real Gasto',
    type: 'number',
    width: 15
  },
  {
    caption: 'Real Inversion',
    type: 'number',
    width: 15
  },
  {
    caption: 'Saldo2 Gastoo',
    type: 'number',
    width: 15
  },
  {
    caption: 'Saldo2 Inversión',
    type: 'number',
    width: 15
  },
  {
    caption: 'Total Presupuesto',
    type: 'number',
    width: 15
  },
  {
    caption: 'Total Compromiso',
    type: 'number',
    width: 15
  },
  {
    caption: 'Total Acumulado',
    type: 'number',
    width: 15
  },
  {
    caption: 'Total Saldo',
    type: 'number',
    width: 15
  }
  ];

  if (!sidx)
    sidx = "sap";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql = "SELECT id, sap, nombre, numerotarea, nombretarea, presupuestooriginal, presupuestoactual, estado, tipoproyecto,  " +
    "presupuestogasto, presupuestoinversion, compromisogasto, compromisoinversion, realacumuladogasto,  " +
    "realacumuladoinversion, realperiodo, saldogasto, saldoinversion, wbslevel, CONVERT(VARCHAR(10),fechacreacion,110) AS fechacreacion, " +
    "CONVERT(VARCHAR(10),fechainicio,110) AS fechainicio, CONVERT(VARCHAR(10),fechacierre,110) AS fechacierre, cui, saldo2gasto,  " +
    "saldo2inversion, avance, llave, tareanum, creacion, tarea, categoria2,  " +
    "CONVERT(VARCHAR(10),primerpago,110) AS primerpago, CONVERT(VARCHAR(10),ultimopago,110) AS ultimopago, estado2,  " +
    "CONVERT(VARCHAR(10),fechavigencia,110) AS fechavigencia, contabgasto, cep, acoplado, gtodiferido, divotabiertos,  " +
    "CONVERT(VARCHAR(10),papcomprometido,110) AS papcomprometido, abierto, pmo, borrado, " +
    "isnull(presupuestogasto,0)+isnull(presupuestoinversion,0) AS totalpresupuesto, " +
    "isnull(compromisogasto,0)+isnull(compromisoinversion,0) AS totalcompromiso,  " +
    "isnull(realacumuladogasto,0)+isnull(realacumuladoinversion,0) AS totalacumulado,   " +
    "isnull(saldogasto,0)+isnull(saldoinversion,0) AS totalsaldo, avance*100 AS avance2   " +
    "FROM sip.proyecto ";

  //models.Proyecto.findAll().then(function (proyecto) {
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].sap,
        proyecto[i].nombre,
        proyecto[i].categoria2,
        proyecto[i].pmo,
        proyecto[i].fechacreacion,
        proyecto[i].estado,
        proyecto[i].fechavigencia,
        proyecto[i].avance2,
        proyecto[i].ultimopago,
        proyecto[i].papcomprometido,
        proyecto[i].cep,
        proyecto[i].acoplado,
        proyecto[i].presupuestogasto,
        proyecto[i].presupuestoinversion,
        proyecto[i].compromisogasto,
        proyecto[i].compromisoinversion,
        proyecto[i].realacumuladogasto,
        proyecto[i].realacumuladoinversion,
        proyecto[i].saldo2gasto,
        proyecto[i].saldo2inversion,
        proyecto[i].totalpresupuesto,
        proyecto[i].totalcompromiso,
        proyecto[i].totalacumulado,
        proyecto[i].totalsaldo
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "Proyectos.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};

exports.getUsersByRol = function (req, res) {
  //logger.debug(req.query.rol);
  logger.debug(req.params.rol);

  models.user.belongsToMany(models.rol, { foreignKey: 'uid', through: models.usrrol });
  models.rol.belongsToMany(models.user, { foreignKey: 'id', through: models.usrrol });
  //{through: 'UserRole', constraints: true}
  models.User.findAll({
    include: [{
      model: models.rol,
      //attributes:['first_name'],
      where: { 'glosarol': req.params.rol },
      order: ['"first_name" ASC', '"last_name" ASC']
    }]
  }).then(function (gerentes) {
    //gerentes.forEach(log)
    res.json(gerentes);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });

};
