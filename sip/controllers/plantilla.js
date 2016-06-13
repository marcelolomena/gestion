var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}
// 
exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "cui";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.plantillapresupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });

            models.plantillapresupuesto.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.plantillapresupuesto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.estructuracui
                    }]
                }).then(function (plantillas) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: plantillas });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.servicio.create({
        criticidad: req.body.criticidad,
        nombre: req.body.nombre,
        tarea: req.body.tarea,
        idcuenta: req.body.idcuenta,
        cuentacontable: req.body.cuentacontable,
        borrado: 1
      }).then(function (servicio) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.servicio.update({
        criticidad: req.body.criticidad,
        nombre: req.body.nombre,
        tarea: req.body.tarea,
        idcuenta: req.body.idcuenta,
        cuentacontable: req.body.cuentacontable
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (servicio) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.servicio.destroy({
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
    width: 3
  },
    {
      caption: 'CUI',
      type: 'number',
      width: 10
    },
    {
      caption: 'Nombre CUI',
      type: 'string',
      width: 50
    },
    {
      caption: 'Responsable',
      type: 'string',
      width: 50
    },
    {
      caption: 'Ejercicio',
      type: 'number',
      width: 20
    },
    {
      caption: 'Versión',
      type: 'number',
      width: 10
    },
    {
      caption: 'Descripción',
      type: 'string',
      width: 30
    }
  ];

  var sql = "SELECT a.*, b.CUI, b.nombre, b.responsable, c.ejercicio " +
    "FROM sip.presupuesto a JOIN sip.cuidivot b ON a.idcui=b.secuencia " +
    "JOIN sip.ejercicios c ON c.id=a.idejercicio ";

  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].CUI,
          proyecto[i].nombre,
          proyecto[i].responsable,
          proyecto[i].ejercicio,
          proyecto[i].version,
          proyecto[i].descripcion
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "Presupuestos.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};



