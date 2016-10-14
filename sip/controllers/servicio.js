var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}

exports.getServicios = function (req, res) {

  models.servicio.findAll({ where: { 'borrado': 1 }, order: 'nombre' }).then(function (programa) {
    res.json(programa);
  }).catch(function (err) {
    console.log(err);
    res.json({ error_code: 1 });
  });

};

exports.cuentas = function (req, res) {
  
  var sql = "SELECT  id, cuentacontable+'  '+nombrecuenta as cuentacontable FROM sip.cuentascontables "+
  "Where borrado = 1 " +
  "ORDER BY cuentacontable";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

    var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.servicio.belongsTo(models.cuentascontables, { foreignKey: 'idcuenta' });
      models.servicio.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.servicio.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.cuentascontables
          }]
        }).then(function (servicios) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: servicios });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}

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
        agrupacionsap: req.body.agrupacionsap,
        secuenciasap: req.body.secuenciasap,
        tiposervicio: req.body.tiposervicio,
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
        cuentacontable: req.body.cuentacontable,
        agrupacionsap: req.body.agrupacionsap,
        secuenciasap: req.body.secuenciasap,
        tiposervicio: req.body.tiposervicio,        
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
  conf.cols = [
    {
      caption: 'id',
      type: 'number',
      width: 3
    },
    {
      caption: 'nombre',
      type: 'string',
      width: 50
    },
    {
      caption: 'tarea',
      type: 'string',
      width: 50
    },
    {
      caption: 'agrupacionsap',
      type: 'string',
      width: 50
    },
    {
      caption: 'secuenciasap',
      type: 'number',
      width: 50
    },  
    {
      caption: 'Tipo Servicio',
      type: 'string',
      width: 50
    },  
    {
      caption: 'Cuenta Contable',
      type: 'string',
      width: 50
    },
    {
      caption: 'Nombre Cuenta',
      type: 'string',
      width: 50
    }
  ];
  
 var sql = "SELECT a.id, a.nombre, a.tarea,a.agrupacionsap,a.secuenciasap,a.tiposervicio "+
    ",b.cuentacontable,b.nombrecuenta "+
    "FROM sip.servicio a left join sip.cuentascontables b on a.idcuenta = b.id "+
    "Where a.borrado = 1 order by a.nombre"
    
    sequelize.query(sql)
      .spread(function (servicio) {
      var arr = []
      for (var i = 0; i < servicio.length; i++) {

        a = [i + 1, servicio[i].nombre,
          servicio[i].tarea,
          servicio[i].agrupacionsap,
          servicio[i].secuenciasap,
          servicio[i].tiposervicio,
          servicio[i].cuentacontable,
          servicio[i].nombrecuenta
        ];
        console.log(a);
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "Servicios.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};