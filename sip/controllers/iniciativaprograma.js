var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
exports.action = function (req, res) {
  var action = req.body.oper;
  var gasto, inversion, previsto = 0.00
  var gastoaprobado, inversionaprobada, aprobado, aprobadodolares = 0.00
  var programid = null

  if (action != "del") {
    
    logger.debug("*************el gasto: "+gasto+ ", "+req.body.pptoestimadogasto);  
    if (req.body.pptoestimadogasto != ""){
      gasto = req.body.pptoestimadogasto; //.replace(",", ".");
      logger.debug("*************el gasto: "+gasto+ ", "+req.body.pptoestimadogasto);
    }

    if (req.body.pptoestimadoinversion != "")
      inversion = req.body.pptoestimadoinversion;//.split(".").join("").replace(",", ".")

    if (req.body.pptoestimadoprevisto != "")
      previsto = req.body.pptoestimadoprevisto;//.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadogasto != "")
      gastoaprobado = req.body.pptoaprobadogasto;//.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadoinversion != "")
      inversionaprobada = req.body.pptoaprobadoinversion;//.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadoprevisto != "")
      aprobado = req.body.pptoaprobadoprevisto;//.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadodolares != "")
      aprobadodolares = req.body.pptoaprobadodolares;//.split(".").join("").replace(",", ".")
    logger.debug("*************el aprobadodolares: "+aprobadodolares); 

    if (req.body.program_id != "0")
      programid = req.body.program_id
  }


  switch (action) {
    case "add":
      if (req.body.fechacomite == "") {
        models.iniciativaprograma.create({
          idiniciativa: req.body.parent_id,
          program_id: programid,
          codigoart: req.body.codigoart,
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          uidsponsor1: req.body.uidsponsor1,
          sponsor1: req.body.sponsor1,
          uidsponsor2: req.body.uidsponsor2,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          //fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          idestado: req.body.idestado,
          idetapa: req.body.idetapa,
          estado: req.body.estado,
          subcategoria: req.body.subcategoria,
          duracionprevista: req.body.duracionprevista,
          mesinicioprevisto: req.body.mesinicioprevisto,
          anoinicioprevisto: req.body.anoinicioprevisto,
          borrado: 1
        }).then(function (iniciativa) {
          return res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          return res.json({ error_code: 1 });
        });
      } else {
        models.iniciativaprograma.create({
          idiniciativa: req.body.parent_id,
          program_id: programid,
          codigoart: req.body.codigoart,
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          uidsponsor1: req.body.uidsponsor1,
          sponsor1: req.body.sponsor1,
          uidsponsor2: req.body.uidsponsor2,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          idestado: req.body.idestado,
          idetapa: req.body.idetapa,
          estado: req.body.estado,
          subcategoria: req.body.subcategoria,
          duracionprevista: req.body.duracionprevista,
          mesinicioprevisto: req.body.mesinicioprevisto,
          anoinicioprevisto: req.body.anoinicioprevisto,
          borrado: 1
        }).then(function (iniciativa) {
          return res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          return res.json({ error_code: 1 });
        });
      }
      break;
    case "edit":
      if (req.body.fechacomite == "") {
        models.iniciativaprograma.update({
          program_id: programid,
          codigoart: req.body.codigoart,
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          uidsponsor1: req.body.uidsponsor1,
          sponsor1: req.body.sponsor1,
          uidsponsor2: req.body.uidsponsor2,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          //fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          idestado: req.body.idestado,
          idetapa: req.body.idetapa,
          estado: req.body.estado,
          subcategoria: req.body.subcategoria,
          duracionprevista: req.body.duracionprevista,
          mesinicioprevisto: req.body.mesinicioprevisto,
          anoinicioprevisto: req.body.anoinicioprevisto
        }, {
            where: {
              id: req.body.id
            }
          }).then(function (iniciativa) {
            logger.debug("*************el gasto modificado es: "+parseFloat(gasto));
            return res.json({ error_code: 0 });
          }).catch(function (err) {
            logger.error(err);
            logger.debug("*************el gasto modificado es: "+parseFloat(gasto));
            return res.json({ error_code: 1 });
          });
      } else {
        models.iniciativaprograma.update({
          program_id: programid,
          codigoart: req.body.codigoart,
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          uidsponsor1: req.body.uidsponsor1,
          sponsor1: req.body.sponsor1,
          uidsponsor2: req.body.uidsponsor2,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          idestado: req.body.idestado,
          idetapa: req.body.idetapa,
          estado: req.body.estado,
          subcategoria: req.body.subcategoria,
          duracionprevista: req.body.duracionprevista,
          mesinicioprevisto: req.body.mesinicioprevisto,
          anoinicioprevisto: req.body.anoinicioprevisto
        }, {
            where: {
              id: req.body.id
            }
          }).then(function (iniciativa) {
            return res.json({ error_code: 0 });
          }).catch(function (err) {
            logger.error(err);
            return res.json({ error_code: 1 });
          });
      }

      break;
    case "del":
      models.iniciativaprograma.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          logger.debug('Deleted successfully');
        }
        return res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
      });

      break;
  }
}

