var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var utilTime = require('../utils/time');
var logger = require("../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var async = require('async');
var AdmZip = require('adm-zip');
var stream = require('stream');
var et = require('elementtree');
const fileType = require('file-type');

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
      logger.debug(desgloseitemfactura[f].estructuracui.cui)
      logger.debug(desgloseitemfactura[f].cuentascontable.nombrecuenta)
      logger.debug(desgloseitemfactura[f].cuentascontable.cuentacontable)
      var item = [
        desgloseitemfactura[f].estructuracui.cui,
        desgloseitemfactura[f].cuentascontable.nombrecuenta,
        desgloseitemfactura[f].cuentascontable.cuentacontable,
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

exports.items = function (req, res) {
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

  //models.factura.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.detallefactura.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        return models.detallefactura.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (detallefactura) {
          res.json({ records: records, total: total, page: page, rows: detallefactura });
        }).catch(function (err) {
          logger.error(e)
          res.json({ error_code: 1 });
        });
      })
    }
  });

}

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

  /*
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
            return models.detallefactura.findAll({
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
    */

  var additional = [{
    "field": "id",
    "op": "eq",
    "data": req.params.id
  }];
  models.factura.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.factura.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        return models.factura.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [
            { model: models.proveedor },
          ]
        }).then(function (factura) {
          res.json({ records: records, total: total, page: page, rows: factura });
        }).catch(function (err) {
          logger.error(e)
          res.json({ error_code: 1 });
        });
      })
    }
  });
}

