var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

var log = function (inst) {
  console.dir(inst.get())
}

exports.excel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  //console.log("Creando Excel");
  var conf = {}
  conf.cols = [{
    caption: 'Id Contrato',
    type: 'number',
    width: 3
  },
    {
      caption: 'Contrato',
      type: 'string',
      width: 50
    },
    {
      caption: 'Solicitud',
      type: 'string',
      width: 30
    },
    {
      caption: 'Proveedor',
      type: 'string',
      width: 50
    },
    {
      caption: 'Estado Solicitud',
      type: 'string',
      width: 30
    },
    {
      caption: 'Número',
      type: 'number',
      width: 10
    },
    {
      caption: 'Tipo Solicitud',
      type: 'string',
      width: 30
    },
    {
      caption: 'PMO',
      type: 'string',
      width: 30
    },
    {
      caption: 'Id Servicio',
      type: 'number',
      width: 30
    },
    {
      caption: 'Anexo',
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
      caption: 'Cuenta',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fecha Inicio',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fecha Término',
      type: 'string',
      width: 30
    },
    {
      caption: 'Fecha Control',
      type: 'string',
      width: 30
    },
    {
      caption: 'Valor Cuota',
      type: 'number',
      width: 30
    },
    {
      caption: 'Frecuencia',
      type: 'string',
      width: 30
    },
    {
      caption: 'Plazo',
      type: 'string',
      width: 30
    },
    {
      caption: 'Condición',
      type: 'string',
      width: 30
    },
    {
      caption: 'Impuesto',
      type: 'number',
      width: 30
    },
    {
      caption: 'Factor',
      type: 'number',
      width: 30
    },
    {
      caption: 'Estado',
      type: 'string',
      width: 30
    },
    {
      caption: 'Descripción',
      type: 'string',
      width: 30
    },
    {
      caption: 'Id Compromiso',
      type: 'number',
      width: 30
    },
    {
      caption: 'Periodo',
      type: 'string',
      width: 30
    },
    {
      caption: 'Monto',
      type: 'number',
      width: 30
    },
    {
      caption: 'Costo',
      type: 'number',
      width: 30
    }
  ];

  var sql = "SELECT a.*,b.razonsocial as proveedor, " +
    " c.id as idservicio, c.anexo, c.idcui, f.nombre as servicio, c.cuentacontable, c.fechainicio, c.fechatermino, " +
    " c.fechacontrol, c.valorcuota, c.frecuenciafacturacion, c.plazocontrato, c.condicionnegociacion, " +
    " c.impuesto, c.factorimpuesto, c.estadocontrato, c.glosaservicio, " +
    " d.id as idcompromiso, d.periodo, d.montoorigen, d.costoorigen " +
    "   FROM sip.contrato a JOIN sip.proveedor b ON a.idproveedor=b.id " +
    "  JOIN sip.detalleserviciocto c ON a.id=c.idcontrato " +
    " JOIN sip.detallecompromiso d ON c.id=d.iddetalleserviciocto " +
    " JOIN sip.detalleserviciocto e ON d.iddetalleserviciocto=e.id " +
    " JOIN sip.servicio f ON f.id=e.idservicio " +
    "  order by a.id";

  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {
        a = [proyecto[i].id, proyecto[i].nombre,
          proyecto[i].solicitudcontrato,
          proyecto[i].proveedor,
          proyecto[i].estadosolicitud,
          proyecto[i].numero,
          proyecto[i].tiposolicitud,
          proyecto[i].pmoresponsable,
          proyecto[i].idservicio,
          proyecto[i].anexo,
          proyecto[i].idcui,
          proyecto[i].servicio,
          proyecto[i].cuentacontable,
          proyecto[i].fechainicio,
          proyecto[i].fechatermino,
          proyecto[i].fechacontrol,
          proyecto[i].valorcuota,
          proyecto[i].frecuenciafacturacion,
          proyecto[i].plazocontrato,
          proyecto[i].condicionnegociacion,
          proyecto[i].impuesto,
          proyecto[i].factorimpuesto,
          proyecto[i].estadocontrato,
          proyecto[i].glosaservicio,
          proyecto[i].idcompromiso,
          proyecto[i].periodo,
          proyecto[i].montoorigen,
          proyecto[i].costoorigen
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "Contratos.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

}

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.contrato.create({
        tipocontrato: req.body.tipocontrato,
        tipodocumento: req.body.tipodocumento,
        solicitudcontrato: req.body.solicitudcontrato,
        idtiposolicitud: req.body.idtiposolicitud,
        tiposolicitud: req.body.tiposolicitud,
        idestadosol: req.body.idestadosol,
        estadosolicitud: req.body.estadosolicitud,
        numero: req.body.numero,
        nombre: req.body.nombre,
        idproveedor: req.body.idproveedor,
        uidpmo: req.body.uidpmo,
        pmoresponsable: req.body.pmoresponsable,
        borrado: 1
      }).then(function (contrato) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.contrato.update({
        tipocontrato: req.body.tipocontrato,
        tipodocumento: req.body.tipodocumento,
        solicitudcontrato: req.body.solicitudcontrato,
        idtiposolicitud: req.body.idtiposolicitud,
        tiposolicitud: req.body.tiposolicitud,
        idestadosol: req.body.idestadosol,
        estadosolicitud: req.body.estadosolicitud,
        numero: req.body.numero,
        nombre: req.body.nombre,
        idproveedor: req.body.idproveedor,
        uidpmo: req.body.uidpmo,
        pmoresponsable: req.body.pmoresponsable
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
      models.contrato.destroy({
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

exports.listall = function (req, res) {
  models.contrato.findAll({
    atributes: ['id', 'nombre'],
    where: { 'nombre': { $ne: null } },
    order: 'nombre'
  }).then(function (contratos) {
    res.json(contratos);
  }).catch(function (err) {
    //console.log(err);
    res.json({ error_code: 1 });
  });
}

exports.listaporproveedor = function (req, res) {
  models.contrato.findAll({
    atributes: ['id', 'nombre'],
    where: [{ 'nombre': { $ne: null } }, {idproveedor : req.params.id}],
    order: 'nombre'
  }).then(function (contratos) {
    res.json(contratos);
  }).catch(function (err) {
    //console.log(err);
    res.json({ error_code: 1 });
  });
}

exports.list = function (req, res) {

  //console.dir(req.session)

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = "[Contrato]." + sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.contrato.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
      models.contrato.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.contrato.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.proveedor
          }]
        }).then(function (contratos) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};
