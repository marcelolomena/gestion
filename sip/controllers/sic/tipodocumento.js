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
      models.tipodocumento.create({
        nombrecorto: req.body.nombrecorto,
        descripcionlarga: req.body.descripcionlarga,
        borrado: 1
      }).then(function (tipodocumento) {
        return res.json({ id: tipodocumento.id, message: 'Inicio carga', success: true });
      }).catch(function (err) {
        logger.error(err)
        return res.json({ id: tipodocumento.id, message: 'Falla', success: false });
      });

      break;
    case "edit":
      models.tipodocumento.update({
        nombrecorto: req.body.nombrecorto,
        descripcionlarga: req.body.descripcionlarga,

      }, {
          where: {
            id: req.body.id
          }
        }).then(function (clase) {
          res.json({ id: req.body.id, message: 'Inicio carga', success: true });
        }).catch(function (err) {
          logger.error(err)
          res.json({ message: err.message, success: false });
        });
      break;
    case "del":
      models.tipodocumento.destroy({
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
    sidx = "[nombrecorto]";

  if (!sord)
    sord = "asc";

  var orden = "[tipodocumento]." + sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (data) {
      //logger.debug(data)
      models.tipodocumento.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.tipodocumento.findAll({
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

            var saveTo = path.join(__dirname, '../../docs/', 'tipodocumento', filename);
            //logger.debug("actual : " + saveTo)
            file.pipe(fs.createWriteStream(saveTo));

           

                var dir = path.join(__dirname, '../../', 'public/docs/tipodocumento');
                checkDirectorySync(dir);
                var dest = path.join(__dirname, '../../', 'public/docs/tipodocumento', filename);
                copyFile(saveTo, dest)

                awaitId.then(function (idDetail) {
                    //logger.debug("idDetail : " + idDetail)
                    models.tipodocumento.update({
                        nombrearchivo: filename
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

exports.getgrupoclausula = function (req, res) {

  sequelize.query(
    'select a.* ' +
    'from sic.valores a ' +
    "where a.tipo='grupoclausula' ",
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