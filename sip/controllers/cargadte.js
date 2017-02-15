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

exports.excel = function (req, res) {

  var conf = {}
  conf.cols = [
    {
      caption: 'CUI',
      type: 'number',
      width: 3
    },
    {
      caption: 'Nombre Cuenta',
      type: 'string',
      width: 255
    },
    {
      caption: 'Cuenta',
      type: 'string',
      width: 20
    },
    {
      caption: 'Monto',
      type: 'number',
      width: 3
    },
    {
      caption: 'IVA No Recuperable',
      type: 'number',
      width: 3
    },
    {
      caption: 'Costo',
      type: 'number',
      width: 3
    }
  ];

  models.desgloseitemfactura.belongsTo(models.detallefactura, { foreignKey: 'iddetallefactura' });
  models.desgloseitemfactura.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
  models.desgloseitemfactura.belongsTo(models.cuentascontables, { foreignKey: 'idcuentacontable' });
  models.detallefactura.belongsTo(models.factura, { foreignKey: 'idfactura' });

  return models.desgloseitemfactura.findAll({
    attributes: [['montoneto', 'montoneto'], ['ivanorecuperable', 'ivanorecuperable'], ['montocosto', 'montocosto']],
    include: [
      {
        attributes: [['cui', 'cui']],
        model: models.estructuracui
      },
      {
        attributes: [['nombrecuenta', 'nombrecuenta'], ['cuentacontable', 'cuentacontable']],
        model: models.cuentascontables
      },
      {
        attributes: [['id', 'id']],
        model: models.detallefactura,
        include: [
          {
            attributes: [['id', 'id']],
            model: models.factura,
            where: { id: req.params.id }
          },
        ]
      }]
  }).then(function (desgloseitemfactura) {

    var rows = []
    for (var f in desgloseitemfactura) {
      var item = [
        desgloseitemfactura[f].cui,
        desgloseitemfactura[f].nombrecuenta,
        desgloseitemfactura[f].cuentacontable,
        desgloseitemfactura[f].montoneto,
        desgloseitemfactura[f].ivanorecuperable,
        desgloseitemfactura[f].montocosto
      ]
      rows.push(item);
    }

    conf.rows = rows;

    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformates');
    res.setHeader("Content-Disposition", "attachment;filename=" + "desglose.xlsx");
    res.end(result, 'binary');


  }).catch(function (e) {
    logger.error(e);
    throw e;
  });

}

exports.list = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;

  models.cargadte.belongsTo(models.factura, { foreignKey: 'idfactura' });
  models.factura.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

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
          where: data,
          include: [
            {
              model: models.factura,
              include: [
                { model: models.proveedor },
              ]
            }]
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

exports.detalle = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "id";

  if (!sord)
    sord = "desc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idfactura",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.detallefactura.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.detallefactura.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (dcargas) {
          res.json({ records: records, total: total, page: page, rows: dcargas });
        }).catch(function (err) {
          logger.error(e)
          res.json({ error_code: 1 });
        });
      })
    }
  });


}

