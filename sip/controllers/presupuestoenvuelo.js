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

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;

  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'Nombre',
      type: 'string',
      width: 50
    },
    {
      caption: 'División',
      type: 'string',
      width: 100
    },
    {
      caption: 'Sponsor 1',
      type: 'string',
      width: 50
    },
    {
      caption: 'Sponsor 2',
      type: 'string',
      width: 50
    },
    {
      caption: 'PMO',
      type: 'string',
      width: 50
    },
    {
      caption: 'Gerente',
      type: 'string',
      width: 50
    },
    {
      caption: 'Estado',
      type: 'string',
      width: 50
    },
    {
      caption: 'Categoría',
      type: 'string',
      width: 50
    },
    {
      caption: 'Q1',
      type: 'string',
      width: 15
    },
    {
      caption: 'Q2',
      type: 'string',
      width: 15
    },
    {
      caption: 'Q3',
      type: 'string',
      width: 15
    },
    {
      caption: 'Q4',
      type: 'string',
      width: 15
    },
    {
      caption: 'Fecha Comite',
      type: 'string',
      width: 15
    },
    {
      caption: 'Año',
      type: 'number',
      width: 15
    },
    {
      caption: 'Presupuesto Gasto (USD)',
      type: 'number',
      width: 15
    },
    {
      caption: 'Presupuesto Inversión (USD)',
      type: 'number',
      width: 15
    }

  ];

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      log(err)
    } else {
      models.iniciativa.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.iniciativa.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: order,
          where: data
        }).then(function (iniciativas) {
          var arr = []
          for (var i = 0; i < iniciativas.length; i++) {

            a = [i + 1, iniciativas[i].nombre,
              iniciativas[i].divisionsponsor,
              iniciativas[i].sponsor1,
              iniciativas[i].sponsor2,
              iniciativas[i].pmoresponsable,
              iniciativas[i].gerenteresponsable,
              iniciativas[i].estado,
              iniciativas[i].categoria,
              iniciativas[i].q1,
              iniciativas[i].q2,
              iniciativas[i].q3,
              iniciativas[i].q4,
              iniciativas[i].fechacomite,
              iniciativas[i].ano,
              iniciativas[i].pptoestimadogasto,
              iniciativas[i].pptoestimadoinversion
            ];
            arr.push(a);
          }
          conf.rows = arr;
          var result = nodeExcel.execute(conf);
          res.setHeader('Content-Type', 'application/vnd.openxmlformates');
          res.setHeader("Content-Disposition", "attachment;filename=" + "iniciativas.xlsx");
          res.end(result, 'binary');

        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
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