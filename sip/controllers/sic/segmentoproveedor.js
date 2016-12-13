var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var nodeExcel = require('excel-export');
var bitacora = require("../../utils/bitacora");


exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "sigla";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      logger.error(err)
    } else {
      models.segmentoproveedor.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.segmentoproveedor.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (segmentos) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: segmentos });
        }).catch(function (err) {
                        logger.error(e)  
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
               
      models.segmentoproveedor.create({
        sigla: req.body.sigla,
        nombre: req.body.nombre,
        borrado: 1
      }).then(function (segmentoproveedor) {
                  
                    bitacora.registrar(
                    null,
                    'segmentoproveedor',
                    segmentoproveedor.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.segmentoproveedor,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
        res.json({ id: segmentoproveedor.id, parent: null, message: 'Insertando', success: true });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
                bitacora.registrar(
                null,
                'segmentoproveedor',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.segmentoproveedor, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                         models.segmentoproveedor.update({
                         nombre: req.body.nombre,
                         }, {
                         where: {
                            id: req.body.id
                                }
                         }).then(function (segmentoproveedor) {

                                res.json({ id: req.body.id, parent: req.body.id, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;

    case "del":
            bitacora.registrar(
                null,
                'segmentoproveedor',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.segmentoproveedor, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                       models.segmentoproveedor.destroy({
                       where: {
                               id: req.body.id
                              }
                       }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted

                            if (rowDeleted === 1) {

                                logger.debug('Deleted successfully');
                            }
                            res.json({ error: 0, glosa: '' ,success: true});
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }
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
      caption: 'sigla',
      type: 'string',
      width: 3
    },
    {
      caption: 'Nombre',
      type: 'string',
      width: 50
    }
  ];

  var sql = "SELECT id,sigla,nombre FROM sic.segmentoproveedor order by sigla "
  
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].sigla,
          proyecto[i].nombre
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "segmentosproveedor.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};