exports.guardar = function (req, res) {
  return models.cargadte.create({
    horainicio: new Date(),
    usuario: req.session.passport.user,
    estado: 'EN PROCESO',
    borrado: 1
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

    var processZipEntries = function (req, res, zipEntries, zipFolderName, i, idcarga) {

      var bufferStream = new stream.PassThrough();
      var zipEntryName, data, etree;

      if (i < zipEntries.length) {
        var zipEntry = zipEntries[i];
        var zipEntryData = zipEntry.getData();
        var data = zipEntryData.toString('utf8');
        etree = et.parse(data);
        var lstDet = etree.findall('*/Documento/Detalle')
        var FchEmis = etree.findtext('*/Documento/Encabezado/IdDoc/FchEmis')
        var Folio = etree.findtext('*/Documento/Encabezado/IdDoc/Folio')
        var RUTEmisor = etree.findtext('*/Documento/Encabezado/Emisor/RUTEmisor')
        var RznSoc = etree.findtext('*/Documento/Encabezado/Emisor/RznSoc')
        var MntTotal = etree.findtext('*/Documento/Encabezado/Totales/MntTotal')
        var MntExe = etree.findtext('*/Documento/Encabezado/Totales/MntExe')
        var MntNeto = etree.findtext('*/Documento/Encabezado/Totales/MntNeto')
        var Iva = etree.findtext('*/Documento/Encabezado/Totales/IVA')

        logger.debug("FchEmis : " + FchEmis);
        logger.debug("Folio : " + Folio);
        logger.debug("RUTEmisor : " + RUTEmisor);
        logger.debug("RznSoc : " + RznSoc);
        logger.debug("MntTotal : " + MntTotal);

        if (MntExe === undefined)
          MntExe = null

        if (MntNeto === undefined)
          MntNeto = null

        if (Iva === undefined)
          Iva = null

        logger.debug("MntExe : " + MntExe);
        logger.debug("MntNeto : " + MntNeto);
        logger.debug("IVA : " + Iva);

        if (MntExe === MntTotal)
          MntNeto = MntTotal

        return models.proveedor.findAll({
          attributes: ['id'],
          where: { numrut: RUTEmisor.split("-")[0] }
        }).then(function (proveedor) {

          return models.factura.create({
            numero: Folio,
            idproveedor: proveedor[0].id,
            fecha: FchEmis,
            montoneto: MntNeto,
            impuesto: Iva,
            montototal: MntTotal,
            borrado: 1
          }).then(function (factura) {

            var idfactura = factura.id

            /*actualiza tabla de carga*/

            zipEntryName = getZipEntryName(zipEntry, zipFolderName);
            logger.debug("Agregar este archivo a la base de datos >> " + zipEntryName);

            models.cargadte.update({
              horafin: new Date(),
              archivo: zipEntryName,
              estado: "CARGADO",
            }, {
                where: {
                  id: idcarga
                }
              }).then(function (cargadte) {

              }).catch(function (err) {
                logger.error(err)
                res.json({ message: err, success: false });
              });

            models.cargadte.update({
              idfactura: idfactura,
            }, {
                where: {
                  id: idcarga
                }
              }).then(function (cargadte) {

              }).catch(function (err) {
                logger.error(err)
                res.json({ message: err, success: false });
              });


            for (var i = 0; i < lstDet.length; i++) {
              var s = lstDet[i].findtext('NmbItem').toUpperCase()
              var m = lstDet[i].findtext('MontoItem')
              var ini = s.indexOf("PF")

              if (ini > -1) {
                var r = /\d+/g, match, results = [];
                while ((match = r.exec(s.substring(ini + 2))) != null)
                  results.push(match[0]);

                return models.solicitudaprobacion.findAll({
                  attributes: ['id', 'periodo'],
                  where: { idprefactura: results[0] }
                }).then(function (solicitudaprobacion) {
                  logger.debug("FACTURA : " + idfactura);
                  logger.debug("PREFACTURA : " + results[0]);
                  logger.debug("SOL : " + solicitudaprobacion[0].id);

                  return models.detallefactura.create({
                    idfactura: idfactura,
                    idprefactura: results[0],
                    idfacturacion: solicitudaprobacion[0].id,
                    glosaservicio: lstDet[i].findtext('NmbItem'),
                    montoneto: m,
                    montototal: m,
                    borrado: 1
                  }).then(function (detallefactura) {
                    logger.debug("IDDETALLEFACTURA : " + detallefactura.id);
                    logger.debug("periodo  : " + solicitudaprobacion[0].periodo);

                    return models.desgloseitemfactura.create({
                      iddetallefactura: detallefactura.id
                    }).then(function (desgloseitemfactura) {

                    }).catch(function (err) {
                      logger.error(err)
                      res.json({ message: err, success: false });
                    });


                  }).catch(function (err) {
                    logger.error(err)
                    res.json({ message: err, success: false });
                  });

                }).catch(function (err) {
                  logger.error(err)
                  res.json({ message: err, success: false });
                });

              }
            }/*for*/

            bufferStream.end(zipEntryData);
            //zipEntryName = getZipEntryName(zipEntry, zipFolderName);
            //logger.debug("Agregar este archivo a la base de datos >> " + zipEntryName);

            processZipEntries(req, res, zipEntries, zipFolderName, i + 1, idcarga);

          }).catch(function (err) {
            logger.error(err)
            res.json({ message: err, success: false });
          });
        }).catch(function (err) {
          logger.error(err);
          res.json({ message: err, success: false });
        });

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

        awaitId.then(function (idcargadte) {

          processZipEntries(req, res, zipEntries, zipFolderName, 0, idcargadte);

          res.json({ message: "archivo cargado", success: true });

        }).catch(function (err) {
          logger.error(err)
          res.json({ message: err, success: false });
        });

      });

    });

    req.pipe(busboy);

  }

}

