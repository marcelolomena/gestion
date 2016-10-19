var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "periodo";

   // if (!sord)
    sord = "desc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idmoneda",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
              logger.debug("->>> " + filters)
            models.monedasconversion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.monedasconversion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden
                }).then(function (conversiones) {
                    res.json({ records: records, total: total, page: page, rows: conversiones });
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
  var moneda = req.body.moneda;
  var periodo = req.body.periodo;

  switch (action) {
   
    case "add":
        var sql = "SELECT * FROM sip.monedasconversion " +
                  "WHERE moneda='"+ moneda +"' AND periodo="+ periodo +"";
         sequelize.query(sql)
        .spread(function (rows) {
          if (rows.length > 0) {
            res.json({ error_code: 10 });
          }      
          else
          { var ejercicio =  req.body.periodo.substring(0, 4);
            var mes =  req.body.periodo.substring(4,req.body.periodo.length);
            if (mes < 1)  {
               res.json({ error_code: 30 });            
            }
            if (mes > 12){
               res.json({ error_code: 30 });            
            }
            var sql = "SELECT id FROM sip.ejercicios " +
                  "WHERE ejercicio="+ ejercicio +"";
                sequelize.query(sql)
                .spread(function (rows) {
                if (rows.length == 0) {
                   res.json({ error_code: 20 });
                }      
                else
               { 
                var idejercicio = rows[0].id
                models.monedasconversion.create({
                moneda: req.body.moneda,
                valorconversion: req.body.valorconversion,
                periodo: req.body.periodo,
                ejercicio: ejercicio,
                idejercicio:idejercicio,
                idmoneda: req.body.idmoneda,
                borrado: 1
              }).then(function (conversiones) {
                res.json({ error_code: 0 });
              }).catch(function (err) {
                logger.error(err)
                res.json({ error_code: 1 });
              })        
             }});  
          };
      });  
      break;
        
    case "edit":
      models.monedasconversion.update({
        valorconversion: req.body.valorconversion
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (conversiones) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.monedasconversion.destroy({
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

