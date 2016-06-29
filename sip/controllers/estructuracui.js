var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

exports.getEstructuraCui = function (req, res) {
  var idestructura = req.params.id;
  var idpadre = req.params.idpadre;

  
  var sql = "SELECT id,cui,nombre as nombrecui,e.uid,u.first_name+' '+u.last_name as responsable,idgerencia,genrencia,uidgerente,u2.first_name+' '+u2.last_name as nombregerente " + 
            "FROM sip.estructuracui e LEFT OUTER JOIN art_genrencia_master g ON e.idgerencia =g.dId "+ 
            "LEFT OUTER JOIN dbo.art_user u ON  e.uid = u.uid " +
            "LEFT OUTER JOIN dbo.art_user u2 ON  e.uid = u2.uid " + 
            "Where  e.idestructura = "+idestructura+" and e.cuipadre = "+idpadre+" and e.borrado = 1 Order by e.cui asc";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.cabecera = function (req, res) {
    var id = req.params.id;
    
  var sql = "SELECT  id,nombre,iddivision,e.division,first_name+' '+last_name as responsable  FROM sip.estructuracentro e, " +
  "dbo.art_user u Where e.id ="+id+" and e.uidresponsable = u.uid ";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.responsables = function (req, res) {
  
  var sql = "SELECT  uid as id, first_name+' '+last_name as nombre FROM dbo.art_user "+
  "ORDER BY first_name+' '+last_name";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.gerencias = function (req, res) {

  var sql = "SELECT dId as id,genrencia as nombre FROM dbo.art_genrencia_master "+
  "ORDER BY dId";
      
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });
};

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
   
    case "add":
               
      models.estructuracui.create({
        cui:req.body.cui,
        nombre: req.body.nombrecui,
        uid: req.body.uid,
        idgerencia: req.body.idgerencia,
        uidgerente: req.body.uidgerente,
        idestructura:req.body.idestructura,
        cuipadre:req.body.cuipadre,
        borrado: 1
      }).then(function (estructuracui) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.estructuracui.update({
        nombre: req.body.nombrecui,
        uid: req.body.uid,
        idgerencia: req.body.idgerencia,
        uidgerencia: req.body.uidgerencia
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (estructuracui) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.estructuracui.destroy({
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

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  console.log("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
    },
    {
    caption: 'Estructura CUI',
    type: 'number',
    width: 3
    },
    {
      caption: 'Nombre Estructura',
      type: 'string',
      width: 50
    },
    {
      caption: 'Division',
      type: 'string',
      width: 50
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
      caption: 'CUI Padre',
      type: 'number',
      width: 10
    },
    {
      caption: 'Responsable',
      type: 'string',
      width: 50
    },
    {
      caption: 'Gerencia',
      type: 'string',
      width: 20
    },
    {
      caption: 'Nombre Gerente',
      type: 'string',
      width: 20
    },
  ];

  var sql = "SELECT a.id,a.nombre,a.division, b.cui, b.nombre as nombrecui,b.cuipadre, u.first_name+' '+u.last_name as nombreresponsable, " +
"genrencia,u2.first_name+' '+u2.last_name as nombregerente " +
"FROM sip.estructuracentro a left outer JOIN (sip.estructuracui b left outer JOIN dbo.art_user u " +
"ON b.uid = u.uid left outer JOIN dbo.art_user u2 ON b.uidgerente=u2.uid left outer JOIN dbo.art_genrencia_master m " +
"ON b.idgerencia=m.dId) ON a.id=b.idestructura ORDER BY b.cuipadre asc";

  sequelize.query(sql)
    .spread(function (estructura) {
      var arr = []
      for (var i = 0; i < estructura.length; i++) {

        a = [i + 1,
          estructura[i].id, 
          estructura[i].nombre,
          estructura[i].division,          
          estructura[i].cui,
          estructura[i].nombrecui,
          estructura[i].cuipadre,
          estructura[i].nombreresponsable,
          estructura[i].genrencia,
          estructura[i].nombregerente
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "EstructuraCuis.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};