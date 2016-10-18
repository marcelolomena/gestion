var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var logger = require("../utils/logger");
// Create endpoint /proyecto for GET
exports.getPresupuestoPeriodos = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "iddetallepre=" + id;

  if (!sidx)
    sidx = "periodo";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  var insertaPeriodos = function (callback) {

    models.sequelize.transaction({ autocommit: true }, function (t) {
      var promises = []
      var d = new Date();
      var anio = d.getFullYear()
      var mes = 9;

      for (var i = 0; i < 4; i++) {
        var mm = mes + i
        var mmm = mm < 10 ? '0' + mm : mm
        var periodo = anio + '' + mmm

        var newPromise = models.detalleplan.create({
          'iddetallepre': req.params.id,
          'periodo': periodo,
          'presupuestopesos': 0,
          'presupuestobasepesos': 0,
          'compromisopesos': 0,
          'borrado': 1
        }, { transaction: t });

        promises.push(newPromise);
      };
      mes = 1;
      anio = anio + 1;
      for (var i = 0; i < 12; i++) {
        var mm = mes + i
        var mmm = mm < 10 ? '0' + mm : mm
        var periodo = anio + '' + mmm

        var newPromise = models.detalleplan.create({
          'iddetallepre': req.params.id,
          'periodo': periodo,
          'presupuestopesos': 0,
          'presupuestobasepesos': 0,
          'compromisopesos': 0,
          'borrado': 1
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
    "as resultNum, * " +
    "FROM sip.detalleplan " +
    "WHERE iddetallepre=" + id + " order by periodo asc)" +
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
        "FROM sip.detalleplan " +
        "WHERE iddetallepre=" + id + " " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.detalleplan.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {
      console.log(sql0);
      models.detalleplan.count({ where: [filtrosubgrilla] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {
    console.log(sql0);
    models.detalleplan.count({ where: [filtrosubgrilla] }).then(function (records) {
      //if (records > 0) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      /*} else {
        insertaPeriodos(function (compromisos) {
          res.json({ records: 16, total: 16, page: 1, rows: compromisos });
        });
      }*/
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
  var filtrosubgrilla = "idpresupuesto=" + id;

  console.log("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'Periodo',
      type: 'periodo',
      width: 10
    },
    {
      caption: 'Presupuesto',
      type: 'presupuestobasepesos',
      width: 15
    },
    {
      caption: 'Contrato',
      type: 'compromisopesos',
      width: 50
    },
    {
      caption: 'Valor Presupuesto',
      type: 'presupuestopesos',
      width: 50
    }
  ];

  var sql = "SELECT * " +
    "FROM sip.detalleplan " +
    "WHERE a.iddetallepre=" + id + " order by periodo";

  console.log("sql:" + sql);
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1,
          proyecto[i].periodo,
          (proyecto[i].presupuestobasepesos == '0') ? '0' : proyecto[i].presupuestobasepesos,
          (proyecto[i].compromisopesos == '0') ? '0' : proyecto[i].compromisopesos,
          (proyecto[i].presupuestopesos == '0') ? '0' : proyecto[i].presupuestopesos
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "PeriodosPresupuesto.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};


exports.action = function (req, res) {
  var action = req.body.oper;
  var idServ = req.params.id
  console.log("***ActionPeriodos:" + req.body.id);
  var idPeriodo = req.body.id;

  var estadoPrep = function (idperiodo, callback) {
    console.log("***EstadoPrep" + idperiodo);
    var sql = "declare @idservicio int " +
      "SELECT @idservicio=iddetallepre FROM sip.detalleplan WHERE id=" + idperiodo + " " +
      "SELECT b.estado FROM sip.detallepre a JOIN sip.presupuesto b ON a.idpresupuesto=b.id " +
      "WHERE a.id=@idservicio";
    var estadoPrep;
    sequelize.query(sql)
      .spread(function (rows) {
        if (rows.length > 0) {
          console.log("***Estado:" + rows[0].estado);
          estadoPrep = rows[0].estado;
        } else {
          estadoPrep = ""; //no existe el presupuesto
        }
        callback(estadoPrep);
      })
  }

  estadoPrep(idPeriodo, function (estado) {
    if (estado == "Aprobado") {
      res.json({ error_code: 10 });
    } else {
      switch (action) {
        case "add":
          console.log("No se puede agregar");
          break;
        case "edit":
          console.log("Edit:" + req.body.id + "," + req.body.presupuestoorigen + "," + req.body.periodo);
          sequelize.query('EXECUTE sip.spActualizaPeriodoPresup ' + req.body.id
            + "," + req.body.presupuestoorigen
            + "," + req.body.periodo
            + "," + req.body.idx        
            + ';').then(function (response) {
              res.json({ error_code: 0 });
            }).error(function (err) {
              res.json(err);
            });
          break;
        case "del":
          console.log("No se puede eliminar");
          break;
      }
    }
  });
}

exports.actioncosto = function (req, res) {
  console.log("****Act COSTO:"+req.body.id+", "+req.body.costo);
  sequelize.query('EXECUTE sip.ActCostoDetallePresup ' 
      + req.body.id +","+
      + req.body.costo
    + ';').then(function (response) {
      res.json({ error_code: 0 });
    }).error(function (err) {
      res.json(err);
    });

};

