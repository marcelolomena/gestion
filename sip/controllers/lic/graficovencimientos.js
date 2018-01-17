var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var logger = require("../../utils/logger");
var constants = require("../../utils/constants");


exports.getVencimientos = function (req, res) {
  
    var sql = `
		DECLARE @pc30 INT;
		DECLARE @pc60 INT;
		DECLARE @pc90 INT;  
		DECLARE @srv30 INT;
		DECLARE @srv60 INT;
		DECLARE @srv90 INT; 
		(SELECT @pc30=count(*) FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id
		WHERE DATEDIFF(day, getdate(),fechaexpiracion) > 0 AND DATEDIFF(day, getdate(),fechaexpiracion) <31 AND b.idtipoinstalacion=:idtipoinstpc) 

		(SELECT @pc60=count(*) FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id
		WHERE DATEDIFF(day, getdate(),fechaexpiracion) > 30 AND DATEDIFF(day, getdate(), fechaexpiracion) <61 AND b.idtipoinstalacion=:idtipoinstpc) 

		(SELECT @pc90=count(*) FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id
		WHERE DATEDIFF(day, getdate(),fechaexpiracion) > 60 AND DATEDIFF(day, getdate(), fechaexpiracion) <91 AND b.idtipoinstalacion=:idtipoinstpc) 

		(SELECT @srv30=count(*) FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id
		WHERE DATEDIFF(day, getdate(),fechaexpiracion) > 0 AND DATEDIFF(day, getdate(), fechaexpiracion) <31 AND b.idtipoinstalacion=:idtipoinstsrv) 

		(SELECT @srv60=count(*) FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id
		WHERE DATEDIFF(day, getdate(),fechaexpiracion) > 30 AND DATEDIFF(day, getdate(), fechaexpiracion) <61 AND b.idtipoinstalacion=:idtipoinstsrv) 

		(SELECT @srv90=count(*) FROM lic.compra a JOIN lic.producto b ON a.idproducto=b.id
		WHERE DATEDIFF(day, getdate(),fechaexpiracion) > 60 AND DATEDIFF(day, getdate(), fechaexpiracion) <91 AND b.idtipoinstalacion=:idtipoinstsrv) 

		SELECT @pc30 AS x, @pc60 AS y, @pc90 AS k, @srv30 AS xx, @srv60 AS yy, @srv90 AS kk	
	`;
  
    sequelize.query(sql,
		{
			replacements: { idtipoinstpc: constants.PC,  idtipoinstsrv: constants.Servidor}
		}	
	).spread(function (rows) {
        res.json(rows);
      });
  
  };
  
  exports.list = function (req, res) {
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var cui = req.params.cui
  var periodo = req.params.periodo
  var proveedor = req.params.proveedor
  var filters = req.query.filters;
  var condition = "";
  var diasini;
  var diasfin;
  var tipoinst;  
  var dias = req.params.id;
  dias = dias.substring(0,2);
  if (dias == '30' ){
	diasini=0; diasfin = 31;
  } else if (dias == '60' ){
	diasini=30; diasfin = 61;
  } else {
	diasini=60; diasfin = 91;
  } 
  if (req.params.id2 == 'PC') {
	tipoinst=constants.PC;
  } else {
	tipoinst=constants.Servidor;
  }
  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn' || item.op === 'eq')
          if (item.field == 'nombre') {
            condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
          } else {
            condition += 'a.' + item.field + "=" + item.data + " AND ";
          } 
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }
  var sqlcount = "SELECT count(*) as count FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto "+
	" WHERE DATEDIFF(day, getdate(), b.fechaexpiracion) > "+diasini +
	" AND DATEDIFF(day, getdate(), b.fechaexpiracion) <"+diasfin +" AND a.idtipoinstalacion="+tipoinst  
  if (filters && condition != "") {
    sqlcount += " and "+condition + " ";
  }

  logger.debug("sqlcount:" + sqlcount);

  var sql = "DECLARE @PageSize INT; " +
    "SELECT @PageSize=" + rowspp + "; " +
    "DECLARE @PageNumber INT; " +
    "SELECT @PageNumber=" + page + "; " +
    "SELECT a.id id1, a.*, b.*, c.id idFabricante, c.nombre nombreFab, d.id idClasificacion, d.nombre nombreClas, "+
    "e.id idTipoLic, e.nombre nombreTipoLic, f.id idTipoInst, f.nombre nombreTipoInst, g.razonsocial "+     
    "FROM lic.producto a JOIN lic.compra b ON a.id = b.idproducto "+
    "LEFT JOIN lic.fabricante c ON a.idfabricante=c.id "+
    "LEFT JOIN lic.clasificacion d ON a.idclasificacion=d.id "+
    "LEFT JOIN lic.tipolicenciamiento e ON a.idtipolicenciamiento=e.id "+
    "LEFT JOIN lic.tipoinstalacion f ON a.idtipoinstalacion=f.id "+
	"LEFT JOIN sip.proveedor g ON b.idproveedor=g.id "+
	" WHERE DATEDIFF(day, getdate(), b.fechaexpiracion) > "+diasini +
	" AND DATEDIFF(day, getdate(), b.fechaexpiracion) <"+diasfin +" AND a.idtipoinstalacion="+tipoinst
  if (filters && condition != "") {
    sql += " and " + condition + " ";
    logger.debug("**" + sql + "**");
  }
  var sql2 = sql + " ORDER BY a.alertarenovacion desc OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
  var records;
  logger.debug("query:" + sql2);

  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    sequelize.query(sql2).spread(function (rows) {
      return res.json({ records: records, total: total, page: page, rows: rows });
    }).catch(function (err) {
      logger.error(err)
      return res.json({ error_code: 1 });
    });
  })
}
  