var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
//var logger = require("../utils/logger");
exports.action = function (req, res) {
  var action = req.body.oper;
  var porcentaje1, porcentaje2, dolar, uf = 0
  var fecha;

  if (action != "del") {
    if (req.body.porcentaje1 != "") {
      //porcentaje1 = req.body.porcentaje1.split(".").join("").replace(",", ".")
      porcentaje1 = parseFloat(req.body.porcentaje1) / 100;
    } else {
      porcentaje1 = 0.00;
    }
    if (req.body.porcentaje2 != "") {
      //porcentaje2 = req.body.porcentaje2.split(".").join("").replace(",", ".")
      porcentaje2 = parseFloat(req.body.porcentaje2) / 100;
    } else {
      porcentaje2 = 0.00;
    }

    if (req.body.dolar != "")
      dolar = req.body.dolar; //.split(".").join("").replace(",", ".")

    if (req.body.uf != "")
      uf = req.body.uf; //.split(".").join("").replace(",", ".")

    if (req.body.fechaconversion != "")
      fecha = req.body.fechaconversion.split("-").reverse().join("-")

  }

  switch (action) {
    case "add":
      models.presupuestoiniciativa.create({
        idiniciativaprograma: req.body.parent_id,
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.uidlider,
        uidjefeproyecto: req.body.uidjefeproyecto,
        fechaconversion: fecha,
        dolar: dolar,
        uf: uf,
        glosa: req.body.glosa,
        sap: req.body.sap,
        parainscripcion: req.body.parainscripcion,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        //logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.presupuestoiniciativa.update({
        cuifinanciamiento1: req.body.cuifinanciamiento1,
        porcentaje1: porcentaje1,
        cuifinanciamiento2: req.body.cuifinanciamiento2,
        porcentaje2: porcentaje2,
        beneficioscuantitativos: req.body.beneficioscuantitativos,
        beneficioscualitativos: req.body.beneficioscualitativos,
        uidlider: req.body.uidlider,
        uidjefeproyecto: req.body.uidjefeproyecto,
        fechaconversion: fecha,
        dolar: dolar,
        glosa: req.body.glosa,
        sap: req.body.sap,
        parainscripcion: req.body.parainscripcion,
        uf: uf
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          //logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.presupuestoiniciativa.destroy({
        where: {
          id: req.body.id
        }
      }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          //logger.debug('Deleted successfully');
        }
        res.json({ error_code: 0 });
      }).catch(function (err) {
        //logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
  }
}