exports.actualizaMontos = function (req, res) {
  var pptoestimadogasto = 0;
  var pptoestimadoinversion= 0;
  var pptoestimadoprevisto = 0;
  var pptoaprobadogasto = 0;
  var pptoaprobadoinversion = 0;
  var pptoaprobadoprevisto = 0;
  var pptoaprobadodolares = 0;

  models.iniciativaprograma.findAll({
    where: {
      idiniciativa: req.params.idiniciativa
    }
  }).then(function (iniciativasp) {
    iniciativasp.forEach(function (element) {
      logger.debug('sumo '+pptoestimadogasto+' mas '+element.pptoestimadogasto);
      pptoestimadogasto = pptoestimadogasto + element.pptoestimadogasto;
      logger.debug('y el resultado es: '+pptoestimadogasto);
      pptoestimadoinversion = pptoestimadoinversion + element.pptoestimadoinversion;
      pptoestimadoprevisto = pptoestimadoprevisto + element.pptoestimadoprevisto;
      pptoaprobadogasto = pptoaprobadogasto + element.pptoaprobadogasto;
      pptoaprobadoinversion = pptoaprobadoinversion + element.pptoaprobadoinversion;
      pptoaprobadoprevisto = pptoaprobadoprevisto + element.pptoaprobadoprevisto;
      pptoaprobadodolares = pptoaprobadodolares + element.pptoaprobadodolares;
    }, this);
  }).then(function (records) {
    models.iniciativa.update({
      pptoestimadogasto: pptoestimadogasto,
      pptoestimadoinversion: pptoestimadoinversion,
      pptoestimadoprevisto: pptoestimadoprevisto,
      pptoaprobadogasto: pptoaprobadogasto,
      pptoaprobadoinversion: pptoaprobadoinversion,
      pptoaprobadoprevisto: pptoaprobadoprevisto,
      pptoaprobadodolares: pptoaprobadodolares
    }, {
        where: {
          id: req.params.idiniciativa
        }
      }).then(function (iniciativa) {
        return res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
      });
  })
};

exports.codigoart = function (req, res) {

  models.iniciativaprograma.find({
    where: {
      idiniciativa: req.params.id
    }
  }).then(function (iniciativas) {
    //gerentes.forEach(log)
    if (iniciativas)
      return res.json(iniciativas)
    else
      throw new Error('no data');
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error_code: 1 });
  });
};

exports.combobox = function (req, res) {
  models.iniciativaprograma.findAll({
    where: {
      idiniciativa: req.params.id
    },
    order: 'nombre'
  }).then(function (iniciativas) {
    //iniciativas.forEach(log)
    return res.json(iniciativas);
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error_code: 1 });
  });
}
exports.comboboxtotal = function (req, res) {
  models.iniciativaprograma.findAll({
    order: 'nombre'
  }).then(function (iniciativas) {
    //iniciativas.forEach(log)
    return res.json(iniciativas);
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error_code: 1 });
  });
}

// Create endpoint /iniciativaprograma for GET
exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idiniciativa",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.iniciativaprograma.belongsTo(models.parametro, { foreignKey: 'idetapa' });
      models.iniciativaprograma.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.iniciativaprograma.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
                        model: models.parametro
          }]
        }).then(function (iniciativas) {
          return res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          logger.error(err);
          return res.json({ error_code: 1 });
        });
      })
    }
  });

};