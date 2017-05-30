var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');
var nodeExcel = require('excel-export');
var async = require('async');
var csv = require('csv');
var co = require('co');
var bulk = require("../../utils/bulk");
var nodeExcel = require('excel-export');

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
  //logger.debug('rows: '+rows)
  //logger.debug('page: '+page)

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idcriterioevaluacion",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      //logger.debug("->>> " + err)
    } else {
      models.criterioevaluacion2.count({
        where: data
      }).then(function (records) {
        //logger.debug("records: "+records);
        var total = Math.ceil(records / rows);
        //logger.debug("total: "+total);
        models.criterioevaluacion2.findAll({
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

exports.action3 = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.criterioevaluacion2.create({
        idcriterioevaluacion: req.body.parent_id,
        nombre: req.body.nombre,
        comentario: req.body.comentario,
        porcentaje: req.body.porcentaje,
        borrado: 1
      }).then(function (criterioevaluacion) {
        models.claseevaluaciontecnica.findOne({
          where: {
            id: req.body.abuelo
          }
        }).then(function (records) {
          if (parseInt(records.niveles) < 2) {
            models.claseevaluaciontecnica.update({
              niveles: 2
            }, {
                where: {
                  id: req.body.abuelo
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
      models.criterioevaluacion2.update({
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
      models.criterioevaluacion2.destroy({
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


exports.list4 = function (req, res) {
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
    "field": "idcriterioevaluacion2",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      //logger.debug("->>> " + err)
    } else {
      models.criterioevaluacion3.count({
        where: data
      }).then(function (records) {
        //logger.debug("records: "+records);
        var total = Math.ceil(records / rows);
        //logger.debug("total: "+total);
        models.criterioevaluacion3.findAll({
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

exports.action4 = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      console.log(req.body.idclaseevaluaciontecnica)
      models.claseevaluaciontecnica.findOne({
        where: {
          id: req.body.idclaseevaluaciontecnica
        }
      }).then(function (records) {
        console.dir(records)
        if (parseInt(records.niveles) < 3) {
          models.claseevaluaciontecnica.update({
            niveles: 3
          }, {
              where: {
                id: req.body.idclaseevaluaciontecnica
              }
            })
        }
        return res.json({ id: req.body.idclaseevaluaciontecnica, idc: records.id, success: true });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ error: 1, glosa: err.message });
      });

      break;


    /*
        case "edit":
          models.criterioevaluacion3.update({
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
          */
    case "del":
      models.criterioevaluacion3.destroy({
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

exports.clasesevaluacion = function (req, res) {

  sequelize.query(
    'select * ' +
    'from sic.claseevaluaciontecnica ',
    { type: sequelize.QueryTypes.SELECT }
  ).then(function (valores) {
    //logger.debug(valores)
    return res.json(valores);
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error: 1 });
  });
}
exports.porcentajecriterios = function (req, res) {
  var sql = "select sum(porcentaje) as total from sic.criterioevaluacion where idclaseevaluaciontecnica=" + req.params.parentRowKey;
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });
};
exports.porcentajecriterios2 = function (req, res) {
  var sql = "select sum(porcentaje) as total from sic.criterioevaluacion2 where idcriterioevaluacion=" + req.params.parentRowKey;
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });
}

exports.porcentajecriterios3 = function (req, res) {
  var sql = "select sum(porcentaje) as total from sic.criterioevaluacion3 where idcriterioevaluacion2=" + req.params.parentRowKey;
  sequelize.query(sql)
    .spread(function (rows) {
      return res.json(rows);
    });
}

exports.upload = function (req, res) {

  if (req.method === 'POST') {

    var busboy = new Busboy({ headers: req.headers });

    var awaitId = new Promise(function (resolve, reject) {

      busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        if (fieldname === 'idc') {
          try {
            resolve(val)
          } catch (err) {
            return reject(err);
          }
        } else {
          return;
        }
      });
    });



    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {//manejador upload archivo

      var saveTo = path.join(__dirname, '..' + path.sep + '..', 'temp', filename);//path al archivo
      file.pipe(fs.createWriteStream(saveTo)); //aqui lo guarda

      awaitId.then(function (id) {
        var carrusel = [];

        var input = fs.createReadStream(saveTo, 'utf8'); //ahora lo lee
        input.on('error', function (err) {
          return res.json({ error_code: 1, message: err, success: false });
        });

        var parser = csv.parse({
          delimiter: ';',
          columns: true,
          relax: true,
          relax_column_count: true,
          skip_empty_lines: true,
          trim: true
        }); //parser CSV       
        input.pipe(parser);

        parser.on('readable', function () {
          var line

          while (line = parser.read()) {
            var item = {}
            //logger.debug("id : " + id)
            // item['id'] = id;


            item['nombre'] = line.nombre;
            item['idcriterioevaluacion2'] = req.params.idcriterioevaluacion2;
            item['porcentaje'] = cast(line.porcentaje);
            item['pregunta'] = line.pregunta;
            item['borrado'] = 1;
            console.dir(item);

            carrusel.push(item);
          }
        });

        parser.on('error', function (err) {
          return res.json({ error_code: 1, message: err, success: false });
        });/*error*/

        //parser.on('end', function (count) {
        parser.on('finish', function () {

          models.criterioevaluacion3.bulkCreate(carrusel).then(function (events) {
            return res.json({ message: 'Las preguntas fueron cargadas', success: true });
          }).catch(function (err) {
            return res.json({ message: err.message, success: false });
          });

        });/*end*/



      }).catch(function (err) {
        return res.json({ error_code: 1, message: err, success: false });
      });

    });


    busboy.on('finish', function () {
    });

    return req.pipe(busboy);
  }


}