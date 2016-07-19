var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

exports.cabeceracentro = function (req, res) {
    
  var sql = "SELECT  id,nombre,iddivision,e.division,e.uidresponsable,first_name+' '+last_name as responsable  FROM sip.estructuracentro e, " +
  "dbo.art_user u Where e.uidresponsable = u.uid and e.borrado = 1";
      
  sequelize.query(sql)
    .spread(function (rows) {
       if (rows.length > 0) {
            res.json(rows);            
          } else {
            res.json({ error_code: 10 })
          }
    });
};

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
   
    case "add":
               
      models.estructuracentro.create({
        nombre: req.body.nombre,
        uidresponsable: req.body.uidresponsable,
        iddivision: req.body.iddivision,
        division: req.body.division,
        oficial: req.body.oficial,
        borrado: 1
      }).then(function (estructuracentro) {   
        
         models.estructuracui.create({
           cui:req.body.iddivision,
           nombre: req.body.nombre,
           uid: req.body.uidresponsable,
           idestructura:estructuracentro.id,
           cuipadre:0,
           nivel:0,
           borrado: 1
           }).then(function (estructuracui) {
               res.json({ error_code: 0 });
              }).catch(function (err) {
               res.json({ error_code: 1 });
              });
           });
      break;
    case "edit":
      models.estructuracentro.update({
        nombre: req.body.nombre,
        uidresponsable: req.body.uidresponsable,
        division: req.body.division,
        oficial: req.body.oficial
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (estructuracentro) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.estructuracentro.destroy({
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