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
        borrado: 1
      }).then(function (clase) {
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
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
          res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error: 1, glosa: err.message });
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
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
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
          res.json({ records: records, total: total, page: page, rows: clase });
        }).catch(function (err) {
          logger.error(err.message);
          res.json({ error_code: 1 });
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
  logger.debug('rows: '+rows)
  logger.debug('page: '+page)

  if (!sidx)
    sidx = "codigo";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idclase",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      //logger.debug("->>> " + err)
    } else {
      models.plantillaclausula.count({
        where: data
      }).then(function (records) {
        logger.debug("records: "+records);
        var total = Math.ceil(records / rows);
        logger.debug("total: "+total);
        models.plantillaclausula.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (plantillaclausula) {
          res.json({ records: records, total: total, page: page, rows: plantillaclausula });
        }).catch(function (err) {
          //logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.action2 = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.plantillaclausula.create({
        idclase: req.body.parent_id,
        codigo: req.body.codigo,
        criticidad: req.body.criticidad,
        borrado: 1
      }).then(function (plantillaclausula) {
        res.json({ error: 0, glosa: '' });
      }).catch(function (err) {
        logger.error(err)
        res.json({ error: 1, glosa: err.message });
      });

      break;
    case "edit":
      models.plantillaclausula.update({
        codigo: req.body.codigo,
        criticidad: req.body.criticidad,
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantillaclausula) {
          res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error: 1, glosa: err.message });
        });
      break;
    case "del":
      models.plantillaclausula.destroy({
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

exports.list3 = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  logger.debug('rows: '+rows)
  logger.debug('page: '+page)

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
        logger.debug("records: "+records);
        var total = Math.ceil(records / rows);
        logger.debug("total: "+total);
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
  if(req.body.tipoadjunto=="48"){
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

exports.gettipoclausula = function (req, res) {

  sequelize.query(
    'select a.* ' +
    'from sic.valores a ' +
    "where a.tipo='tipoclausula' ",
    { type: sequelize.QueryTypes.SELECT }
  ).then(function (valores) {
    //logger.debug(valores)
    res.json(valores);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error: 1 });
  });
}

exports.download = function(req, res) {
    
    models.plantillaclausula.findAll({
        order: 'codigo ASC',
        //attributes: ['texto'],
        where: { idgrupo: req.params.id },
        /*
        include: [{
            model: models.plantillaclausula
        }]
        */
    }).then(function(clausulas) {

      //console.dir(clausulas);

        var result = '<html><body>'

        for (var f in clausulas) {

            var code = clausulas[f].codigo
            if (!code) {
                throw new Error("No es posible generar el documento.")
            }

            var level = code.split(".");
            var nombrecorto = clausulas[f].nombrecorto;

            //console.dir("los niveles oe: "+level)

            if (parseInt(level[0]) > 0 && parseInt(level[1]) == 0 )
                result += '<h1>' + nombrecorto + '</h1>'
            else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0 )
                result += '<h2>' + nombrecorto + '</h2>'



            result += clausulas[f].glosaclausula
        }

        result += '</html></body>'

        var hdr = 'attachment; filename=RTF_' + Math.floor(Date.now()) + '.doc'
        res.setHeader('Content-disposition', hdr);
        res.set('Content-Type', 'application/msword;charset=utf-8');
        res.status(200).send(result);

    }).catch(function(err) {
        logger.error(err.message);
        res.status(500).send(err.message);
    });

}
exports.upload = function (req, res) {

    if (req.method === 'POST') {

        var busboy = new Busboy({ headers: req.headers });

        var awaitId = new Promise(function (resolve, reject) {

            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'id') {
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

        var awaitParent = new Promise(function (resolve, reject) {

            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'parent') {
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

        function copyFile(source, target) {
            return new Promise(function (resolve, reject) {
                var rd = fs.createReadStream(source);
                rd.on('error', rejectCleanup);
                var wr = fs.createWriteStream(target);
                wr.on('error', rejectCleanup);
                function rejectCleanup(err) {
                    rd.destroy();
                    wr.end();
                    reject(err);
                }
                wr.on('finish', resolve);
                rd.pipe(wr);
            });
        }

        function checkDirectorySync(directory) {
            try {
                fs.statSync(directory);
            } catch (e) {
                fs.mkdirSync(directory);
            }
        }

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            var saveTo = path.join(__dirname, '../../docs/', 'anexosclausulas', filename);
            //logger.debug("actual : " + saveTo)
            file.pipe(fs.createWriteStream(saveTo));

           

                var dir = path.join(__dirname, '../../', 'public/docs/anexosclausulas');
                checkDirectorySync(dir);
                var dest = path.join(__dirname, '../../', 'public/docs/anexosclausulas', filename);
                copyFile(saveTo, dest)

                awaitId.then(function (idDetail) {
                    //logger.debug("idDetail : " + idDetail)
                    models.cuerpoclausula.update({
                        nombreadjunto: filename
                    }, {
                            where: {
                                id: idDetail
                            }
                        }).then(function (documentoscotizacion) {
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });

                }).catch(function (err) {
                    res.json({ error_code: 1, message: err.message, success: false });
                    logger.error(err)
                });

            

        });

        busboy.on('finish', function () {
            logger.debug("Finalizo la transferencia del archivo")

            res.json({ error_code: 0, message: 'Archivo guardado', success: true });
        });

        return req.pipe(busboy);
    }

}