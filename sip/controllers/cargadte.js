var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var async = require('async');
var AdmZip = require('adm-zip');
var stream = require('stream');
var et = require('elementtree');

exports.list = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      return models.cargadte.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        return models.cargadte.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: 'horainicio desc',
          where: data
        }).then(function (cargadte) {
          return res.json({ records: records, total: total, page: page, rows: cargadte });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.guardar = function (req, res) {
  return models.cargadte.create({
    horainicio: new Date(),
    estado: 'EN PROCESO',
  }).then(function (cargadte) {
    return res.json({ id: cargadte.id, message: 'inicio carga', success: true });
  }).catch(function (err) {
    logger.error(err)
    res.json({ id: 0, message: err, success: false });
  });
}

exports.archivo = function (req, res) {

  if (req.method === 'POST') {


    var busboy = new Busboy({ headers: req.headers });

    var processZipEntries = function (req, res, zipEntries, zipFolderName, i) {

      var bufferStream = new stream.PassThrough();
      var zipEntryName, data, etree;

      if (i < zipEntries.length) {
        var zipEntry = zipEntries[i];
        var zipEntryData = zipEntry.getData();
        var data = zipEntryData.toString('utf8');
        etree = et.parse(data);
        var lstDet = etree.findall('*/Documento/Detalle')

        for (var i = 0; i < lstDet.length; i++) {

          //logger.debug(lstDet[i].findtext('NmbItem'));
          var s = lstDet[i].findtext('NmbItem').toUpperCase()
          logger.debug(s);
          if (s.indexOf("PF") > -1) {
            var r = /\d+/g;
            var m;
            while ((m = r.exec(s)) != null) {
              logger.debug(m[0]);
            }
          }
        }

        bufferStream.end(zipEntryData);
        zipEntryName = getZipEntryName(zipEntry, zipFolderName);

        logger.debug("Agregar este archivo a la base de datos >> " + zipEntryName);

        processZipEntries(req, res, zipEntries, zipFolderName, i + 1);
      } else {
        //Nada que hacer

      }
    };
    //Get the zip entry name
    var getZipEntryName = function (zipEntry, zipFolderName) {
      return zipEntry.entryName.replace(zipFolderName + "/", "");
    };


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

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

      var data = [], dataLen = 0;

      file.on('data', function (chunk) {
        data.push(chunk);
        dataLen += chunk.length;
      });

      file.on('end', function () {
        var buf = new Buffer(dataLen);

        for (var i = 0, len = data.length, pos = 0; i < len; i++) {
          data[i].copy(buf, pos);
          pos += data[i].length;
        }

        var zip = new AdmZip(buf);

        var zipEntries = zip.getEntries();

        var zipFolderName = filename.replace(".zip", "");

        logger.debug(zipFolderName)

        processZipEntries(req, res, zipEntries, zipFolderName, 0);

      });

    });

    req.pipe(busboy);

  }

}

