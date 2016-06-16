var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}
// 
exports.list = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

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
    "as resultNum, id,cui, nombre, nombreresponsable, nombregerente  " +
    "FROM sip.estructuracui " +
    " where id in (select idcui from sip.plantillapresupuesto) ORDER BY cui asc) " +
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
        "as resultNum, id,cui, nombre, nombreresponsable, nombregerente " +
        "FROM sip.estructuracui " +
        "WHERE id in (select idcui from sip.plantillapresupuesto) and " + condition.substring(0, condition.length - 4) + " ORDER BY cui asc) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.estructuracui.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {

            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.estructuracui.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.estructuracui.count().then(function (records) {
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
    var proveedor 

     if (req.body.idproveedor == 0)
       { provedor = 'NULL'}
     else
       {proveedor= req.body.idproveedor}
               
      models.plantillapresupuesto.create({
        idcui: req.body.parent_id,
        idservicio: req.body.idservicio,
        idproveedor: proveedor,
        borrado: 1
      }).then(function (plantilla) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.plantillapresupuesto.update({
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantilla) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.plantillapresupuesto.destroy({
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