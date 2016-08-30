var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}

exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var filters = req.body.filters;
  var condition = "";
  var constants = require("../utils/constants");
  //var idiniciativaprograma = req.params.id;

  if (!sidx)
    sidx = "b.first_name";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var rol = req.user[0].rid;
  var uid = req.user[0].uid;
  if (rol == constants.ROLADMDIVOT) {

    var sql0 = "declare @rowsPerPage as bigint; " +
      "declare @pageNum as bigint;" +
      "set @rowsPerPage=" + rows + "; " +
      "set @pageNum=" + page + ";   " +
      "With SQLPaging As   ( " +
      "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
      "as resultNum, a.*, b.first_name, b.last_name, b.uname, b.email, c.uid as uiddelegado, c.first_name+c.last_name  as nombredelegado " +//, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe " +
      "FROM [sip].[rol_negocio] a LEFT OUTER JOIN [dbo].[art_user] b on a.uid=b.uid LEFT OUTER JOIN [dbo].[art_user] c on a.iddelegado=c.uid " +
      ") " +
      "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
  } else {

    var sql0 = "declare @rowsPerPage as bigint; " +
      "declare @pageNum as bigint;" +
      "set @rowsPerPage=" + rows + "; " +
      "set @pageNum=" + page + ";   " +
      "With SQLPaging As   ( " +
      "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
      "as resultNum, a.*, b.first_name, b.last_name, b.uname, b.email, c.uid as uiddelegado, c.first_name+c.last_name  as nombredelegado " +//, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe " +
      "FROM [sip].[rol_negocio] a LEFT OUTER JOIN [dbo].[art_user] b on a.uid=b.uid LEFT OUTER JOIN [dbo].[art_user] c on a.iddelegado=c.uid " +
      "WHERE a.uid = " + uid + ") " +
      "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";


  }
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
        "as resultNum, a.*, b.first_name, b.last_name, b.uname, b.email  " +//, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe " +
        "FROM [sip].[rol_negocio] a LEFT OUTER JOIN [dbo].[art_user] b on a.uid=b.uid" +
        "WHERE ( " + condition.substring(0, condition.length - 4) + ") )" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.rol_negocio.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      if (rol != constants.ROLADMDIVOT) {

        models.rol_negocio.count({
          where: {
            uid: uid
          }
        }).then(function (records) {
          var total = Math.ceil(records / rows);
          sequelize.query(sql0)
            .spread(function (rows) {
              res.json({ records: records, total: total, page: page, rows: rows });
            });
        })
      } else {
        models.rol_negocio.count({
        }).then(function (records) {
          var total = Math.ceil(records / rows);
          sequelize.query(sql0)
            .spread(function (rows) {
              res.json({ records: records, total: total, page: page, rows: rows });
            });
        })


      }


    }

  } else {



    if (rol != constants.ROLADMDIVOT) {

        models.rol_negocio.count({
          where: {
            uid: uid
          }
        }).then(function (records) {
          var total = Math.ceil(records / rows);
          sequelize.query(sql0)
            .spread(function (rows) {
              res.json({ records: records, total: total, page: page, rows: rows });
            });
        })
      } else {
        models.rol_negocio.count({
        }).then(function (records) {
          var total = Math.ceil(records / rows);
          sequelize.query(sql0)
            .spread(function (rows) {
              res.json({ records: records, total: total, page: page, rows: rows });
            });
        })


      }

  }
};


exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.usrrol.create({
        uid: req.body.parent_id,
        rid: req.body.rid,
        borrado: 1
      }).then(function (parametro) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "del":
      models.usrrol.destroy({
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

exports.getRoles = function (req, res) {

  var sql = "select * from sip.rol " +
    "where borrado=1 order by glosarol";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};