var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.claseevaluaciontecnica.create({
        nombre: req.body.nombre,
        borrado: 1,
        niveles: 0
      }).then(function (clase) {
        return res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.claseevaluaciontecnica.update({
        nombre: req.body.nombre
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (clase) {
          return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          return res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.claseevaluaciontecnica.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        return res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ error: 1, glosa: err.message });
      });

      break;

  }
}

exports.list = function (req, res) {

  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = "[claseevaluaciontecnica]." + sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (data) {
      //logger.debug(data)
      models.claseevaluaciontecnica.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.claseevaluaciontecnica.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (clase) {
          //logger.debug(solicitudcotizacion)
          return res.json({ records: records, total: total, page: page, rows: clase });
        }).catch(function (err) {
          logger.error(err.message);
          return res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.list2 = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  //logger.debug('rows: '+rows)
  //logger.debug('page: '+page)

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idclaseevaluaciontecnica",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      //logger.debug("->>> " + err)
    } else {
      models.criterioevaluacion.count({
        where: data
      }).then(function (records) {
        //logger.debug("records: "+records);
        var total = Math.ceil(records / rows);
        //logger.debug("total: "+total);
        models.criterioevaluacion.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (criterioevaluacion) {
          return res.json({ records: records, total: total, page: page, rows: criterioevaluacion });
        }).catch(function (err) {
          //logger.error(err);
          return res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.action2 = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.criterioevaluacion.create({
        idclaseevaluaciontecnica: req.body.parent_id,
        nombre: req.body.nombre,
        comentario: req.body.comentario,
        porcentaje: req.body.porcentaje,
        borrado: 1
      }).then(function (criterioevaluacion) {
        models.claseevaluaciontecnica.findOne({
          where: {
            id: req.body.parent_id
          }
        }).then(function (records) {
          if (parseInt(records.niveles) < 1) {
            models.claseevaluaciontecnica.update({
              niveles: 1
            }, {
                where: {
                  id: req.body.parent_id
                }
              })
          }
        }).catch(function (err) {
          logger.error(err)
          return res.json({ error: 1, glosa: err.message });
        });

        return res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.criterioevaluacion.update({
        nombre: req.body.nombre,
        comentario: req.body.comentario,
        porcentaje: req.body.porcentaje,
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantillaclausula) {
          return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          return res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.criterioevaluacion.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        return res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ error: 1, glosa: err.message });
      });

      break;

  }
}

exports.list3 = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  logger.debug('rows: ' + rows)
  logger.debug('page: ' + page)

  if (!sidx)
    sidx = "titulo";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idplantillaclausula",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      //logger.debug("->>> " + err)
    } else {

      models.cuerpoclausula.count({
        where: data
      }).then(function (records) {
        logger.debug("records: " + records);
        var total = Math.ceil(records / rows);
        logger.debug("total: " + total);
        models.cuerpoclausula.belongsTo(models.valores, { foreignKey: 'idgrupo' });
        models.cuerpoclausula.belongsTo(models.valores, { as: 'nombretipoadjunto', foreignKey: 'tipoadjunto' });
        models.cuerpoclausula.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.valores
          },
          {
            model: models.valores, as: 'nombretipoadjunto'
          }
          ]
        }).then(function (cuerpoclausula) {
          res.json({ records: records, total: total, page: page, rows: cuerpoclausula });
        }).catch(function (err) {
          //logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.action3 = function (req, res) {
  var action = req.body.oper;
  var nombreadjunto = null
  if (req.body.tipoadjunto == "48") {
    nombreadjunto = req.body.elegirtabla
  }

  switch (action) {
    case "add":
      models.cuerpoclausula.create({
        idplantillaclausula: req.body.parent_id,
        titulo: req.body.titulo,
        glosa: req.body.glosa,
        idgrupo: req.body.idgrupo,
        tipoadjunto: req.body.tipoadjunto,
        nombreadjunto: nombreadjunto,
        anexo: req.body.anexo,
        borrado: 1
      }).then(function (cuerpoclausula) {
        return res.json({ id: cuerpoclausula.id, message: 'Inicio carga', success: true });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ id: cuerpoclausula.id, message: 'Falla', success: false });
      });

      break;
    case "edit":
      models.cuerpoclausula.update({
        titulo: req.body.titulo,
        glosa: req.body.glosa,
        idgrupo: req.body.idgrupo,
        anexo: req.body.anexo
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (cuerpoclausula) {
          res.json({ id: req.body.id, message: 'Inicio carga', success: true });
        }).catch(function (err) {
          logger.error(err)
          res.json({ message: err.message, success: false });
        });
      break;
    case "del":
      models.cuerpoclausula.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;

  }
}

exports.clasesevaluacion = function (req, res) {

  sequelize.query(
    'select * ' +
    'from sic.claseevaluaciontecnica ',
    { type: sequelize.QueryTypes.SELECT }
  ).then(function (valores) {
    //logger.debug(valores)
    res.json(valores);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error: 1 });
  });
}
exports.porcentajecriterios = function (req, res) {
  var sql = "select sum(porcentaje) as total from sic.criterioevaluacion where idclaseevaluaciontecnica=" + req.params.parentRowKey;
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};