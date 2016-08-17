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
    sidx = "moneda";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.moneda.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.moneda.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (monedas) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: monedas });
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
               
      models.moneda.create({
        moneda: req.body.moneda,
        glosamoneda: req.body.glosamoneda,
        borrado: 1
      }).then(function (plantilla) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.moneda.update({
        glosamoneda: req.body.glosamoneda
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
      models.moneda.destroy({
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
      caption: 'Moneda',
      type: 'number',
      width: 10
    },
    {
      caption: 'GlosaMoneda',
      type: 'string',
      width: 50
    }
  ];

  var sql = "SELECT id,moneda,glosamoneda FROM sip.moneda order by moneda asc"
  
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].moneda,
          proyecto[i].glosamoneda
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "monedas.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};