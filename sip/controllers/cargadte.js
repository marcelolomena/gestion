var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
//var utilTime = require('../utils/time');
var logger = require("../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var async = require('async');
var AdmZip = require('adm-zip');
var stream = require('stream');
var et = require('elementtree');
const fileType = require('file-type');
var logtransaccion = require("../utils/logtransaccion");
var constants = require("../utils/constants");


exports.excel = function (req, res) {

  var conf = {}
  conf.cols = [
    {
      caption: 'CUI',
      type: 'number',
      width: 50
    },
    {
      caption: 'Cuenta',
      type: 'string',
      width: 50
    },
    {
      caption: 'Monto',
      type: 'number',
      width: 50
    }
  ];

  models.desgloseitemfactura.belongsTo(models.detallefactura, { foreignKey: 'iddetallefactura' });
  models.desgloseitemfactura.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
  models.desgloseitemfactura.belongsTo(models.cuentascontables, { foreignKey: 'idcuentacontable' });
  models.detallefactura.belongsTo(models.factura, { foreignKey: 'idfactura' });
  models.factura.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

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
            where: { id: req.params.id }, include: [{
              attributes: [['razonsocial', 'razonsocial']],
              model: models.proveedor,
            }]
          },
        ]
      }]
  }).then(function (desgloseitemfactura) {
    var rows = []
    for (var f in desgloseitemfactura) {
      console.log(desgloseitemfactura[f].estructuracui.cui)
      console.log(desgloseitemfactura[f].cuentascontable.nombrecuenta)
      console.log(desgloseitemfactura[f].cuentascontable.cuentacontable)
      console.log(desgloseitemfactura[f].detallefactura.factura.proveedor.razonsocial)
      var item = [
        //desgloseitemfactura[f].detallefactura.factura.proveedor.razonsocial,
        desgloseitemfactura[f].estructuracui.cui,
        //desgloseitemfactura[f].cuentascontable.nombrecuenta,
        desgloseitemfactura[f].cuentascontable.cuentacontable,
        desgloseitemfactura[f].montoneto,
        //desgloseitemfactura[f].ivanorecuperable,
        //desgloseitemfactura[f].montocosto
      ]
      rows.push(item);
    }

    conf.rows = rows;

    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformates');
    res.setHeader("Content-Disposition", "attachment;filename=" + "asiento_" + Math.floor(Date.now()) + ".xlsx");
    res.end(result, 'binary');

  }).catch(function (e) {
    logger.error(e);
    throw e;
  });

}

exports.list = function (req, res) {

  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;

  if (!sidx)
    sidx = "a.id";

  if (!sord)
    sord = "desc";

  var order = sidx + " " + sord;

  if (filters) {
    var jsonObj = JSON.parse(filters);
    /* if (JSON.stringify(jsonObj.rules) != '[]') {
       jsonObj.rules.forEach(function (item) {
           if (item.op === 'cn')
           if (item.field == 'nombre') {
             condition += 'c.' + item.field + " like '%" + item.data + "%' AND ";
           } else if (item.field == 'glosaservicio') {
             condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
           } 
       });
       condition = condition.substring(0, condition.length - 5);
       logger.debug("***CONDICION:" + condition);*/
  }

  sqlcount = "SELECT count(*) FROM sip.cargadte ";

  var sql = "SELECT a.*, (SELECT count(*) FROM sip.procesodte WHERE glosa = 'EXITO'  AND idcarga=a.id) AS exito, " +
    "(SELECT count(*) FROM sip.procesodte WHERE NOT glosa = 'EXITO'  AND idcarga=a.id) AS error " +
    "FROM sip.cargadte a JOIN sip.procesodte b ON a.id=b.idcarga";

  var sql = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rowspp + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, (SELECT count(*) FROM sip.procesodte WHERE glosa = 'EXITO'  AND idcarga=a.id) AS exito, " +
    "(SELECT count(*) FROM sip.procesodte WHERE NOT glosa = 'EXITO'  AND idcarga=a.id) AS error " +
    "FROM sip.cargadte a JOIN sip.procesodte b ON a.id=b.idcarga ORDER BY a.id desc) ";
  sql += "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

  logger.debug(sql);

  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    logger.debug("####COUNT:" + recs[0].count + " Total:" + total);
    sequelize.query(sql).spread(function (rows) {
      res.json({ records: records, total: total, page: page, rows: rows });
    });
  });

};

