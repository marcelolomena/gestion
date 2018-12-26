var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');
var logger = require("../utils/logger");
var logtransaccion = require("../utils/logtransaccion");
var constants = require("../utils/constants");

exports.excel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";

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
      logger.error(err)
      res.json({ error_code: 100 });
    });

}

exports.action = function (req, res) {
  var action = req.body.oper;

  var program_id = null

  if(req.body.program_id!="0" && req.body.program_id!=""){
    program_id =req.body.program_id
  }

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
        enrolamiento: req.body.enrolamiento,
        tipoproveedor: req.body.tipoproveedor,
        borrado: 1
      }).then(function (contratonew) {
        console.log("****CREA contrato:"+constants.CreaContrato);
				logtransaccion.registrar(
					constants.CreaContrato,
					contratonew.id,
					'insert',
					req.session.passport.user,
					'contrato',
          contratonew,
					function (err, data) {
						if (!err) {
							res.json({ error_code: 0 });
						} else {
							logger.error(err)
							return res.json({ error_code: 1 });
						}
					});        
        
      }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      console.log("****Actualiza contrato:"+ req.body.enrolamiento+ ' prov:'+req.body.tipoproveedor);
				logtransaccion.registrar(
					constants.ActualizaContrato,
					req.body.id,
					'update',
					req.session.passport.user,
					models.contrato,
          req.body,
					function (err, idlog) {
						if (!err) {    
              models.contrato.update({
                //tipocontrato: req.body.tipocontrato,
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
                enrolamiento: req.body.enrolamiento,
                tipoproveedor: req.body.tipoproveedor,                
              }, {
                  where: {
                    id: req.body.id
                  }
                }).then(function (contrato) {
                  console.log("****IDLog:"+idlog+"Contrato:"+JSON.stringify(contrato));
                  logtransaccion.actualizar(idlog, req.body.id, models.contrato,
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
                  logger.error(err)
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
					constants.BorraContrato,
					req.body.id,
					'delete',
					req.session.passport.user,
					models.contrato,
          req.body,
					function (err, data) {    
            if (!err) {  
              models.contrato.destroy({
                where: {
                  id: req.body.id
                }
              }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                  logger.debug('Deleted successfully');
                }
                res.json({ error_code: 0 });
              }).catch(function (err) {
                logger.error(err)
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

exports.listall = function (req, res) {
  console.dir("***************EN LISTALL ***************************");
  models.contrato.findAll({
    attributes: ['id', 'nombre'],
    where: { 'nombre': { $ne: null } },
    order: 'nombre'
  }).then(function (contratos) {
    res.json(contratos);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
}

exports.listaporproveedor = function (req, res) {
  models.contrato.findAll({
    attributes: ['id', 'nombre'],
    where: [{ 'nombre': { $ne: null } }, { idproveedor: req.params.id }],
    order: 'nombre'
  }).then(function (contratos) {
    res.json(contratos);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
}

exports.listOld = function (req, res) {

  console.dir("***************EN LIST ***************************");

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = "[contrato]." + sidx + " " + sord;
  
  console.log("***ORDER:"+orden);

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.contrato.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
      models.contrato.belongsTo(models.contactoproveedor, { foreignKey: 'idcontactofacturacion' });
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
                    },{
                      model: models.contactoproveedor
                    }
          ]
        }).then(function (contratos) {
          //Contrato.forEach(log)
          res.json({ records: records, total: total, page: page, rows: contratos });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.list = function (req, res) {
  console.dir("***************EN LISTNEW ***************************");
  var page = req.body.page;
  var rowspp = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var condition = "";

  if (!sidx) {
    sidx = "a.id";
    sord = "desc";    
  }

    
  var order = sidx + " " + sord;
  
  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'eq' && item.data !='0') {
          if (item.field == 'idproveedor') {
            condition += 'a.' + item.field + "=" + item.data + " AND ";
          } else if (item.field == 'tiposolicitud') {
            condition += 'a.idtiposolicitud=' + item.data + " AND ";
          } else if (item.field == 'numero') {
            condition += "a.numero like '%" + item.data + "%' AND ";
          }
        } else if (item.op === 'cn' ) {
            condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
        }
      });
      condition = condition.substring(0, condition.length - 5);
      console.log("***CONDICION:" + condition);
    }
  }          
  var sqlcount = "DECLARE @idfechafinal int;"+
  "SELECT TOP 1 @idfechafinal=id FROM sip.parametro WHERE tipo='tipofecha' ORDER BY valor DESC;"+ 
  "SELECT count(*) AS count FROM  sip.contrato a "+
  "LEFT JOIN sip.proveedor b ON a.idproveedor=b.id "+ 
  "LEFT JOIN sip.contactoproveedor c ON a.idcontactofacturacion=c.id ";
  if (filters && condition != "") {
    sqlcount += "WHERE " + condition + " ";
  }  
  var sqlok = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rowspp + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, b.razonsocial, c.contacto "+
    "FROM  sip.contrato a "+
    "LEFT JOIN sip.proveedor b ON a.idproveedor=b.id "+ 
    "LEFT JOIN sip.contactoproveedor c ON a.idcontactofacturacion=c.id ";
    if (filters && condition != "") {
      console.log("**" + condition + "**");
      sqlok += "WHERE " + condition + " ";
    }    
    sqlok += ") " +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
    console.log("SQL1:"+sqlcount);
    sequelize.query(sqlcount).spread(function (recs) {
      var records = recs[0].count;
      var total = Math.ceil(parseInt(recs[0].count) / rowspp);
      console.log("Total:"+total+ "recs[0].count:"+recs[0].count);
      console.log("SQL2:"+sqlok);
      sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
      });
    });  
};    

exports.listaporproveedor = function (req, res) {
  models.contrato.findAll({
    attributes: ['id', 'nombre'],
    where: [{ 'nombre': { $ne: null } }, { idproveedor: req.params.id }],
    order: 'nombre'
  }).then(function (contratos) {
    res.json(contratos);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });
}

exports.getFrecuencia = function (req, res) {

  var sql = "SELECT id, nombre, valor FROM sip.parametro WHERE tipo='frecuenciafacturacion'";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getTipoDocumentos = function (req, res) {

  var promises = []

  var newPromise = { 'id': 1, 'nombre': 'Contrato' };
  promises.push(newPromise);
  var newPromise = { 'id': 2, 'nombre': 'Orden de Compra' };
  promises.push(newPromise);
  var newPromise = { 'id': 3, 'nombre': 'Cotización' };
  promises.push(newPromise);

  res.json(promises);
};

exports.getCodigoart = function (req, res) {
  console.log("codigo:"+req.params.id);
  var sql = "SELECT program_name AS nombreart, program_id FROM art_program WHERE program_code="+req.params.id;

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};


