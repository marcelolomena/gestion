var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

exports.getContactos = function (req, res) {
  //var idContrato = req.params.id


  models.ContactoProveedor.findAll({ where: [{ 'borrado': 1 }, { 'idproveedor': req.params.id }], order: 'contacto' }).then(function (contacto) {
    res.json(contacto);
  }).catch(function (err) {
    console.log(err);
    res.json({ error_code: 1 });
  });


};

// Create endpoint /proyecto for GET
exports.getContactos = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idproveedor=" + id;

  if (!sidx)
    sidx = "contacto";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum,id, contacto,fono,correo " +
    "FROM sip.contactoproveedor where idproveedor=" + id + ")" +
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
        "as resultNum, id,contacto,fono,correo " +
        "FROM sip.contactoproveedor WHERE " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.ContactoProveedor.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.ContactoProveedor.count({ where: [filtrosubgrilla] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.ContactoProveedor.count({ where: [filtrosubgrilla] }).then(function (records) {
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
//parent_id
  switch (action) {
    case "add":
       models.ContactoProveedor.create({
         idproveedor:req.body.parent_id,
       contacto: req.body.contacto,
       fono: req.body.fono,
       correo: req.body.correo,
       borrado    : 1
      }).then(function (contactos) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
      models.ContactoProveedor.update({
              contacto: req.body.contacto,
              fono: req.body.fono,
              correo: req.body.correo,
              borrado: 1
              }, {
      where: {
        id: req.body.id
      }
         }).then(function (contactos) {
           res.json({ error_code: 0 });
         }).catch(function (err) {
           console.log(err);
           res.json({ error_code: 1 });
         });
      break;
    case "del":
       models.ContactoProveedor.destroy({
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

};
exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "contacto";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  var additional = [{
    "field": "idproveedor",
    "op": "eq",
    "data": req.params.id
  }];

  utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.ContactoProveedor.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.ContactoProveedor.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (contactos) {
          res.json({ records: records, total: total, page: page, rows: contactos });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}