exports.items = function (req, res) {
  console.log("en if");
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

  if (req.params.id > 0) {
    var additional = [{
      "field": "idfactura",
      "op": "eq",
      "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
      if (err) {
        console.log("->>> " + err)
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
            return res.json({ records: records, total: total, page: page, rows: detallefactura });
          }).catch(function (err) {
            logger.error(e)
            res.json({ error_code: 1 });
          });
        })
      }
    });
  } else {
    res.json({ error_code: 1 });
  }
}

exports.detalle = function (req, res) {
  console.log("en detalle:" + req.params.id);
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
  if (req.params.id > 0) {
    var additional = [{
      "field": "idcarga",
      "op": "eq",
      "data": req.params.id
    }];

    models.procesodte.belongsTo(models.factura, { foreignKey: 'idfactura' });
    models.factura.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
      if (err) {
        console.log("->>> " + err)
      } else {
        return models.procesodte.count({
          where: data
        }).then(function (records) {
          var total = Math.ceil(records / rows);
          return models.procesodte.findAll({
            offset: parseInt(rows * (page - 1)),
            limit: parseInt(rows),
            order: orden,
            where: data,
            include: [
              {
                model: models.factura,

                include: [
                  {
                    model: models.proveedor
                  },
                ]
              },
            ]
          }).then(function (procesodte) {
            return res.json({ records: records, total: total, page: page, rows: procesodte });
          }).catch(function (err) {
            logger.error(e)
            res.json({ error_code: 1 });
          });
        })
      }
    });
  } else {
    res.json({ error_code: 1 });
  }
}