exports.actualiSAP = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      res.json({ error_code: 0 });
      break;
    case "edit":
      models.presupuestoiniciativa.update({
        sap: req.body.sap,
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (iniciativa) {
          res.json({ error_code: 0, sap: req.body.sap });
        }).catch(function (err) {
          //logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      res.json({ error_code: 0 });
      break;
  }
}

exports.list = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  var idiniciativaprograma = req.params.id;

  if (!sidx)
    sidx = "id";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe " +
    "FROM [sip].[presupuestoiniciativa] a " +
	   "JOIN [dbo].[art_user] lider  ON a.[uidlider] = lider.[uid] " +
	   "JOIN  [dbo].[art_user] jefeproyecto  ON a.uidjefeproyecto = jefeproyecto.[uid] " +
    "WHERE (a.[idiniciativaprograma] = " + idiniciativaprograma + " AND a.[borrado] = 1) " +
    ") " +
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
        "as resultNum, a.*, lider.[first_name]as nombrelider ,lider.[last_name] as apellidolider, jefeproyecto.[first_name] as nombrejefe, jefeproyecto.[last_name] as apellidojefe " +
        "FROM [sip].[presupuestoiniciativa] a " +
        "JOIN [dbo].[art_user] lider  ON a.[uidlider] = lider.[uid] " +
        "JOIN  [dbo].[art_user] jefeproyecto  ON a.uidjefeproyecto = jefeproyecto.[uid] " +
        "WHERE (a.[idiniciativaprograma] = " + idiniciativaprograma + " AND a.[borrado] = 1) AND " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      //logger.debug(sql);

      models.presupuestoiniciativa.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.presupuestoiniciativa.count({
        where:
        {
          idiniciativaprograma: idiniciativaprograma
        }
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.presupuestoiniciativa.count({
      where:
      {
        idiniciativaprograma: idiniciativaprograma
      }
    }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

exports.listSAP = function (req, res) {
  var page = req.body.page;
  var rowspp = req.body.rows;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var filters = req.body.filters;
  var condition = "";
  //var idiniciativaprograma = req.params.id;

  if (!sidx)
    sidx = "a.[id]";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn')
          condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
      });
      condition = condition.substring(0, condition.length - 5);
      console.log("***CONDICION:" + condition);
    }
  }
  var sqlcount = "DECLARE @idfechafinal int;"+
    "SELECT TOP 1 @idfechafinal=id FROM sip.parametro WHERE tipo='tipofecha' ORDER BY valor DESC; "+
    "Select count(*) AS count "+
    "FROM [sip].[presupuestoiniciativa] a " +
	   "JOIN [sip].[iniciativaprograma] iniciativaprograma  ON a.[idiniciativaprograma] = iniciativaprograma.[id] " +
    "JOIN [sip].[iniciativafecha] iniciativafecha  ON a.[idiniciativaprograma] = iniciativafecha.[idiniciativaprograma] "+
    "WHERE (iniciativaprograma.[estado] like 'Aprobada%' AND a.[borrado] = 1 AND a.parainscripcion=1) " +  
    "and iniciativafecha.idtipofecha = @idfechafinal "; 
  if (filters && condition != "") {
    sqlcount += "AND " + condition + " ";
  }

  var sqlok = "DECLARE @idfechafinal int;"+
    "SELECT TOP 1 @idfechafinal=id FROM sip.parametro WHERE tipo='tipofecha' ORDER BY valor DESC; "+
    "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rowspp + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, iniciativaprograma.codigoart as codigoart, iniciativafecha.fecha as fechafinal " +
    "FROM [sip].[presupuestoiniciativa] a " +
	   "JOIN [sip].[iniciativaprograma] iniciativaprograma  ON a.[idiniciativaprograma] = iniciativaprograma.[id] " +
    "JOIN [sip].[iniciativafecha] iniciativafecha  ON a.[idiniciativaprograma] = iniciativafecha.[idiniciativaprograma] "+
    "WHERE (iniciativaprograma.[estado] like 'Aprobada%' AND a.[borrado] = 1 AND a.parainscripcion=1) " +
    "and iniciativafecha.idtipofecha = @idfechafinal ";
    if (filters && condition != "") {
      console.log("**" + condition + "**");
      sqlok += "AND " + condition + " ";
    }    
    sqlok += ") " +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
    console.log("SQL:"+sqlcount);
    sequelize.query(sqlcount).spread(function (recs) {
      var records = recs[0].count;
      var total = Math.ceil(parseInt(recs[0].count) / rowspp);
      console.log("SQL:"+sqlok);
      sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
      });
    });
};


exports.getJefe = function (req, res) {

  var user = req.params.id;
  //logger.debug("el usuario: "+user);

  var sql = "select jefe.uid idjefe, jefe.first_name+' '+jefe.last_name as nombrejefe from art_user jefe "+
"where uname = ( "+
"SELECT LEFT(a.emailJefe, CHARINDEX('@', a.emailJefe) - 1 ) unameRRHH "+
"FROM dbo.RecursosHumanos a "+
"where a.periodo=(select max(periodo) from RecursosHumanos) "+
"and LEN(a.emailJefe) != 1 "+
"and LEN(a.emailTrab) != 1 "+
"and LEFT(a.emailTrab, CHARINDEX('@', a.emailTrab) - 1 ) = (select uname from art_user where uid="+user+")) "
//logger.debug(sql);
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};


exports.copiaSAP = function (req, res) {

  var iniciativabase = req.params.id;
  console.log("**Iniciativa a copiar: "+iniciativabase);

  sequelize.query('EXECUTE sip.CopiaSAPIniciativa ' + iniciativabase
    + ';').then(function (response) {
      res.json({ error_code: 0 });
    }).error(function (err) {
      res.json(err);
    });

};
