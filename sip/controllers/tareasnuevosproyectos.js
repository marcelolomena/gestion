var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "estructuracui.cui";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idpresupuestoiniciativa",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.tareasnuevosproyectos.belongsTo(models.moneda, { foreignKey: 'idmoneda' });
      models.tareasnuevosproyectos.belongsTo(models.parametro, { foreignKey: 'idtipopago' });
      models.tareasnuevosproyectos.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
      models.tareasnuevosproyectos.belongsTo(models.servicio, { foreignKey: 'idservicio' });
      models.servicio.belongsTo(models.cuentascontables, { foreignKey: 'idcuenta' });
      models.tareasnuevosproyectos.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
      models.tareasnuevosproyectos.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.tareasnuevosproyectos.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [
            {
              model: models.servicio,
              include: models.cuentascontables

            },
            {
              model: models.estructuracui
            },
            {
              model: models.parametro
            },
            {
              model: models.moneda
            },
            {
              model: models.proveedor
            }]
        }).then(function (iniciativas) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}
exports.getServiciosDesarrollo = function (req, res) {

  var sql = "SELECT a.id, a.nombre FROM sip.servicio a " +
    "where a.borrado = 1 and a.tarea<>''" +
    "ORDER BY a.nombre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getCUIServicio = function (req, res) {
  sequelize.query('SELECT distinct a.idcui, b.cui, b.nombre, b.nombreresponsable FROM sip.plantillapresupuesto a join sip.estructuracui b on b.id=a.idcui where b.borrado = 1 and a.idservicio=:idservicio',
    { replacements: { idservicio: req.params.idservicio }, type: sequelize.QueryTypes.SELECT }
  ).then(function (user) {
    res.json(user);
  }).catch(function (err) {
    console.log(err)
    res.json({ error_code: 1 });
  });
};

exports.getProveedorCUI = function (req, res) {
  sequelize.query('SELECT distinct a.idproveedor, b.razonsocial FROM sip.plantillapresupuesto a join sip.proveedor b on b.id=a.idproveedor where b.borrado = 1 and a.idcui=:idcui and a.idservicio=:idservicio',
    { replacements: { idservicio: req.params.idservicio, idcui: req.params.idcui }, type: sequelize.QueryTypes.SELECT }
  ).then(function (user) {
    console.dir(user);
    res.json(user);
  }).catch(function (err) {
    console.log(err)
    res.json({ error_code: 1 });
  });
};

exports.getProveedoresDesarrollo = function (req, res) {

  var sql = "SELECT a.id, a.razonsocial FROM sip.proveedor a join sip.plantillapresupuesto b on a.id=b.idproveedor " +
    "where a.borrado = 1 " +
    "ORDER BY a.razonsocial";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.getTipoPago = function (req, res) {

  var sql = "SELECT a.id, a.nombre FROM sip.parametro a " +
    "where a.borrado = 1 and tipo='tipopago' " +
    "ORDER BY a.nombre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};


exports.action = function (req, res) {
  var action = req.body.oper;
  var costounitario = 0

  if (action != "del") {
    if (req.body.costounitario != "")
      costounitario = req.body.costounitario.split(".").join("").replace(",", ".")
  }

  switch (action) {
    case "add":
      models.tareasnuevosproyectos.create({
        idpresupuestoiniciativa: req.body.parent_id,
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        tarea: req.body.tarea,
        idtipopago: req.body.idtipopago,
        fechainicio: req.body.fechainicio,
        fechafin: req.body.fechafin,
        reqcontrato: req.body.reqcontrato,
        idmoneda: req.body.idmoneda,
        costounitario: costounitario,
        cantidad: req.body.cantidad,
        coniva: req.body.coniva,
        glosa: req.body.glosa,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.tareasnuevosproyectos.update({
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        tarea: req.body.tarea,
        idtipopago: req.body.idtipopago,
        fechainicio: req.body.fechainicio,
        fechafin: req.body.fechafin,
        reqcontrato: req.body.reqcontrato,
        idmoneda: req.body.idmoneda,
        costounitario: costounitario,
        cantidad: req.body.cantidad,
        coniva: req.body.coniva,
        glosa: req.body.glosa,
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contrato) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.tareasnuevosproyectos.destroy({
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