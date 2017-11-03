var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.listUsers = function(req,res){
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";

    if (!sidx)
        sidx = "first_name";

    if (!sord)
        sord = "asc";
    
    if(filters){
        filters = JSON.parse(filters);

        if (JSON.stringify(filters.rules) != '[]') {
            condition = "WHERE ";
            filters.rules.forEach(function (item) {
                if(item.op === "cn"){
                    condition += item.field + " like '%" + item.data +"%' AND ";
                }
            });

            condition = condition.substring(0,condition.length-4);
        }
    }

    var order = sidx + " " + sord;
    
    var sql_query = "declare @rowsPerPage as bigint;" +
                    "declare @pageNum as bigint;" +
                    "set @rowsPerPage=" + rows + ";" +
                    "set @pageNum=" + page + ";" +
                    "With SQLPaging As( " +
                        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") as resultNum,uid, first_name,last_name,uname,email "+
                        "FROM [dbo].[art_user] " + condition + ") " +
                    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
                        
    logger.debug(sql_query);

    sequelize.query("select count(*) as count from art_user "+condition).then(function(records){
        var total = Math.ceil(records[0][0].count / rows);
        sequelize.query(sql_query)
          .spread(function (rows) {
            res.json({ records: records[0][0].count, total: total, page: page, rows: rows });
        });
    });
};

exports.getRolesUsuario = function(req,res){
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var id = req.params.id;
    var condition = "WHERE uid=" + id;

    if (!sidx)
        sidx = "rolnegocio";

    if (!sord)
        sord = "asc";
    
    if(filters){
        filters = JSON.parse(filters);

        if (JSON.stringify(filters.rules) != '[]') {
            filters.rules.forEach(function (item) {
                if(item.op === "cn"){
                    condition =+" AND " + item.field + " like '%" + item.data +"%' ";
                }
            });
        }
    }

    var order = sidx + " " + sord;
    
    var sql_query = "declare @rowsPerPage as bigint;" +
                    "declare @pageNum as bigint;" +
                    "set @rowsPerPage=" + rows + ";" +
                    "set @pageNum=" + page + ";" +
                    "With SQLPaging As( " +
                        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") as resultNum ,id,uid,rolnegocio "+
                        "FROM [sip].[rol_negocio] " + condition + ") " +
                    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
                        
    logger.debug(sql_query);

    sequelize.query("SELECT COUNT(*) as count FROM [sip].[rol_negocio] " + condition).then(function(records){
        var total = Math.ceil(records[0][0].count / rows);
        sequelize.query(sql_query)
          .spread(function (rows) {
            res.json({ records: records[0][0].count, total: total, page: page, rows: rows });
        });
    });
};

exports.getRoles = function(req,res){
    models.rol_negocio.findAll({
        attributes:["rolnegocio"],
        group:"rolnegocio"
    }).then(function(data){
        res.json(data);
    }).catch(function(){
        res.json({error_code:1});
    });

};

exports.action = function(req,res){
    var action = req.body.oper;
    var sistema = req.session.passport.sidebar[0].sistema;
    
    switch (action) {
      case "add":
        models.rol_negocio.count({
            where: {
                "uid": req.params.id,
                "rolnegocio":req.body.rolnegocio,      
            }
        }).then(function(records){
            if(records>0){
                res.json({error_code:1,error_text:"El usuario ya tiene ese rol"});   
            }else{
                models.rol_negocio.create({
                    uid: req.params.id,
                    rolnegocio:req.body.rolnegocio,
                    borrado: 0,
                    iddelegado: 0
                  }).then(function (parametro) {
                    res.json({ error_code: 0 });
                  }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                  });
            }
        });
        break;
      case "del":
        models.rol_negocio.destroy({
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

};