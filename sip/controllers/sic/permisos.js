var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');

exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var filters = req.body.filters;
  var condition = "";
  var sistema = req.session.passport.sidebar[0].sistema;

  if (!sidx)
    sidx = "glosarol";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.id, a.glosarol FROM sip.rol a JOIN sip.usr_rol b ON a.id=b.rid WHERE b.idsistema="+sistema+ " "+
    "GROUP BY a.id, a.glosarol "+
	    ") " +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
logger.debug(sql0);
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
        "as resultNum, a.id, a.glosarol FROM sip.rol a JOIN sip.usr_rol b ON a.id=b.rid WHERE b.idsistema="+sistema+ " "+
        "GROUP BY a.id, a.glosarol "+
        "WHERE ( " + condition.substring(0, condition.length - 4) + ") )" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      logger.debug(sql);

      models.rol.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.rol.count({
        
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.rol.count({
      
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
  var rid = req.params.id;
  var sistema = req.session.passport.sidebar[0].sistema;

  if (!sidx)
    sidx = "mid";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, menu.descripcion "+
    "FROM [sip].[rol_func] a " +
	   "LEFT OUTER JOIN  [sip].[menu] menu  ON a.mid = menu.[id] " +
    "WHERE (a.[rid] = " + rid + " AND a.[borrado] = 1 AND menu.nivel=0 AND menu.idsistema="+ sistema +") " +
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
        "as resultNum, a.*, menu.descripcion "+
        "FROM [sip].[rol_func] a " +
	   "LEFT OUTER JOIN  [sip].[menu] menu  ON a.mid = menu.[id] " +
        "WHERE (a.[rid] = " + rid + " AND a.[borrado] = 1 AND menu.nivel=0 AND menu.idsistema="+ sistema +") AND " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      logger.debug(sql);

      models.rolfunc.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.rolfunc.count({
        where:
        {
          rid: rid
        }
      }).then(function (records) {

        var total = Math.ceil(records / rows);
        logger.debug(sql0);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {
      logger.debug(sql0)
    models.rolfunc.count({
      where:
      {
        rid: rid
      }
    }).then(function (records) {
        
      var total = Math.ceil(records / rows);
      logger.debug(sql0);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};

exports.list3 = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var filters = req.body.filters;
  var condition = "";
  var rid = req.params.rid;
  var mid = req.params.mid;

  if (!sidx)
    sidx = "mid";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, menu.descripcion "+
    "FROM [sip].[rol_func] a " +
	   "LEFT OUTER JOIN  [sip].[menu] menu  ON a.mid = menu.[id] " +
    "WHERE (a.[rid] = " + rid + " AND a.[borrado] = 1 AND menu.pid="+mid+") " +
    ") " +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
    logger.debug("la query: "+sql0);

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
        "as resultNum, a.*, menu.descripcion "+
        "FROM [sip].[rol_func] a " +
	   "LEFT OUTER JOIN  [sip].[menu] menu  ON a.mid = menu.[id] " +
        "WHERE (a.[rid] = " + rid + " AND a.[borrado] = 1 AND menu.pid="+mid+") AND " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      logger.debug(sql);

      models.rolfunc.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.rolfunc.count({
        where:
        {
          rid: rid
        }
      }).then(function (records) {

        var total = Math.ceil(records / rows);
        logger.debug(sql0);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {
      logger.debug(sql0)
    models.rolfunc.count({
      where:
      {
        rid: rid
      }
    }).then(function (records) {
        
      var total = Math.ceil(records / rows);
      logger.debug(sql0);
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
      models.rolfunc.create({
        rid: req.body.parent_id,
        mid: req.body.mid,
        borrado: 1
      }).then(function (parametro) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "del":
      models.rolfunc.destroy({
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

}

exports.action2 = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.rolfunc.create({
        rid: req.body.rid,
        mid: req.body.mid,
        borrado: 1
      }).then(function (parametro) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "del":
      models.rolfunc.destroy({
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

}

exports.getMenus = function (req, res) {
  var sistema = req.session.passport.sidebar[0].sistema;
  logger.debug("******sistemaok*********:" + sistema);

  var sql = "select * from sip.menu " +
    "where borrado=1 and nivel=0 and idsistema="+sistema+" order by descripcion";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getSubMenus = function (req, res) {

  var padre = req.query.id;

  var sql = "select * from sip.menu " +
    "where borrado=1 and  pid="+padre+" order by descripcion";
    logger.debug(sql);
  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};