var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
 
exports.update = function (req, res) {
  // Save the iniciativa and check for errors
      var rut = req.body.numrut.substring(0,req.body.numrut.length-2); 
      var digito = req.body.numrut.substring(req.body.numrut.length-1,req.body.numrut.length);
  models.Proveedor.update({
    numrut: rut,
    dvrut: digito,
    razonsocial: req.body.razonsocial,
    negociadordivot: req.body.negociadordivot,
    borrado: 1
    }, {
      where: {
        id: req.body.id
      }
    }).then(function (proveedor) {
      res.json({ error_code: 0 });
    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 1 });
    });

};

exports.add = function(req,res) {
    var rut = req.body.numrut.substring(0,req.body.numrut.length-2); 
    var digito = req.body.numrut.substring(req.body.numrut.length-1,req.body.numrut.length);
      
   models.Proveedor.create({
    numrut: rut,
    dvrut: digito,
    razonsocial: req.body.razonsocial,
    negociadordivot: req.body.negociadordivot,
    borrado    : 1
      }).then(function (proveedor) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
};


exports.del = function (req, res) {
  models.Proveedor.destroy({
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
};
 // Create endpoint /proveedores for GET
exports.getProveedoresPaginados = function (req, res) {
  // Use the Proveedores model to find all proveedores
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;  
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "razonsocial";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
    var sql0 = "declare @rowsPerPage as bigint; " +
      "declare @pageNum as bigint;" +
      "set @rowsPerPage=" + rows + "; " +
      "set @pageNum=" + page + ";   " +
      "With SQLPaging As   ( " +
      "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
      "as resultNum, id,CAST(numrut AS VARCHAR) + '-' + dvrut as numrut,razonsocial,negociadordivot " +
      "FROM sip.proveedor )" +
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
        "as resultNum, id,CAST(numrut AS VARCHAR) + '-' + dvrut as numrut,razonsocial,negociadordivot " +
        "FROM sip.proveedor WHERE " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        console.log(sql);

      models.Proveedor.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.Proveedor.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.Proveedor.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};


// Create endpoint /proveedores/:id for GET
exports.getProveedor = function (req, res) {
  // Use the Proveedor model to find a specific proveedor
  models.Proveedor.find({ where: { 'id': req.params.id } }).then(function (proveedor) {
    res.json(proveedor);
  }).error(function (err) {
    res.send(err);
  });
};

// Create endpoint /proveedores/:id for PUT
exports.putProveedor = function (req, res) {
  // Use the Proveedor model to find a specific proveedor
  models.Proveedor.update({ id: req.params.id }, function (err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message: num + ' updated' });
  });
};

// Create endpoint /proveedores/:id for DELETE
exports.deleteProveedor = function (req, res) {
  // Use the Proveedor model to find a specific proveedor and remove it
  models.Proveedor.remove({ id: req.params.id }, function (err) {
    if (err)
      res.send(err);

    res.json({ message: 'Proveedor removed!' });
  });
};

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
       var rut = req.body.numrut.substring(0,req.body.numrut.length-2); 
       var digito = req.body.numrut.substring(req.body.numrut.length-1,req.body.numrut.length);
      
       models.Proveedor.create({
       numrut: rut,
       dvrut: digito,
       razonsocial: req.body.razonsocial,
       negociadordivot: req.body.negociadordivot,
       borrado    : 1
      }).then(function (proveedor) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
      var rut = req.body.numrut.substring(0,req.body.numrut.length-2); 
      var digito = req.body.numrut.substring(req.body.numrut.length-1,req.body.numrut.length);
      models.Proveedor.update({
               numrut: rut,
               dvrut: digito,
               razonsocial: req.body.razonsocial,
               negociadordivot: req.body.negociadordivot,
               borrado: 1
              }, {
      where: {
        id: req.body.id
      }
         }).then(function (proveedor) {
           res.json({ error_code: 0 });
         }).catch(function (err) {
           console.log(err);
           res.json({ error_code: 1 });
         });
      break;
    case "del":
       models.Proveedor.destroy({
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
    sidx = "razonsocial";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.Proveedor.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.Proveedor.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (proveedores) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: proveedores });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}