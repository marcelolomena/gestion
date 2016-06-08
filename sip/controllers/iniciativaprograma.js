var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
  var action = req.body.oper;
  var gasto, inversion,pptoestimadoprevisto = 0

  if (action != "del") {
    if (req.body.pptoestimadogasto != "")
      gasto = req.body.pptoestimadogasto.split(".").join("").replace(",", ".")

    if (req.body.pptoestimadoinversion != "")
      inversion = req.body.pptoestimadoinversion.split(".").join("").replace(",", ".")
      
    if (req.body.pptoestimadoprevisto != "")
      pptoestimadoprevisto = req.body.pptoestimadoprevisto.split(".").join("").replace(",", ".")
  }

  //console.log("gasto : " + gasto);
  //console.log("inversion : " + inversion);

  switch (action) {
    case "add":
    if(req.body.program_id=="0"){
      models.iniciativaprograma.create({
        idiniciativa: req.body.parent_id,
        program_id: null,
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
        pptoestimadoprevisto: pptoestimadoprevisto,
        idestado: req.body.idestado,
        estado: req.body.estado,
        subcategoria: req.body.subcategoria,
        duracionprevista: req.body.duracionprevista,
        mesinicioprevisto: req.body.mesinicioprevisto,
        anoinicioprevisto: req.body.anoinicioprevisto,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
    }else{
      models.iniciativaprograma.create({
        idiniciativa: req.body.parent_id,
        program_id: req.body.program_id,
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
        pptoestimadoprevisto: pptoestimadoprevisto,
        idestado: req.body.idestado,
        estado: req.body.estado,
        subcategoria: req.body.subcategoria,
        duracionprevista: req.body.duracionprevista,
        mesinicioprevisto: req.body.mesinicioprevisto,
        anoinicioprevisto: req.body.anoinicioprevisto,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
    }
      break;
    case "edit":
    if(req.body.program_id=="0"){
      models.iniciativaprograma.update({
        program_id: null,
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
        pptoestimadoprevisto: pptoestimadoprevisto,
        idestado: req.body.idestado,
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
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
    }else{
        models.iniciativaprograma.update({
        program_id: req.body.program_id,
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
        pptoestimadoprevisto: pptoestimadoprevisto,
        idestado: req.body.idestado,
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
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
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
          console.log('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
  }
}

exports.codigoart = function (req, res) {

  models.iniciativaprograma.find({
    where: {
      idiniciativa: req.params.id
    }
  }).then(function (iniciativas) {
    //gerentes.forEach(log)
    if (iniciativas)
      res.json(iniciativas)
    else
      throw new Error('no data');
  }).catch(function (err) {
    //console.log(err);
    res.json({ error_code: 1 });
  });
};

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
      console.log("->>> " + err)
    } else {
      models.iniciativaprograma.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.iniciativaprograma.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (iniciativas) {
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};