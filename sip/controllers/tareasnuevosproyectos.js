var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

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
      logger.debug("->>> " + err)
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
          logger.error(err);
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
    logger.error(err)
    res.json({ error_code: 1 });
  });
};

exports.getProveedorCUI = function (req, res) {
  sequelize.query('SELECT distinct a.idproveedor, b.razonsocial FROM sip.plantillapresupuesto a join sip.proveedor b on b.id=a.idproveedor where b.borrado = 1 and a.idcui=:idcui and a.idservicio=:idservicio order by b.razonsocial',
    { replacements: { idservicio: req.params.idservicio, idcui: req.params.idcui }, type: sequelize.QueryTypes.SELECT }
  ).then(function (user) {
    console.dir(user);
    res.json(user);
  }).catch(function (err) {
    logger.error(err)
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
  var fechainicio;
  var fechafin;
  console.log("********En Action:");
  if (action != "del") {
    if (req.body.costounitario != "")
      costounitario = req.body.costounitario; //.split(".").join("").replace(",", ".")

    if (req.body.fechainicio != "")
      fechainicio = req.body.fechainicio.split("-").reverse().join("-")

    if (req.body.fechafin != "")
      fechafin = req.body.fechafin.split("-").reverse().join("-")
  }

  switch (action) {
    case "add":
      models.tareasnuevosproyectos.create({
        idpresupuestoiniciativa: req.body.parent_id,
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        tarea: req.body.tarea,
        nombre: req.body.nombre,
        idtipopago: req.body.idtipopago,
        fechainicio: fechainicio,
        fechafin: fechafin,
        reqcontrato: req.body.reqcontrato,
        idmoneda: req.body.idmoneda,
        costounitario: costounitario,
        cantidad: req.body.cantidad,
        coniva: req.body.coniva,
        glosa: req.body.glosa,
        borrado: 1,
        idcotizacion: req.body.idcotizacion,
        extension: req.body.extension
      }).then(function (tarea) {
        console.log("****THEN Id Tarea:"+JSON.stringify(tarea)+ ", cot:"+req.body.idcotizacion);
        if (req.body.idcotizacion != 0) {
          //llama sp que copia flujo
          console.log("Id Tarea:"+JSON.stringify(tarea)+", "+tarea.id);
          var sql = "EXECUTE sip.CopiaFlujoCotizacion " + tarea.id + "," + req.body.idcotizacion+", "+req.body.idproveedor;
          console.log("SQL:"+sql);
          sequelize.query(sql).then(function (rows) {
               //LLamo ok
            }).catch(function (err) {
              logger.error(err);
              return res.json({ error_code: 1 });
            });
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.tareasnuevosproyectos.update({
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor,
        tarea: req.body.tarea,
        nombre: req.body.nombre,
        idtipopago: req.body.idtipopago,
        fechainicio: fechainicio,
        fechafin: fechafin,
        reqcontrato: req.body.reqcontrato,
        idmoneda: req.body.idmoneda,
        costounitario: costounitario,
        cantidad: req.body.cantidad,
        coniva: req.body.coniva,
        glosa: req.body.glosa,
        idcotizacion: req.body.idcotizacion,
        
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (tarea) {
          console.log("Id Tarea:"+tarea[0].id +", "+JSON.stringify(tarea));
          if (req.body.idcotizacion != 0) {
            //llama sp que copia flujo
          var sql = "EXECUTE sip.CopiaFlujoCotizacion " + tarea.id + "," + req.body.idcotizacion+", "+req.body.idproveedor;
          console.log("SQL:"+sql);
          sequelize.query(sql).then(function (rows) {
                //LLamo ok
              }).catch(function (err) {
                logger.error(err);
                return res.json({ error_code: 1 });
              });
          }
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
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
          logger.debug('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;

  }

}

exports.getCotizaciones = function (req, res) {
  console.log('EN:getCotizaciones');

  var sql = "select distinct h.idsolicitudcotizacion idcotizacion, d.descripcion nombre " +
    "from sip.servicio a " +
    "join sip.tareasnuevosproyectos b on b.idservicio = a.id " +
    "join sic.serviciosrequeridos c on c.idservicio = a.id " +
    "join sic.solicitudcotizacion d on c.idsolicitudcotizacion = d.id " +
    "join sic.cotizacionservicio e on e.idserviciorequerido = c.id " +
    "left OUTER join sic.solicitudcontrato h on d.id = h.idsolicitudcotizacion " +
    "where b.idservicio = :idservicio and b.idproveedor = :idproveedor and d.idcui = :idcui";

  console.log('SQL:' + sql);
  console.log("params:" + req.params.idservicio + ", " + req.params.idproveedor + ", " + req.params.idcui)
  sequelize.query(sql,
    {
      replacements: {
        idservicio: req.params.idservicio, idproveedor: req.params.idproveedor,
        idcui: req.params.idcui
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(function (rows) {
    res.json(rows);
  }).catch(function (err) {
    logger.error(err)
    res.json({ error_code: 1 });
  });
};

