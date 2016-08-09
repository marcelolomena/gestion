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
  //var idiniciativaprograma = req.params.id;

  if (!sidx)
    sidx = "first_name";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.* "+//, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe " +
    "FROM [dbo].[art_user] a " +
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
        "as resultNum, a.* " +
        "FROM [dbo].[art_user] a " +
        "WHERE ( " + condition.substring(0, condition.length - 4) + ") )" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.user.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.user.count({
        
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.user.count({
      
    }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

exports.list2 = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var filters = req.body.filters;
  var condition = "";
  var user = req.params.id;

  if (!sidx)
    sidx = "uid";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, rol.glosarol "+
    "FROM [sip].[usr_rol] a " +
	   "LEFT OUTER JOIN  [sip].[rol] rol  ON a.rid = rol.[id] " +
    "WHERE (a.[uid] = " + user + " AND a.[borrado] = 1) " +
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
        "as resultNum, a.*, rol.glosarol "+
        "FROM [sip].[usr_rol] a " +
	    "LEFT OUTER JOIN  [sip].[rol] rol  ON a.rid = rol.[id] " +
        "WHERE (a.[uid] = " + user + " AND a.[borrado] = 1) AND " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.usrrol.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.usrrol.count({
        where:
        {
          uid: user
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
      console.log(sql0)
    models.usrrol.count({
      where:
      {
        uid: user
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

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.parametro.create({
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        valor: req.body.valor,
        borrado: 1
      }).then(function (parametro) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.parametro.update({
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        valor: req.body.valor
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (parametro) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      models.parametro.destroy({
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

  var sql = "select distinct tipo from sip.rol " +
    "where borrado=1 order by glosarol";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};