var models = require('../models');
var sequelize = require('../models/index').sequelize;
var constants = require("../utils/constants");
var logger = require("../utils/logger");
var nodeExcel = require('excel-export');

exports.funciones = function (req, res) {
  var sql = "SELECT * FROM sip.funcionalidad ORDER BY nombre";
    
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.transacciones = function (req, res) {
  var id = req.params.id
  var sql = "SELECT * FROM sip.transaccion WHERE idfuncionalidad="+id;
  " ORDER BY nombre";
  logger.debug("query:"+sql);
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
}

exports.usuarios = function (req, res) {
  var id = req.params.id
  var sql = "SELECT a.uid as id, (b.first_name+' '+b.last_name) as nombre "+
    "FROM sip.rol_negocio a JOIN art_user b ON a.uid=b.uid "+
    "ORDER BY nombre ";
  logger.debug("query:"+sql);
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
}

exports.list = function (req, res) {
  var page = req.query.page;
  var filas = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;    
  var id = req.params.idsap
  var condition = "";
  var filters = req.query.filters;
  
  
  var sql0 = "DECLARE @PageSize INT; "+
  "SELECT @PageSize="+filas+"; "+
  "DECLARE @PageNumber INT; "+
  "SELECT @PageNumber="+page+"; "+
  "With SQLPaging As   ( ";
  
  sql = "SELECT a.id, a.idtransaccion,a.idusuario, a.fecha, a.idregistro, "+
  "c.nombre AS funcionalidad, b.nombre AS transaccion, d.uname "+
  "FROM sip.logtransaccion a "+ 
  "JOIN sip.transaccion b ON a.idtransaccion=b.id "+ 
  "JOIN sip.funcionalidad c ON b.idfuncionalidad=c.id "+ 
  "JOIN art_user d ON d.uid = a.idusuario   "+ 
  "WHERE c.id = "+req.query.funcion+" ";
  if (req.query.transaccion != "0") {
    sql = sql +"AND b.id="+req.query.transaccion+" ";
  }  
  if (req.query.usuario != "0") {
    sql = sql +"AND idusuario="+req.query.usuario+" ";
  }
  if (req.query.fechaini != "") {
    sql = sql +"AND fecha >= convert(datetime, '"+req.query.fechaini+"', 103) ";
    sql = sql +"AND fecha <= convert(datetime, '"+req.query.fechafin+" 23:59:59', 103) ";
  }  
  if (req.query.idregistro != "") {
    sql = sql +"AND idregistro="+req.query.idregistro+" ";
  }

  sql2 = sql0 + sql + ") SELECT * FROM SQLPaging ORDER BY fecha OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  logger.debug("sql:"+sql);
  sequelize.query(sql)
    .spread(function (rowscount) {
      //res.json(rows);
      logger.debug("***ROWS***:"+rowscount);
      logger.debug("***Length***:"+rowscount.length);
      records=rowscount.length;
    }).then(function(response){  
      logger.debug("sql2:"+sql2);    
      sequelize.query(sql2)
        .spread(function (rows) {      
      var total=Math.ceil(records / filas);
      res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
        logger.error(err)
          res.json({ error_code: 1 });
    });
  });
}

exports.getDetalle = function (req, res) {
  var id = req.params.id;
  var sql = 
      "SELECT 'Data Antigua' AS nombre, dataold AS data FROM sip.logtransaccion WHERE id ="+ req.params.id+" "+
      " UNION "+
      "SELECT 'Data Nueva' AS nombre, datanew AS data FROM sip.logtransaccion WHERE id ="+ req.params.id;
  console.log("sql:"+sql);
  sequelize.query(sql)
    .spread(function (rows) {
      try {
        if (rows[0].data && rows[1].data) {
          console.log("genera diff");
          var data1 = JSON.parse(rows[0].data);
          var data2 = JSON.parse(rows[1].data);
          console.log ("***DAT1:"+data1);
          console.log ("***DAT2:"+JSON.stringify(data1));
          console.log ("***DAT3:"+JSON.stringify(data1[0]));
          var diff = JSON.stringify(compareJSON(data1[0], data2[0]));
          console.log("***DIFF:"+diff);
          var nombre = 'Diferencia';
          var item = {'nombre':nombre, 'data': diff};
          rows.push(item);      
        }
        res.json(rows);
      } catch(err){
        var rows = [];
        res.json(rows);
      }
    });
}

var compareJSON = function(obj1, obj2) { 
  var ret = {}; 
  for(var i in obj2) { 
    if(!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) { 
      ret[i] = {antes:obj1[i], despues: obj2[i]}; 
    } 
  } 
  return ret; 
};

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
      caption: 'Funcionalidad',
      type: 'funcionalidad',
      width: 10
    },
    {
      caption: 'Transacción',
      type: 'transaccion',
      width: 40
    },
    {
      caption: 'Fecha',
      type: 'fecha',
      width: 20
    },
    {
      caption: 'Usuario',
      type: 'uname',
      width: 10
    },
    {
      caption: 'ID Registro',
      type: 'idregistro',
      width: 15
    },
    {
      caption: 'Data Antes',
      type: 'dataold',
      width: 15
    },
    {
      caption: 'Data Nueva',
      type: 'datanew',
      width: 15
    }
  ];

  sql = "SELECT a.*, "+
  "c.nombre AS funcionalidad, b.nombre AS transaccion, d.uname "+
  "FROM sip.logtransaccion a "+ 
  "JOIN sip.transaccion b ON a.idtransaccion=b.id "+ 
  "JOIN sip.funcionalidad c ON b.idfuncionalidad=c.id "+ 
  "JOIN art_user d ON d.uid = a.idusuario   "+ 
  "WHERE c.id = "+req.query.funcion;
  if (req.query.transaccion != "0") {
    sql = sql +"AND b.id="+req.query.transaccion+" ";
  }  
  if (req.query.usuario != "0") {
    sql = sql +"AND idusuario="+req.query.usuario+" ";
  }
  if (req.query.fechaini != "") {
    sql = sql +"AND fecha >= convert(datetime, '"+req.query.fechaini+"', 103) ";
    sql = sql +"AND fecha <= convert(datetime, '"+req.query.fechafin+" 23:59:59', 103) ";
  }  
  if (req.query.idregistro != "") {
    sql = sql +"AND idregistro="+req.query.idregistro+" ";
  }
  console.log("sql:"+sql);
  sequelize.query(sql)
    .spread(function (result) {
      var arr = []
      for (var i = 0; i < result.length; i++) {

        a = [i + 1, result[i].funcionalidad,
          result[i].transaccion,
          result[i].fecha,
          result[i].uname,
          result[i].idregistro,
          result[i].dataold,
          result[i].datanew
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "RegistroLog.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};