exports.guardar = function (req, res) {
  /*var uid = req.session.passport.user;
  var sql ="DECLARE @id INT;" + 
    "INSERT INTO sip.cargadte (horainicio,  usuario, estado, borrado) "+
    "VALUES (getdate(), "+uid+", 'EN PROCESO', 1);"+
    "select @id = @@IDENTITY; " +
    "select @id as id;";
                
  sequelize.query(sql)
    .spread(function (cargadte) {
      return res.json({ id: cargadte.id, message: 'inicio carga', success: true });
  }).catch(function (err) {
    logger.error(err)
    res.json({ id: 0, message: err, success: false });
  });*/
  //console.log("HORA UTC : " + utilTime.calcTime(-4))
  //console.log("HORA SYS : " + new Date())
  return models.cargadte.create({
    horainicio: sequelize.literal('CURRENT_TIMESTAMP'),
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

    var existPref = function (prefactura, callback) {
      var sql1 = "SELECT * FROM sip.prefactura WHERE id=" + prefactura
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            console.log("Existe prefactura:" + rows[0].id);
            callback(1); //Existe prefactura
          } else {
            callback(0); //No existe prefactura
          }
        }).catch(function (err) {
          logger.error(err);
          console.log(err);
          callback(-1);
        });

    }

    var montoEnRango = function (monto, prefactura, callback) {
      var sql1 = "SELECT valor FROM sip.parametro WHERE tipo='Factor Match Prefactura'";
      var sql2 = "SELECT * FROM sip.prefactura WHERE id=" + prefactura
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            console.log("Factor prefactura:" + rows[0].valor);
            var factor = rows[0].valor;
            sequelize.query(sql2).spread(function (rows2) {
              var totalpref = rows2[0].totalprefactura;
              var tolerancia = parseFloat(totalpref) * parseFloat(factor);
              console.log("Tolerancia:" + tolerancia + " monto:" + totalpref + " Factor:" + factor);
              var montomin = parseFloat(totalpref) - parseFloat(tolerancia);
              var montomax = parseFloat(totalpref) + parseFloat(tolerancia);
              console.log("Comparando:" + monto + " entre:" + montomin + " y " + montomax);
              if (parseFloat(monto) >= parseFloat(montomin) && parseFloat(monto) <= parseFloat(montomax)) {
                console.log("MOnto OK:");
                callback(1);
              } else {
                console.log("MOnto NOK:");
                callback(0);//Monto fuera de rango
              }
            }).catch(function (err) {
              logger.error(err);
              console.log(err);
              callback(-1);
            });
          } else {
            logger.error('No esta factor de tolerancia');
            console.log(err);
            callback(-1);
          }
        }).catch(function (err) {
          logger.error(err);
          console.log(err);
          callback(-1);
        });
    }

    var creaProcesoDTE = function (idcargadte, zipEntryName, estadomatch, factura, callback) {
      console.log("Grabando Detalle " + idcargadte + ", " + estadomatch);
      if (factura != -1) {
        return models.procesodte.create({
          idcarga: idcargadte,
          archivo: zipEntryName,
          glosa: estadomatch,
          idfactura: factura,
          borrado: 1
        }).then(function (procesodte) {
          console.log("REGISTRO DTE CREADO " + procesodte.id)
          callback(procesodte.idfactura);
        }).catch(function (err) {
          console.log("Error1:" + err);
          callback(err);
        });
      } else {
        return models.procesodte.create({
          idcarga: idcargadte,
          archivo: zipEntryName,
          glosa: estadomatch,
          idfactura: null,
          borrado: 1
        }).then(function (procesodte) {
          console.log("REGISTRO DTE CREADO " + procesodte.id)
          callback(procesodte.idfactura);
        }).catch(function (err) {
          console.log("Error1:" + err);
          callback(err);
        });
      }

    }

    var billHead = function (idcargadte, zipEntryName, FchEmis, Folio, RUTEmisor, RznSoc, MntTotal, MntExe, MntNeto, IVA, IdPrefactura) {
      //Todo: agregar idprefactura
      return new Promise(function (resolve, reject) {
        try {

          if (!RUTEmisor)
            throw new Error("Factura sin RUT")

          var _MntExe = (MntExe === undefined) ? 0 : MntExe;
          var _MntNeto = (MntNeto === undefined) ? 0 : MntNeto;
          var _IVA = (IVA === undefined) ? 0 : IVA;

          if (_MntExe === MntTotal)
            _MntNeto = MntTotal

          return models.sequelize.transaction({ autocommit: true }, function (t) {
            return models.proveedor.findOne({
              attributes: ['id'],
              where: { numrut: RUTEmisor.split("-")[0] }  //Todo:hacer find con idprefactura y monto
            }).then(function (proveedor) {
              console.log("PROVEEDOR ENCONTRADO " + proveedor)
              if (proveedor) {
                console.log("Buscando Factura:" + Folio);
                return models.factura.findOne({
                  attributes: ['id'],
                  where: { numero: Folio }
                }).then(function (factura) {
                  if (!factura) {
                    return models.factura.create({
                      numero: Folio,
                      idproveedor: proveedor.id,
                      fecha: FchEmis,
                      montoneto: _MntNeto,
                      impuesto: _IVA,
                      montototal: MntTotal,
                      ivanorecuperable: 0,
                      montocosto: 0,
                      ivacredito: 0,
                      borrado: 1
                    }, { transaction: t }).then(function (factura) {
                      console.log("FACTURA CREADA " + factura.id)
                      var estadomatch = "FRACASO"
                      existPref(IdPrefactura, function (prefactura) {
                        console.log("Existe prefactura:" + prefactura);
                        if (prefactura == 1) {
                          montoEnRango(MntTotal, IdPrefactura, function (monto) {
                            console.log("Match Monto:" + monto);
                            if (monto == 1) {
                              estadomatch = "EXITO";
                            } else if (monto = 0) {
                              estadomatch = "MONTO FUERA DE RANGO";
                            } else {
                              estadomatch = "ERROR MONTO";
                            }
                            creaProcesoDTE(idcargadte, zipEntryName, estadomatch, factura.id, function (prefactura) {
                              console.log("Grabo detalle");
                            });
                          });
                        } else if (prefactura == 0) {
                          estadomatch = "NO EXISTE PREFACTURA";
                          creaProcesoDTE(idcargadte, zipEntryName, estadomatch, factura.id, function (prefactura) {
                            console.log("Grabo detalle2");
                          });
                        } else {
                          estadomatch = "ERROR PREFACTURA";
                          creaProcesoDTE(idcargadte, zipEntryName, estadomatch, factura.id, function (prefactura) {
                            console.log("Grabo detalle3");
                          });
                        }
                      });
                      console.log("Glosa obtenida:" + estadomatch);
                      return factura.id;

                    }).catch(function (err) {
                      console.log("Error al crear factura:" + err)
                      throw new Error(err);
                    });
                  } else {
                    creaProcesoDTE(idcargadte, zipEntryName, "Factura Ya Existe", -1, function (prefactura) {
                      console.log("***************Factura Ya Existe");
                    });
                  }
                });
              } else {
                creaProcesoDTE(idcargadte, zipEntryName, "NO Existe Proveedor", -1, function (prefactura) {
                  console.log("Grabo detalle sin proveedor");
                });
              }

            }).catch(function (err) {
              console.log("Error al buscar RUT:" + err)
              throw new Error(err);
            });

          }).then(function (result) {
            console.log("ENCABEZADO CREADO " + result)
            resolve(result);
          }).catch(function (err) {
            logger.error(err);
            reject(err);
          });

        } catch (err) {
          reject(err);
        }
      })

    }

    var billDetails = function (idfactura, NmbItem, MontoItem, QtyItem) {

      return new Promise(function (resolve, reject) {
        try {
          console.log("GRABANDO : " + NmbItem)
          var ini = NmbItem.toUpperCase().indexOf("PF")

          return models.sequelize.transaction({ autocommit: true }, function (t) {

            if (ini > -1) {
              var r = /\d+/g, match, results = [];
              while ((match = r.exec(NmbItem.substring(ini + 2))) != null)
                results.push(match[0]);

              console.log("IDPREFACTURADTE : " + results[0] + " ID Fact:" + results[1]);

              if (results[0] != undefined) {

                models.solicitudaprobacion.belongsTo(models.prefactura, { foreignKey: 'idprefactura' });
                return models.solicitudaprobacion.findOne({
                  attributes: ['id', 'periodo'],
                  where: { idfacturacion: results[1] }, //Todo: colocar idfacturación en indice 1
                  include: [
                    {
                      attributes: [['impuesto', 'impuesto']],
                      model: models.prefactura
                    }
                  ],
                  transaction: t,
                }).then(function (solicitudaprobacion) {
                  if (!solicitudaprobacion) {

                    return models.detallefactura.create({
                      idfactura: idfactura,
                      idprefactura: null,
                      idfacturacion: null,
                      glosaservicio: NmbItem,
                      cantidad: QtyItem,
                      montonetoorigen: MontoItem,
                      montoneto: MontoItem,
                      montototal: 0,
                      impuesto: 0,
                      borrado: 1
                    }, { transaction: t }).then(function (f) {
                      return f.id;
                    }).catch(function (err) {
                      logger.error(err)
                      //return reject(err);
                    });
                    //throw new Error("No existe la prefactura " + results[0] + " en tabla solicitudaprobacion");
                  } else {
                    console.log("IDSOL : " + solicitudaprobacion.id);
                    console.log("PERIODO:" + solicitudaprobacion.periodo)
                    console.log("IMPUESTO:" + solicitudaprobacion.prefactura.dataValues.impuesto)

                    var periodo = solicitudaprobacion.periodo
                    var impuesto = solicitudaprobacion.prefactura.dataValues.impuesto != undefined ? MontoItem * solicitudaprobacion.prefactura.dataValues.impuesto : 0
                    /*
                                      return models.detallefactura.findAll({ where: { idfacturacion: solicitudaprobacion.id } }).then(function (detallefactura) {
                                        if (detallefactura) throw new Error("Ya exite esta prefactura")
                                      });
                    */
                    return models.detallefactura.create({
                      idfactura: idfactura,
                      idprefactura: results[0],
                      idfacturacion: solicitudaprobacion.id,
                      glosaservicio: NmbItem,
                      cantidad: QtyItem,
                      montonetoorigen: MontoItem,
                      montoneto: MontoItem,
                      montototal: MontoItem,
                      impuesto: impuesto,
                      borrado: 1
                    }, { transaction: t }).then(function (detallefactura) {

                      return models.desglosecontable.findOne({
                        attributes: ['idcui', 'idcuentacontable', 'porcentaje'],
                        where: { idsolicitud: solicitudaprobacion.id }
                      }).then(function (desglosecontable) {
                        console.log("DETALLEFACTURA  : " + detallefactura.id);
                        console.log("IDCUI  : " + desglosecontable.idcui);
                        console.log("IDCUENTACONTABLE  : " + desglosecontable.idcuentacontable);
                        console.log("PORCENTAJE  : " + desglosecontable.porcentaje);

                        return models.factoriva.findOne({
                          attributes: ['factorrecuperacion'],
                          where: { periodo: periodo },
                          transaction: t,
                        }).then(function (factoriva) {

                          console.log("factorrecuperacion  : " + factoriva.factorrecuperacion);
                          var factorrecuperacion = factoriva.factorrecuperacion

                          return models.desgloseitemfactura.sum('impuesto', { where: { iddetallefactura: detallefactura.id } }).then(function (monto1) {
                            return models.desgloseitemfactura.sum('ivanorecuperable', { where: { iddetallefactura: detallefactura.id } }).then(function (monto2) {
                              return models.desgloseitemfactura.sum('montocosto', { where: { iddetallefactura: detallefactura.id } }).then(function (monto3) {
                                return models.desgloseitemfactura.sum('ivacredito', { where: { iddetallefactura: detallefactura.id } }).then(function (monto4) {
                                  return models.desgloseitemfactura.create({
                                    iddetallefactura: detallefactura.id,
                                    idcui: desglosecontable.idcui,
                                    idcuentacontable: desglosecontable.idcuentacontable,
                                    porcentaje: desglosecontable.porcentaje,
                                    montoneto: (desglosecontable.porcentaje * MontoItem) / 100,
                                    impuesto: (desglosecontable.porcentaje * impuesto) / 100,
                                    ivanorecuperable: (desglosecontable.porcentaje * impuesto / 100) * factorrecuperacion,
                                    montocosto: (desglosecontable.porcentaje * MontoItem / 100) + (desglosecontable.porcentaje * impuesto / 100) * factorrecuperacion,
                                    ivacredito: (desglosecontable.porcentaje * impuesto / 100) * (1 - factorrecuperacion),
                                    montototal: MontoItem * desglosecontable.porcentaje / 100 + impuesto * desglosecontable.porcentaje / 100,
                                    borrado: 1
                                  }, { transaction: t }).then(function (desgloseitemfactura) {

                                    if (!monto1)
                                      monto1 = 0
                                    else
                                      console.log("monto1  : " + monto1);
                                    if (!monto2)
                                      monto2 = 0
                                    else
                                      console.log("monto1  : " + monto2);
                                    if (!monto3)
                                      monto3 = 0
                                    else
                                      console.log("monto1  : " + monto3);
                                    if (!monto4)
                                      monto4 = 0
                                    else
                                      console.log("monto1  : " + monto4);

                                    monto1 = monto1 + desgloseitemfactura.impuesto
                                    monto2 = monto2 + desgloseitemfactura.ivanorecuperable
                                    monto3 = monto3 + desgloseitemfactura.montocosto
                                    monto4 = monto4 + desgloseitemfactura.ivacredito

                                    console.log("pmonto1  : " + monto1);
                                    console.log("pmonto2  : " + monto2);
                                    console.log("pmonto3  : " + monto3);
                                    console.log("pmonto4  : " + monto4);

                                    detallefactura.ivanorecuperable = monto1
                                    detallefactura.impuesto = monto2
                                    detallefactura.montocosto = monto3
                                    detallefactura.ivacredito = monto4

                                    return detallefactura.save({ transaction: t }).then(function (detf) {

                                      return models.factura.find({
                                        where: { id: idfactura }
                                      }).then(function (bill) {
                                        console.log("fact.ivanorecuperable : " + bill.ivanorecuperable)
                                        console.log("fact.montocosto : " + bill.montocosto)
                                        console.log("fact.ivacredito : " + bill.ivacredito)

                                        return models.factura.update({
                                          ivanorecuperable: bill.ivanorecuperable + monto2,
                                          montocosto: bill.montocosto + monto3,
                                          ivacredito: bill.ivacredito + monto4
                                        }, {
                                            where: {
                                              id: idfactura
                                            }
                                          }).then(function (f) {

                                            return models.prefactura.update({ factura: results[0] }, { where: { id: results[0] } }).then(function (tet) {
                                              return resolve(detallefactura.id);
                                            }).catch(function (err) {
                                              throw new Error(err);
                                            });

                                          }).catch(function (err) {
                                            throw new Error(err);
                                          });

                                      }).catch(function (err) {
                                        throw new Error(err);
                                      });
                                    }).catch(function (err) {
                                      throw new Error(err);
                                    });

                                  })
                                })
                              })
                            })

                          }).catch(function (err) {
                            throw new Error(err);
                          });

                        }).catch(function (err) {
                          throw new Error(err);
                        });

                      }).catch(function (err) {
                        throw new Error(err);
                      });

                    }).catch(function (err) {
                      throw new Error(err);
                    });
                  }
                }).catch(function (err) {
                  throw new Error(err);
                });

              } else {
                console.log("no matching")
              }

            } else {

              return models.detallefactura.create({
                idfactura: idfactura,
                idprefactura: null,
                idfacturacion: null,
                glosaservicio: NmbItem,
                cantidad: QtyItem,
                montonetoorigen: MontoItem,
                montoneto: MontoItem,
                montototal: 0,
                impuesto: 0,
                borrado: 1
              }, { transaction: t }).then(function (f) {
                return f.id;
              }).catch(function (err) {
                logger.error(err)
                return reject(err);
              });
            }

          }).then(function (result) {
            resolve(result);
          }).catch(function (err) {
            console.log("se fue por aca")
            //logger.error(err);
            reject(err);
          });

        } catch (err) {
          reject(err);
        }
      });
    }

    var processZipEntries = function (req, res, zipEntries, zipFolderName, i, idcarga, callback) {

      try {
        console.log("VUELTA " + i)
        var bufferStream = new stream.PassThrough();
        var zipEntryName, data, etree;

        if (i < zipEntries.length) {
          var zipEntry = zipEntries[i];
          var zipEntryData = zipEntry.getData();
          var data = zipEntryData.toString('utf8');
          etree = et.parse(data);

          //var lstDet = etree.findall('*/Documento/Detalle')
          //var FchEmis = etree.findtext('*/Documento/Encabezado/IdDoc/FchEmis')
          //var Folio = etree.findtext('*/Documento/Encabezado/IdDoc/Folio')
          //var RUTEmisor = etree.findtext('*/Documento/Encabezado/Emisor/RUTEmisor')
          //var RznSoc = etree.findtext('*/Documento/Encabezado/Emisor/RznSoc')
          //var MntTotal = etree.findtext('*/Documento/Encabezado/Totales/MntTotal')
          //var MntExe = etree.findtext('*/Documento/Encabezado/Totales/MntExe')
          //var MntNeto = etree.findtext('*/Documento/Encabezado/Totales/MntNeto')
          //var IVA = etree.findtext('*/Documento/Encabezado/Totales/IVA')
          var lstDet = etree.findall('./Documento/Detalle')
          var FchEmis = etree.findtext('./Documento/Encabezado/IdDoc/FchEmis')
          var Folio = etree.findtext('./Documento/Encabezado/IdDoc/Folio')
          var RUTEmisor = etree.findtext('./Documento/Encabezado/Emisor/RUTEmisor')
          var RznSoc = etree.findtext('./Documento/Encabezado/Emisor/RznSoc')
          var MntTotal = etree.findtext('./Documento/Encabezado/Totales/MntTotal')
          var MntExe = etree.findtext('./Documento/Encabezado/Totales/MntExe')
          var MntNeto = etree.findtext('./Documento/Encabezado/Totales/MntNeto')
          var IVA = etree.findtext('./Documento/Encabezado/Totales/IVA')


          console.log("FchEmis : " + FchEmis);
          console.log("Folio : " + Folio);
          console.log("RUTEmisor : " + RUTEmisor);
          console.log("RznSoc : " + RznSoc);
          console.log("MntTotal : " + MntTotal);

          zipEntryName = getZipEntryName(zipEntry, zipFolderName);
          console.log("Agregar este dte a la base de datos >> " + zipEntryName);

          //Todo: hacer find de primer numero de prefactura y enviarlo como parametro
          var PrimerItem = lstDet[0].findtext('NmbItem');
          var ini = PrimerItem.toUpperCase().indexOf("PF");
          var r = /\d+/g, match, results = [];
          while ((match = r.exec(PrimerItem.substring(ini + 2))) != null)
            results.push(match[0]);

          console.log("Prefactura Item 1 : " + results[0]);

          if (results[0] != undefined) {//encuentra numero de prefactura   
            var IdPrefactura = results[0];
            billHead(idcarga, zipEntryName, FchEmis, Folio, RUTEmisor, RznSoc, MntTotal, MntExe, MntNeto, IVA, IdPrefactura).then(function (idfactura) {
              console.log("IDFACTURA : " + idfactura);
              if (idfactura) {
                for (var i = 0; i < lstDet.length; i++) {
                  var NmbItem = lstDet[i].findtext('NmbItem')
                  var MontoItem = lstDet[i].findtext('MontoItem')
                  var QtyItem = lstDet[i].findtext('QtyItem')
                  billDetails(idfactura, NmbItem, MontoItem, QtyItem).then(function (iddetalle) {
                    console.log("IDDETALLEFACTURA : " + iddetalle);
                  }).catch(function (err) {
                    console.log("salio por aqui")
                    logger.error(err)
                    //throw new Error(err);
                  });
                }
              } else {
                  console.log("Termina OK, factura id no existe");
              }
            }).catch(function (err) {
              logger.error(err)
              throw new Error(err);
            });

            bufferStream.end(zipEntryData);
            console.log("recursiva")
            processZipEntries(req, res, zipEntries, zipFolderName, i + 1, idcarga, callback);
          } else {
            creaProcesoDTE(idcarga, zipEntryName, "NO Contiene Id Prefactura", -1, function (prefactura) {
              console.log("Grabo detalle sin prefactura:" + idcarga + ", " + zipEntryName);
            });
            processZipEntries(req, res, zipEntries, zipFolderName, i + 1, idcarga, callback);
            //Todo:Ver que hacer si numero prefactura es undefined
          }
        } else {
          // EL ULTIMO DTE?
          callback(undefined, i);
        }

      } catch (e) {
        logger.error(e)
        return callback(e, undefined);
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
    
    var datavacia = [{ 'sin datos': '' }];
    logtransaccion.registrar(
        constants.IniciaCargaDTE,
        0,
        'insert',
        req.session.passport.user,
        'model',
        datavacia,
        function (err, data) {
            if (err) {
                logger.error(err)
                return res.json({ error_code: 1 });
            }
        });    

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

      console.log(filename)
      var data = [], dataLen = 0;
	  
	  //RRM:Guarda archivo en, codigo para poder subir el discovery y procesarlo
	  var saveTo = path.join(__dirname, '../docs/', 'discover', filename);
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
	  
	  //Este return es solo para cortar el avance y dejar solo el upload.
	  return res.json({ message: "archivo " + filename + " cargado", success: true });
	  
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

        //var ext = validateZip(buf);
        //console.log("EXTENSION : " + ext);

        //       if (ext === "zip") {

        var zip = new AdmZip(buf);

        var zipEntries = zip.getEntries();

        var zipFolderName = filename.replace(".zip", "");

        console.log(zipFolderName)

        awaitId.then(function (idcargadte) {

          try {

            processZipEntries(req, res, zipEntries, zipFolderName, 0, idcargadte, function (err, data) {

              if (!err) {
                return models.cargadte.update({
                  horafin: new Date(),
                  archivo: filename,
                  estado: "CARGADO OK"
                }, {
                    where: {
                      id: idcargadte
                    }
                  }).then(function (cargadte) {
                    logtransaccion.registrar(
                        constants.FinExitoCargaDTE,
                        0,
                        'insert',
                        req.session.passport.user,
                        'model',
                        datavacia,
                        function (err, data) {
                            if (err) {
                                logger.error(err)
                                return res.json({ error_code: 1 });
                            }
                        });                    
                    return res.json({ message: "archivo " + filename + " cargado", success: true });
                  }).catch(function (err) {
                    logtransaccion.registrar(
                        constants.FinErrorCargaDTE,
                        0,
                        'insert',
                        req.session.passport.user,
                        'model',
                        datavacia,
                        function (err, data) {
                            if (err) {
                                logger.error(err)
                                return res.json({ error_code: 1 });
                            }
                        });                    
                    logger.error(err)
                    return res.json({ message: err, success: false });
                  });
              } else {
                return models.cargadte.update({
                  horafin: new Date(),
                  archivo: filename,
                  estado: err
                }, {
                    where: {
                      id: idcargadte
                    }
                  }).then(function (cargadte) {
                    return res.json({ message: "archivo " + filename + " cargado", success: true });
                  }).catch(function (err) {
                    logger.error(err)
                    return res.json({ message: err, success: false });
                  });
              }

            });

          }
          catch (err) {
            logger.error(err)
            res.json({ message: err, success: false });
          }

        }).catch(function (err) {
          logger.error(err)
          res.json({ message: err, success: false });
        });
        /*
                } else {
        
                  res.json({ message: "El archivo no es ZIP", success: false });
                }
        */
      });

    });

    req.pipe(busboy);

  }

}
