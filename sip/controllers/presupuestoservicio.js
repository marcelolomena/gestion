var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
// Create endpoint /proyecto for GET
exports.getPresupuestoServicios = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idpresupuesto="+id;

  if (!sidx)
    sidx = "a.idcuenta";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  var insertaPeriodos = function (callback) {

      models.sequelize.transaction({ autocommit: true }, function (t) {
          var promises = []
          var d = new Date();
          var anio = d.getFullYear()
          var mes = d.getMonth() + 1

          for (var i = 0; i < 12; i++) {
              var mm = mes + i
              if (mm === 12) {
                  anio = anio + 1 // incrementa el año en uno si el mes actual es DIC
                  mm = 1 // coloca el mes en enero
              }
              var mmm = mm < 10 ? '0' + mm : mm
              var periodo = anio + mmm

              var newPromise = models.detalleplan.create({
                  'iddetallepre': req.params.id,
                  'periodo': periodo, 
                  'presupuestopesos': 5000,
                  'presupuestobasepesos': 5000, 
                  'compromisopesos': 5000,
                  'borrado':1
              }, { transaction: t });

              promises.push(newPromise);
          };
          return Promise.all(promises).then(function (compromisos) {
              var compromisoPromises = [];
              for (var i = 0; i < compromisos.length; i++) {
                  compromisoPromises.push(compromisos[i]);
              }
              return Promise.all(compromisoPromises);
          });

      }).then(function (result) {
          callback(result)
      }).catch(function (err) {
          return next(err);
      });

  }  
  
  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.id, c.nombre, a.idservicio, b.cuentacontable, b.nombrecuenta, d.moneda, a.idmoneda, a.montoforecast, a.montoanual " +
    "FROM sip.detallepre a LEFT JOIN sip.cuentascontables b ON b.id = a.idcuenta  " +
    "LEFT JOIN sip.servicio c ON c.id = a.idservicio  " +
    "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
    "WHERE a.idpresupuesto="+id+")" +
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
        "as resultNum, a.id, c.nombre, a.idservicio, b.cuentacontable, b.nombrecuenta, d.moneda, a.idmoneda, a.montoforecast, a.montoanual " +
        "FROM sip.detallepre a LEFT JOIN sip.cuentascontables b ON b.id = a.idcuenta  " +
        "LEFT JOIN sip.servicio c ON c.id = a.idservicio  " +
        "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
        "WHERE a.idpresupuesto=" +id+" "+ condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        
        console.log(sql);

      models.detallepre.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {
      console.log(sql0);
      models.detallepre.count({ where: [filtrosubgrilla] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {        
          });
      })
    }

  } else {
    console.log(sql0);
    models.detallepre.count({ where: [filtrosubgrilla] }).then(function (records) {
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
  var filtrosubgrilla = "idpresupuesto="+id;
    
  console.log("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'CUI',
      type: 'number',
      width: 10
    },  
    {
      caption: 'Cuenta Contable',
      type: 'number',
      width: 15
    },    
    {
      caption: 'Nombre Cuenta',
      type: 'string',
      width: 50
    },
    {
      caption: 'Nombre Servicio',
      type: 'string',
      width: 50
    },
    {
      caption: 'Moneda',
      type: 'number',
      width: 20
    },
    {
      caption: 'Monto Forecast',
      type: 'number',
      width: 10
    },
    {
      caption: 'Monto Anual',
      type: 'number',  
      width: 15
    }
  ];
  
    var sql = "SELECT a.id, f.CUI, b.cuentacontable, b.nombrecuenta, c.nombre, d.moneda, a.montoforecast, a.montoanual "+
        "FROM sip.detallepre a LEFT JOIN sip.cuentascontables b ON b.id = a.idcuenta "+ 
        "LEFT JOIN sip.servicio c ON c.id = a.idservicio  "+
        "LEFT JOIN sip.moneda d ON a.idmoneda = d.id "+
        "LEFT JOIN sip.presupuesto e ON a.idpresupuesto=e.id LEFT JOIN sip.cuidivot f ON e.idcui=f.secuencia "+
        "WHERE a.idpresupuesto="+id+ " order by cuentacontable";
    
    console.log("sql:"+sql);
    sequelize.query(sql)
      .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1,
          proyecto[i].CUI,
          proyecto[i].cuentacontable,
          proyecto[i].nombrecuenta,
          proyecto[i].nombre,
          proyecto[i].moneda,
          (proyecto[i].montoforecast=='0')?'0':proyecto[i].montoforecast,
          (proyecto[i].montoanual=='0')? '0':proyecto[i].montoanual
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "ServiciosPresupuesto.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });
  
};


exports.getServicios = function (req, res) {

  var sql = "SELECT id, nombre FROM sip.servicio "+ 
    "ORDER BY nombre";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};


exports.getMonedas = function (req, res) {

  var sql = "SELECT id, moneda FROM sip.moneda";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.action = function (req, res) {
  var action = req.body.oper;
  var idPre = req.params.id
  
  switch (action) {
    case "add":
      models.detallepre.create({
        idpresupuesto: idPre,
        idservicio: req.body.idservicio,
        idmoneda: req.body.idmoneda,
        montoforecast: req.body.montoforecast,
        montoanual: req.body.montoanual, 
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.detallepre.update({
        idservicio: req.body.idservicio,
        idmoneda: req.body.idmoneda,
        montoforecast: req.body.montoforecast,
        montoanual: req.body.montoanual 
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contrato) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.detallepre.destroy({
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