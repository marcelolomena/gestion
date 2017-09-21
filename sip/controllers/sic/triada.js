var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");


var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var bitacora = require("../../utils/bitacora");
var co = require('co');

exports.list = function (req, res) {

  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  if (!sidx)
    sidx = "id";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  sequelize.query('SELECT idcui ' +
    'FROM sic.solicitudcotizacion ' +
    'WHERE id=:id',
    { replacements: { id: req.params.id }, type: sequelize.QueryTypes.SELECT }
  ).then(function (cui) {
    var sql0 = "declare @rowsPerPage as bigint; " +
      "declare @pageNum as bigint;" +
      "set @rowsPerPage=" + rows + "; " +
      "set @pageNum=" + page + ";   " +
      "With SQLPaging As   ( " +
      "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
      "as resultNum, e.id,e.cui, e.nombre, u.first_name+' '+u.last_name as nombreresponsable, u2.first_name+' '+u2.last_name as nombregerente " +
      "FROM sip.estructuracui e LEFT OUTER JOIN dbo.art_user u ON e.uid = u.uid LEFT OUTER JOIN dbo.art_user u2 ON e.uidgerente = u2.uid " +
      " where borrado = 1 and e.id=" + cui[0].idcui + " ORDER BY cui asc) " +
      "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    if (filters) {
      var jsonObj = JSON.parse(filters);

      if (JSON.stringify(jsonObj.rules) != '[]') {

        jsonObj.rules.forEach(function (item) {

          if (item.op === 'cn')
            condition += item.field + " like '%" + item.data + "%' AND"
        });

        var sql = "declare @rowsPerPage as bigint; " +
          "declare @pageNum as bigint;" +
          "set @rowsPerPage=" + rows + "; " +
          "set @pageNum=" + page + ";   " +
          "With SQLPaging As   ( " +
          "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
          "as resultNum, e.id,e.cui, e.nombre, u.first_name+' '+u.last_name as nombreresponsable, u2.first_name+' '+u2.last_name as nombregerente " +
          "FROM sip.estructuracui e LEFT OUTER JOIN dbo.art_user u ON e.uid = u.uid LEFT OUTER JOIN dbo.art_user u2 ON e.uidgerente = u2.uid " +
          "WHERE borrado = 1 and e.id=" + cui[0].idcui + "and" + condition.substring(0, condition.length - 4) + " ORDER BY cui asc) " +
          "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

        models.estructuracui.count({ where: cui[0].idcui }).then(function (records) {
          var total = Math.ceil(records / rows);
          sequelize.query(sql)
            .spread(function (rows) {
              return res.json({ records: records, total: total, page: page, rows: rows });
            });
        })

      } else {

        models.estructuracui.count({ where: cui[0].idcui }).then(function (records) {
          var total = Math.ceil(records / rows);
          sequelize.query(sql0)
            .spread(function (rows) {
              return res.json({ records: records, total: total, page: page, rows: rows });
            });
        })
      }

    } else {

      models.estructuracui.count({ where: cui[0].idcui }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            return res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    }
  }).catch(function (err) {
    logger.error(err);
    return res.json({ error: 1 });
  });
};

exports.action = function (req, res) {
  var action = req.body.oper;
  var idsolicitudcotiza = req.body.idsolicitudcotizacion;

  switch (action) {
    case "add":
      var proveedor

      if (req.body.razonsocial == 0)
      { provedor = 'NULL' }
      else
      { proveedor = req.body.razonsocial }

      models.plantillapresupuesto.create({
        idcui: req.body.parent_id,
        idservicio: req.body.idservicio,
        idproveedor: proveedor,
        borrado: 1
      }).then(function (plantilla) {
        bitacora.registrarhijo(
          idsolicitudcotiza,
          'triada',
          plantilla.id,
          'insert',
          req.session.passport.user,
          new Date(),
          models.plantillapresupuesto,
          function (err, data) {
            if (!err) {
              return res.json({ error_code: 0 });
            } else {
              logger.error(err);
              return res.json({ error_code: 1 });
            }
          }
        )
      }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
      });
      break;

    case "edit":
      models.plantillapresupuesto.update({
        idcui: req.body.idcui,
        idservicio: req.body.idservicio,
        idproveedor: req.body.idproveedor
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (plantilla) {
          return res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          return res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.plantillapresupuesto.findAll({
        where: {
          id: req.body.id
        }
      }).then(function (plantillapresupuesto) {
        bitacora.registrarhijo(
          idsolicitudcotiza,
          'triada',
          plantillapresupuesto.id,
          'delete',
          req.session.passport.user,
          new Date(),
          models.plantillapresupuesto,
          function (err, data) {
            if (!err) {
              models.plantillapresupuesto.destroy({
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
            } else {
              logger.error(err)
              return res.json({ message: err.message, success: false });
            }
          });
      })
      break;
  }
}

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  logger.debug("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
  {
    caption: 'CUI',
    type: 'number',
    width: 10
  },
  {
    caption: 'Nombre CUI',
    type: 'string',
    width: 50
  },
  {
    caption: 'Responsable',
    type: 'string',
    width: 50
  },
  {
    caption: 'Servicio',
    type: 'string',
    width: 20
  },
  {
    caption: 'Tarea',
    type: 'string',
    width: 20
  },
  {
    caption: 'Proveedor',
    type: 'string',
    width: 10
  },
  ];

  var sql = "SELECT a.id, b.cui, b.nombre, b.nombreresponsable,c.nombre as servicio,isnull(c.tarea,0) as tarea ,d.razonsocial " +
    "FROM sip.plantillapresupuesto a left outer JOIN sip.estructuracui b ON a.idcui=b.id " +
    "left outer JOIN sip.servicio c ON a.idservicio=c.id left outer join sip.proveedor d on a.idproveedor=d.id " +
    "ORDER BY b.cui asc";

  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].cui,
        proyecto[i].nombre,
        proyecto[i].nombreresponsable,
        proyecto[i].servicio,
        proyecto[i].tarea,
        proyecto[i].razonsocial
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      return res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      return res.setHeader("Content-Disposition", "attachment;filename=" + "PlantillaPresupuestos.xlsx");
      return res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      return res.json({ error_code: 100 });
    });

};