exports.guardar = function (req, res) {
  logger.debug("HORA UTC : " + utilTime.calcTime(-4))
  logger.debug("HORA SYS : " + new Date())
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

      //throw new Error("Please enter a valid age")

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
            ivanorecuperable: 0,
            montocosto: 0,
            ivacredito: 0,
            borrado: 1
          }).then(function (factura) {

            var idfactura = factura.id

            /*actualiza tabla de carga*/

            zipEntryName = getZipEntryName(zipEntry, zipFolderName);
            logger.debug("Agregar este archivo a la base de datos >> " + zipEntryName);

            models.cargadte.update({
              horafin: new Date(),
              //archivo: zipEntryName,
              estado: "CARGADO",
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
              var c = lstDet[i].findtext('QtyItem')

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
                  logger.debug("IDSOL : " + solicitudaprobacion[0].id);

                  if (results[0] != undefined) {

                    models.solicitudaprobacion.belongsTo(models.prefactura, { foreignKey: 'idprefactura' });
                    return models.solicitudaprobacion.findAll({
                      attributes: ['id', 'periodo'],
                      where: { idprefactura: results[0] },
                      include: [
                        {
                          attributes: [['impuesto', 'impuesto']],
                          model: models.prefactura
                        }
                      ]
                    }).then(function (solicitudaprobacion) {
                      logger.debug("PERIODO:" + solicitudaprobacion[0].periodo)
                      logger.debug("IMPUESTO:" + solicitudaprobacion[0].prefactura.dataValues.impuesto)
                      var periodo = solicitudaprobacion[0].periodo
                      var impuesto = solicitudaprobacion[0].prefactura.dataValues.impuesto != undefined ? m * solicitudaprobacion[0].prefactura.dataValues.impuesto : 0

                      return models.detallefactura.create({
                        idfactura: idfactura,
                        idprefactura: results[0],
                        idfacturacion: solicitudaprobacion[0].id,
                        glosaservicio: lstDet[i].findtext('NmbItem'),
                        cantidad: lstDet[i].findtext('QtyItem'),
                        montonetoorigen: m,
                        montoneto: m,
                        montototal: impuesto,
                        impuesto: impuesto,
                        borrado: 1
                      }).then(function (detallefactura) {
                        logger.debug("IDDETALLEFACTURA : " + detallefactura.id);

                        return models.desglosecontable.findAll({
                          attributes: ['idcui', 'idcuentacontable', 'porcentaje'],
                          where: { idsolicitud: solicitudaprobacion[0].id }
                        }).then(function (desglosecontable) {
                          logger.debug("idcui  : " + desglosecontable[0].idcui);
                          logger.debug("idcuentacontable  : " + desglosecontable[0].idcuentacontable);
                          logger.debug("porcentaje  : " + desglosecontable[0].porcentaje);

                          return models.factoriva.findAll({
                            attributes: ['factorrecuperacion'],
                            where: { periodo: periodo }
                          }).then(function (factoriva) {

                            logger.debug("factorrecuperacion  : " + factoriva[0].factorrecuperacion);
                            var factorrecuperacion = factoriva[0].factorrecuperacion

                            return models.desgloseitemfactura.create({
                              iddetallefactura: detallefactura.id,
                              idcui: desglosecontable[0].idcui,
                              idcuentacontable: desglosecontable[0].idcuentacontable,
                              porcentaje: desglosecontable[0].porcentaje,
                              montoneto: (desglosecontable[0].porcentaje * m) / 100,
                              impuesto: (desglosecontable[0].porcentaje * impuesto) / 100,
                              ivanorecuperable: (desglosecontable[0].porcentaje * impuesto / 100) * factorrecuperacion,
                              montocosto: (desglosecontable[0].porcentaje * m / 100) + (desglosecontable[0].porcentaje * impuesto / 100) * factorrecuperacion,
                              ivacredito: (desglosecontable[0].porcentaje * impuesto / 100) * (1 - factorrecuperacion),
                              montototal: m * desglosecontable[0].porcentaje / 100 + impuesto * desglosecontable[0].porcentaje / 100,
                              borrado: 1
                            }).then(function (desgloseitemfactura) {

                              return models.desgloseitemfactura.sum('impuesto', { where: { iddetallefactura: detallefactura.id } }).then(function (monto1) {
                                return models.desgloseitemfactura.sum('ivanorecuperable', { where: { iddetallefactura: detallefactura.id } }).then(function (monto2) {
                                  return models.desgloseitemfactura.sum('montocosto', { where: { iddetallefactura: detallefactura.id } }).then(function (monto3) {
                                    return models.desgloseitemfactura.sum('ivacredito', { where: { iddetallefactura: detallefactura.id } }).then(function (monto4) {
                                      logger.debug("monto1  : " + monto1);
                                      logger.debug("monto2  : " + monto2);
                                      logger.debug("monto3  : " + monto3);
                                      logger.debug("monto4  : " + monto4);
                                      return models.detallefactura.update({
                                        ivanorecuperable: monto1,
                                        impuesto: monto2,
                                        montocosto: monto3,
                                        ivacredito: monto4
                                      }, {
                                          where: {
                                            id: detallefactura.id
                                          }
                                        }).then(function (detf) {

                                          return models.factura.find({
                                            where: { id: idfactura }
                                          }).then(function (fact) {
                                            logger.debug("fact.ivanorecuperable : " + fact.ivanorecuperable)
                                            logger.debug("fact.montocosto : " + fact.montocosto)
                                            logger.debug("fact.ivacredito : " + fact.ivacredito)
                                            return models.factura.update({
                                              ivanorecuperable: fact.ivanorecuperable + monto2,
                                              montocosto: fact.montocosto + monto3,
                                              ivacredito: fact.ivacredito + monto4
                                            }, {
                                                where: {
                                                  id: idfactura
                                                }
                                              }).then(function (f) {


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

                                    })
                                  })
                                })
                              })


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

                      }).catch(function (err) {
                        logger.error(err)
                        res.json({ message: err, success: false });
                      });


                    }).catch(function (err) {
                      logger.error(err)
                      res.json({ message: err, success: false });
                    });


                  }/*if*/

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
            logger.debug("fallo")
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

    var getZipEntryName = function (zipEntry, zipFolderName) {
      return zipEntry.entryName.replace(zipFolderName + "/", "");
    };

    var validateZip = function (buf) {
      var type = fileType(buf);
      return type.ext;
    }

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

      logger.debug(filename)

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

        var ext = validateZip(buf);
        logger.debug(ext);

        if (ext === "zip") {

          var zip = new AdmZip(buf);

          var zipEntries = zip.getEntries();

          var zipFolderName = filename.replace(".zip", "");

          logger.debug(zipFolderName)

          awaitId.then(function (idcargadte) {

            try {

              models.cargadte.update({
                horafin: new Date(),
                archivo: filename,
                estado: "CARGADO"
              }, {
                  where: {
                    id: idcargadte
                  }
                }).then(function (cargadte) {

                }).catch(function (err) {
                  logger.error(err)
                  res.json({ message: err, success: false });
                });

              processZipEntries(req, res, zipEntries, zipFolderName, 0, idcargadte);

              res.json({ message: "archivo cargado", success: true });

            }
            catch (err) {
              logger.error(err)
              res.json({ message: err, success: false });
            }

          }).catch(function (err) {
            logger.error(err)
            res.json({ message: err, success: false });
          });

        } else {

          res.json({ message: "El archivo no es ZIP", success: false });
        }

      });

    });

    req.pipe(busboy);

  }

}