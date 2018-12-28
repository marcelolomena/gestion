var models = require('../models');
var sequelize = require('../models').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");



// exports.getPersona = function (req, res) {
//   //console.log(req);

//   models.actividades.findAll({ /*where: { 'borrado': 1 },*/ order: 'id' }).then(function (actividades) {
//       res.json(actividades);
//   }).catch(function (err) {
//       logger.error(err);
//       res.json({ error_code: 1 });
//   });

// };

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;



  /*if (!sidx)
    sidx = '';

  if (!sord)
    sord = 'asc';
*/
  var orden = sidx + ' ' + sord;
  //console.log(data);




  var additional = [{
        "field": "id_empleado",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
              logger.debug("->>> " + filters)
            models.actividades.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.actividades.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data
                    //order: orden
                }).then(function (actividades) {
                    res.json({ records: records, total: total, page: page, rows: actividades });
                }).catch(function (err) {
                    logger.error(err);
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
               
      models.actividades.create({
        //glosaconcepto: req.body.glosaconcepto,
        nombre: req.body.nombre,
        fecha_nacimiento: new Date(),
        rut: req.body.rut,
        id: req.body.id,
        id_empleado:req.body.parent_id,
        borrado: 1

      }).then(function (plantilla) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.actividades.update({
        actividades: req.body.actividades,
        nombre: req.body.nombre,
        fecha_nacimiento: new Date(),
        rut: req.body.rut
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantilla) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.actividades.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
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
  logger.info("En getExcel");
  var conf = {}
  conf.cols = [{
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
      caption: 'fecha_nacimiento',
      type: 'date',
      width: 50
    },
    {
      caption: 'rut',
      type: 'string',
      width: 50
    }
  ];

  var sql = "SELECT id,nombre,fecha_nacimiento,rut FROM art_live.dbo.actividades; "
  
  sequelize.query(sql)
  .spread(function (proyecto) {
    var arr = []
    for (var i = 0; i < proyecto.length; i++) {
      var currentDate = new Date(proyecto[i].fecha_nacimiento);
      var day = currentDate.getDate();
      var dia = day < 10 ? '0'.concat(day) : day;
      var month = currentDate.getMonth()+1; 
      var mes = month<10 ? '0'.concat(month): month;
      var year = currentDate.getFullYear();
      var fecha = dia+'-'+mes+'-'+year;

      a = [proyecto[i].id,
      proyecto[i].nombre,
      fecha,
      proyecto[i].rut,
      ];
      //console.log (a);
      arr.push(a);
    }
    conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "actividades.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};