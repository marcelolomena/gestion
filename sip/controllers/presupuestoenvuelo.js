var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var logtransaccion = require("../utils/logtransaccion");
var constants = require("../utils/constants");


exports.getPersonal = function (req, res) {

  var term = req.query.term;

  var sql = "SELECT LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ) value," +
    "RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)) label " +
    "FROM RecursosHumanos WHERE LEN(emailTrab) != 1 AND " +
    "periodo=(select max(periodo) from RecursosHumanos) AND " +
    "nombre+apellido like '%" + term + "%' order by nombre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getDivisiones = function (req, res) {

  var sql = "select * from art_division_master " +
    "where is_deleted=0 order by division";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.get = function (req, res) {
  models.presupuestoenvuelo.find({ where: { 'id': req.params.id } }).then(function (iniciativa) {
    res.json(iniciativa);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
};

exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var condition = "";
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombreproyecto";

  if (!sord)
    sord = "asc";


  var order = sidx + " " + sord;

  var filter_one = []
  var filter_two = []

  if (filters != undefined) {
    //logger.debug(filters)
    var item = {}
    var jsonObj = JSON.parse(filters);

    jsonObj.rules.forEach(function (item) {
      if (item.field === "sap") {
        filter_one.push({ [item.field]: item.data });
      } else if (item.field === "first_name") {
        filter_two.push({ [item.field]: { $like: '%' + item.data + '%' } });
      } else if (item.field === "nombreproyecto") {
        filter_one.push({ [item.field]: { $like: '%' + item.data + '%' } });
      }
    })
    filter_one.push({ borrado: 1 })
  }

  models.presupuestoenvuelo.belongsTo(models.user, { as: 'lider', foreignKey: 'uidlider' });
  models.presupuestoenvuelo.belongsTo(models.user, { as: 'jefe', foreignKey: 'uidjefeproyecto' });
  models.presupuestoenvuelo.belongsTo(models.user, { as: 'pmo', foreignKey: 'uidpmoresponsable' });
  models.presupuestoenvuelo.belongsTo(models.programa, { foreignKey: 'program_id' });

  return utilSeq.buildConditionFilter(filters, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {

      return models.presupuestoenvuelo.count({
        where: filter_one,
        include: [
          {
            attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
            model: models.user, as: 'lider'
          },
          {
            attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
            model: models.user, as: 'jefe'
          },
          {
            attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
            model: models.user, as: 'pmo', where: filter_two,
          },
          {
            model: models.programa
          }
        ],
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        return models.presupuestoenvuelo.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          //order: 'horainicio desc',
          where: filter_one,
          //attributes: [
          //  [sequelize.fn('DISTINCT', sequelize.col('nombrepmo')), 'nombrepmo']
          //],
          order: 'nombreproyecto asc',
          include: [
            {
              attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
              model: models.user, as: 'lider'
            },
            {
              attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
              model: models.user, as: 'jefe'
            },
            {
              attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
              model: models.user, as: 'pmo', where: filter_two, required: false
            },
            {
              model: models.programa
            }
          ],

        }).then(function (presupuestoenvuelo) {
          return res.json({ records: records, total: total, page: page, rows: presupuestoenvuelo });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}

exports.combobox = function (req, res) {
  models.iniciativa.findAll({
    order: 'nombre'
  }).then(function (iniciativas) {
    //iniciativas.forEach(log)
    res.json(iniciativas);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
}

exports.combobox = function (req, res) {
  models.iniciativa.findAll({
    order: 'nombre'
  }).then(function (iniciativas) {
    //iniciativas.forEach(log)
    res.json(iniciativas);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
}
/*
exports.generarproyectoenvuelo = function (req, res) {
 
  var insertaTareas = function (idpresupuestoenvuelocreado, tareasnuevosproyectos, callback) {
 
    models.sequelize.transaction({ autocommit: true }, function (t) {
      var promises = []
      for (var i = 0; i < tareasnuevosproyectos.length; i++) {
 
        var newPromise = models.tareaenvuelo.create({
          'idpresupuestoenvuelo': idpresupuestoenvuelocreado,
          'glosa': tareasnuevosproyectos[i].glosa,
          'idcui': tareasnuevosproyectos[i].idcui,
          'idservicio': tareasnuevosproyectos[i].idservicio,
          'idproveedor': tareasnuevosproyectos[i].idproveedor,
          'tarea': tareasnuevosproyectos[i].tarea,
          'idtipopago': tareasnuevosproyectos[i].idtipopago,
          'fechainicio': tareasnuevosproyectos[i].fechainicio,
          'fechafin': tareasnuevosproyectos[i].fechafin,
          'reqcontrato': tareasnuevosproyectos[i].reqcontrato,
          'idmoneda': tareasnuevosproyectos[i].idmoneda,
          'costounitario': tareasnuevosproyectos[i].costounitario,
          'cantidad': tareasnuevosproyectos[i].cantidad,
          'coniva': tareasnuevosproyectos[i].coniva,
          'numerocontrato': null,
          'numerosolicitudcontrato': null,
          'borrado': 1, 'pending': true
        }, { transaction: t });
 
        promises.push(newPromise);
      };
      return Promise.all(promises).then(function (compromisos) {
        var compromisoPromises = [];
        for (var i = 0; i < compromisos.length; i++) {
          compromisoPromises.push(compromisos[i]);
        }
        return Promise.all(compromisoPromises);
      });
 
    }).then(function (tareaenvuelo) {
      callback(tareaenvuelo)
    }).catch(function (err) {
      logger.debug("--------> " + err);
    });
  }
 
 
  var insertaFlujos = function (flujonuevatarea, tareaenvuelo, callback) {
 
    models.sequelize.transaction({ autocommit: true }, function (t) {
      var promises = []
 
      for (var k = 0; k < flujonuevatarea.length; k++) {
 
        var newPromise = models.flujopagoenvuelo.create({
          'idtareaenvuelo': tareaenvuelo.id,
          'periodo': flujonuevatarea[k].periodo,
          'costoorigen': flujonuevatarea[k].costoorigen,
          'glosaitem': flujonuevatarea[k].glosaitem,
          'porcentaje': flujonuevatarea[k].porcentaje,
          'idtipopago': flujonuevatarea[k].idtipopago,
          'fechainicio': flujonuevatarea[k].fechainicio,
          'fechafin': flujonuevatarea[k].fechafin,
          'cantidad': flujonuevatarea[k].cantidad,
          'borrado': 1, 'pending': true
        }, { transaction: t });
        promises.push(newPromise);
      }
 
 
 
      return Promise.all(promises).then(function (compromisos) {
        var compromisoPromises = [];
        for (var i = 0; i < compromisos.length; i++) {
          compromisoPromises.push(compromisos[i]);
        }
        return Promise.all(compromisoPromises);
      });
 
    }).then(function (flujopagoenvuelo) {
      callback(flujopagoenvuelo)
    }).catch(function (err) {
      logger.debug("--------> " + err);
    });
  }
 
 
 
 
 
 
  var idpresupuestoenvuelocreado;
  var idtareaenvuelocreada;
  models.presupuestoiniciativa.belongsTo(models.iniciativaprograma, { foreignKey: 'idiniciativaprograma' });
  models.presupuestoiniciativa.find({
    where: { id: req.params.id },
    include: [{ model: models.iniciativaprograma }]
  }).then(function (presupuestoiniciativa) {
    console.dir(presupuestoiniciativa);
    models.presupuestoenvuelo.create({
      nombreproyecto: presupuestoiniciativa.glosa,
      sap: presupuestoiniciativa.sap,
      program_id: presupuestoiniciativa.iniciativaprograma.program_id,
      cuifinanciamiento1: presupuestoiniciativa.cuifinanciamiento1,
      porcentaje1: presupuestoiniciativa.porcentaje1,
      cuifinanciamiento2: presupuestoiniciativa.cuifinanciamiento2,
      porcentaje2: presupuestoiniciativa.porcentaje2,
      beneficioscuantitativos: presupuestoiniciativa.beneficioscuantitativos,
      beneficioscualitativos: presupuestoiniciativa.beneficioscualitativos,
      uidlider: presupuestoiniciativa.uidlider,
      uidjefeproyecto: presupuestoiniciativa.uidjefeproyecto,
      uidpmoresponsable: null,
      dolar: presupuestoiniciativa.dolar,
      uf: presupuestoiniciativa.uf,
      fechaconversion: presupuestoiniciativa.fechaconversion,
      borrado: 1
    }).then(function (presupuestoenvuelo) {
      idpresupuestoenvuelocreado = presupuestoenvuelo.id;
      models.tareasnuevosproyectos.findAll({
        where: { idpresupuestoiniciativa: req.params.id }
      }).then(function (tareasnuevosproyectos) {
        
        insertaTareas(idpresupuestoenvuelocreado, tareasnuevosproyectos, function (tareaenvuelo) {
          console.dir(tareaenvuelo)
 
          for (var j = 0; j < tareasnuevosproyectos.length; j++) {
 
            var sql = "select * from sip.flujonuevatarea " +
              "where idtareasnuevosproyectos=" + tareasnuevosproyectos[j].id;
 
            sequelize.query(sql)
              .spread(function (flujonuevatarea) {
                insertaFlujos(flujonuevatarea, tareaenvuelo[j], function (flujopagoenvuelo) {
                  console.dir(flujopagoenvuelo)
                })
 
              });
 
            
          }
 
 
 
        })
      });
      res.json(presupuestoenvuelo);
    }).catch(function (err) {
      logger.debug(err);
      res.json({ error_code: 1 });
    });
  })
 
}
*/

exports.generarproyectoenvuelo = function (req, res) {
  sequelize.query('EXECUTE sip.generarproyectoenvuelo ' +
    req.params.id).then(function (response) {
      logger.debug("****Ejecutando SP sip.generarproyectoenvuelo");
      console.dir(response);
      res.json(response)
    }).error(function (err) {
      res.json(err);
    });
}

exports.action = function (req, res) {
  var action = req.body.oper;
  var porcentaje1, porcentaje2, dolar, uf = 0.00
  var fecha;

  if (action != "del") {
    if (req.body.porcentaje1 != "") {
      //porcentaje1 = req.body.porcentaje1.split(".").join("").replace(",", ".");
      porcentaje1 = parseFloat(req.body.porcentaje1) / 100;
    } else {
      porcentaje1 = 0.00;
    }

    if (req.body.porcentaje2 != "") {
      //porcentaje2 = req.body.porcentaje2.split(".").join("").replace(",", ".");
      porcentaje2 = parseFloat(req.body.porcentaje2) / 100;
    } else {
      porcentaje2 = 0.00;
    }
    /*
        if (req.body.dolar != "")
          dolar = req.body.dolar.split(".").join("").replace(",", ".")
    
        if (req.body.uf != "")
          uf = req.body.uf.split(".").join("").replace(",", ".")
    
        if (req.body.fechaconversion != "")
          fecha = req.body.fechaconversion.split("-").reverse().join("-")
    
        */
  }
  switch (action) {
    case "add":
      models.presupuestoenvuelo.create({
        nombreproyecto: req.body.nombreproyecto,
        sap: req.body.sap,
        program_id: req.body.program_id,
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.uidlider,
        uidjefeproyecto: req.body.uidjefeproyecto,
        uidpmoresponsable: req.body.uidpmoresponsable,
        //dolar: dolar,
        //uf: uf,
        //fechaconversion: fecha,
        borrado: 1
      }).then(function (iniciativa) {
        logtransaccion.registrar(
          constants.CreaProyecto,
          iniciativa.id,
          'insert',
          req.session.passport.user,
          'presupuestoenvuelo',
          iniciativa,
          function (err, data) {
            if (!err) {
              res.json({ error_code: 0 });
            } else {
              logger.error(err)
              return res.json({ error_code: 1 });
            }
          });
        //res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
      logtransaccion.registrar(
        constants.ActualizaProyecto,
        req.body.id,
        'update',
        req.session.passport.user,
        models.presupuestoenvuelo,
        req.body,
        function (err, idlog) {
          if (!err) {
            models.presupuestoenvuelo.update({
              nombreproyecto: req.body.nombreproyecto,
              sap: req.body.sap,
              program_id: req.body.program_id,
              cuifinanciamiento1: req.body.cuifinanciamiento1,
              porcentaje1: porcentaje1,
              cuifinanciamiento2: req.body.cuifinanciamiento2,
              porcentaje2: porcentaje2,
              beneficioscuantitativos: req.body.beneficioscuantitativos,
              beneficioscualitativos: req.body.beneficioscualitativos,
              uidlider: req.body.uidlider,
              uidjefeproyecto: req.body.uidjefeproyecto,
              uidpmoresponsable: req.body.uidpmoresponsable,
              //dolar: dolar,
              //uf: uf,
              //fechaconversion: req.body.fecha,
            }, {
                where: {
                  id: req.body.id
                }
              }).then(function (contrato) {
                logtransaccion.actualizar(idlog, req.body.id, models.presupuestoenvuelo,
                  function (err, idlog) {
                    if (!err) {
                      res.json({ error_code: 0 });
                    } else {
                      logger.error(err)
                      return res.json({ error_code: 1 });
                    }
                  });
                //res.json({ error_code: 0 });
              }).catch(function (err) {
                logger.error(err);
                res.json({ error_code: 1 });
              });
          } else {
            logger.error(err)
            return res.json({ error_code: 1 });
          }
        });
      break;
    case "del":
      logtransaccion.registrar(
        constants.BorraProyecto,
        req.body.id,
        'delete',
        req.session.passport.user,
        models.presupuestoenvuelo,
        req.body,
        function (err, data) {
          if (!err) {
            models.presupuestoenvuelo.destroy({
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
          } else {
            logger.error(err)
            return res.json({ error_code: 1 });
          }
        });
      break;

  }

}

exports.comboboxpmo = function (req, res) {
  models.presupuestoenvuelo.belongsTo(models.art_user, { foreignKey: 'uidlider' });
  models.presupuestoenvuelo.belongsTo(models.art_user, { as: 'idjefepro', foreignKey: 'uidjefeproyecto' });
  models.presupuestoenvuelo.belongsTo(models.art_user, { as: 'idpmo', foreignKey: 'uidpmoresponsable' });
  models.presupuestoenvuelo.belongsTo(models.art_program, { foreignKey: 'program_id' });
  models.presupuestoenvuelo.findAll({
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('nombrepmo')), 'nombrepmo']
    ],
    order: 'nombrepmo',
    include: [
      {
        model: models.art_user
      },
      {
        model: models.art_user, as: 'idjefepro'
      },
      {
        model: models.art_user, as: 'idpmo'
      },
      {
        model: models.art_program
      }
    ],
  }).then(function (presupuestoenvuelo) {
    //iniciativas.forEach(log)
    res.json(presupuestoenvuelo);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
}

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  logger.debug("En getExcel");
  //nombreproyecto, sap, program_id, cuifinanciamiento1, porcentaje1, cuifinanciamiento2, 
  //porcentaje2, beneficioscuantitativos, beneficioscualitativos, lider, jp, responsable, 
  //dolar, uf, fechaconversion, idpresupuestoenvuelo, cui, servicio, proveedor, tarea, glosa, 
  //TipoPago, fechainicio, fechafin, reqcontrato, moneda, costounitario, cantidad, coniva, 
  //numerocontrato, numerosolicitudcontrato, extension, idflujo,idtareaenvuelo, subtarea, periodo, 
  //porcentaje, glosaitem, idtipopago, montoorigen, montopesos, costoorigen, costopesos
  var conf = {}
  conf.cols = [{
    caption: 'Id SAP',
    type: 'number',
    width: 3
  },
    {
      caption: 'Nombre Proyecto',
      type: 'string',
      width: 100
    },
    {
      caption: 'SAP',
      type: 'number',
      width: 40
    },
    {
      caption: 'Id Programa',
      type: 'number',
      width: 40
    },
    {
      caption: 'CUI Financiamiento1',
      type: 'number',
      width: 20
    },
    {
      caption: 'Porcentaje1',
      type: 'number',
      width: 10
    },
    {
      caption: 'CUI Financiamiento2',
      type: 'number',
      width: 15
    },
    {
      caption: 'Porcentaje2',
      type: 'number',
      width: 15
    },
    {
      caption: 'Beneficios Cuantitativos',
      type: 'string',
      width: 15
    },
    {
      caption: 'Beneficios Cualitativos',
      type: 'string',
      width: 30
    },
    {
      caption: 'Lider',
      type: 'string',
      width: 30
    },
    {
      caption: 'JP',
      type: 'string',
      width: 30
    },
    {
      caption: 'Responsable',
      type: 'string',
      width: 30
    },
    {
      caption: 'Dolar',
      type: 'number',
      width: 30
    },
    {
      caption: 'UF',
      type: 'number',
      width: 30
    },
    {
      caption: 'Fecha Conversion',
      type: 'string',
      width: 30
    },
    {
      caption: 'IdTarea',
      type: 'number',
      width: 30
    },    
    {
      caption: 'Id Presupuesto En Vuelo',
      type: 'number',
      width: 30
    },
    {
      caption: 'CUI',
      type: 'number',
      width: 30
    },
    {
      caption: 'Servicio',
      type: 'string',
      width: 30
    },
    {
      caption: 'Proveedor',
      type: 'string',
      width: 30
    },
    {
      caption: 'Tarea',
      type: 'string',
      width: 30
    },
    {
      caption: 'Glosa',
      type: 'string',
      width: 30
    },
    {
      caption: 'Tipo Pago',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fecha Inicio',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fecha Fin',
      type: 'string',
      width: 30
    },
    {
      caption: 'Req Contrato',
      type: 'number',
      width: 30
    },
    {
      caption: 'Moneda',
      type: 'string',
      width: 30
    },
    {
      caption: 'Costo Unitario',
      type: 'number',
      width: 30
    },
    {
      caption: 'Cantidad',
      type: 'number',
      width: 30
    },
    {
      caption: 'Con IVA',
      type: 'number',
      width: 30
    },
    {
      caption: 'Numero Contrato',
      type: 'string',
      width: 30
    },
    {
      caption: 'Numero Solicitud Contrato',
      type: 'string',
      width: 30
    },
    {
      caption: 'Extension',
      type: 'number',
      width: 30
    },
    {
      caption: 'Id Flujo',
      type: 'number',
      width: 30
    },
    {
      caption: 'Id Tareaenvuelo',
      type: 'number',
      width: 30
    },
    {
      caption: 'Subtarea',
      type: 'string',
      width: 30
    },
    {
      caption: 'Periodo',
      type: 'number',
      width: 30
    },
    {
      caption: 'Porcentaje',
      type: 'number',
      width: 30
    },    
    {
      caption: 'Glosaitem',
      type: 'string',
      width: 30
    },
    {
      caption: 'Id Tipopago',
      type: 'number',
      width: 30
    },
    {
      caption: 'Monto Origen',
      type: 'number',
      width: 30
    },
    {
      caption: 'Monto Pesos',
      type: 'number',
      width: 30
    },
    {
      caption: 'Costo Origen',
      type: 'number',
      width: 30
    },
    {
      caption: 'Costo Pesos',
      type: 'number',
      width: 30
    }
  ];

  var sql = `SELECT a.id IdSAP, nombreproyecto, a.sap, a.program_id, a.cuifinanciamiento1, a.porcentaje1, a.cuifinanciamiento2, 
  a.porcentaje2, a.beneficioscuantitativos, a.beneficioscualitativos, d.first_name+' '+d.last_name lider,  
  e.first_name+' '+e.last_name jp, f.first_name+' '+f.last_name responsable, a.dolar, a.uf, convert(VARCHAR(10), a.fechaconversion,105) fechaconversion,
  b.id IdTarea, b.idpresupuestoenvuelo, g.cui, h.nombre servicio, i.razonsocial proveedor, b.tarea, b.glosa, 
  j.nombre TipoPago,convert(VARCHAR(10), b.fechainicio,105) fechainicio , convert(VARCHAR(10), b.fechafin,105) fechafin , b.reqcontrato, k.moneda, 
  b.costounitario, b.cantidad, b.coniva, b.numerocontrato, b.numerosolicitudcontrato, b.extension,
  c.id IdFlujo, c.idtareaenvuelo, l.title subtarea, c.periodo, c.porcentaje, c.glosaitem, c.idtipopago, 
  c.montoorigen, c.montopesos, c.costoorigen, c.costopesos
  FROM sip.presupuestoenvuelo a
  LEFT JOIN sip.tareaenvuelo b ON a.id=b.idpresupuestoenvuelo
  LEFT JOIN sip.flujopagoenvuelo c ON b.id=c.idtareaenvuelo
  LEFT JOIN art_user d ON a.uidlider=d.uid
  LEFT JOIN art_user e ON a.uidpmoresponsable=e.uid
  LEFT JOIN art_user f ON a.uidjefeproyecto=e.uid
  LEFT JOIN sip.estructuracui g ON b.idcui=g.id
  LEFT JOIN sip.servicio h ON b.idservicio=h.id
  LEFT JOIN sip.proveedor i ON b.idproveedor=i.id
  LEFT JOIN sip.parametro j ON b.idtipopago=j.id
  LEFT JOIN sip.moneda k ON b.idmoneda=k.id
  LEFT JOIN art_sub_task l ON l.sub_task_id=c.idsubtarea
  `
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [proyecto[i].IdSAP, proyecto[i].nombreproyecto,
          proyecto[i].sap,
          proyecto[i].program_id,
          proyecto[i].cuifinanciamiento1,
          proyecto[i].porcentaje1,
          proyecto[i].cuifinanciamiento2,
          proyecto[i].porcentaje2,
          proyecto[i].beneficioscuantitativos,
          proyecto[i].beneficioscualitativos,
          proyecto[i].lider,
          proyecto[i].jp,
          proyecto[i].responsable,
          proyecto[i].dolar,
          proyecto[i].uf,
          proyecto[i].fechaconversion,
          proyecto[i].IdTarea,          
          proyecto[i].idpresupuestoenvuelo,
          proyecto[i].cui,
          proyecto[i].servicio,
          proyecto[i].proveedor,
          proyecto[i].tarea,
          proyecto[i].glosa,
          proyecto[i].TipoPago,
          proyecto[i].fechainicio,
          proyecto[i].fechafin,
          proyecto[i].reqcontrato,
          proyecto[i].moneda,
          proyecto[i].costounitario,
          proyecto[i].cantidad,
          proyecto[i].coniva,
          proyecto[i].numerocontrato,
          proyecto[i].numerosolicitudcontrato,
          proyecto[i].extension,
          proyecto[i].IdFlujo,
          proyecto[i].idtareaenvuelo,
          proyecto[i].subtarea,
          proyecto[i].periodo,
          proyecto[i].porcentaje,
          proyecto[i].glosaitem,
          proyecto[i].idtipopago,
          proyecto[i].montoorigen,
          proyecto[i].montopesos,
          proyecto[i].costoorigen,
          proyecto[i].costopesos
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "CompromisosPorSAP.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.err(err);
      res.json({ error_code: 100 });
    });

};