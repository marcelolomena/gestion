var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');


exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      var rut = req.body.numrut.substring(0, req.body.numrut.length - 2);
      var digito = req.body.numrut.substring(req.body.numrut.length - 1, req.body.numrut.length);

      models.proveedor.create({
        numrut: rut.split(".").join("").replace(",", "."),
        dvrut: digito,
        razonsocial: req.body.razonsocial,
        uid:req.body.uid,
        negociadordivot: req.body.negociadordivot,
        borrado: 1
      }).then(function (proveedor) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
      var rut = req.body.numrut.substring(0, req.body.numrut.length - 2);
      var digito = req.body.numrut.substring(req.body.numrut.length - 1, req.body.numrut.length);
      models.proveedor.update({
        numrut: rut.split(".").join("").replace(",", "."),
        dvrut: digito,
        razonsocial: req.body.razonsocial,
        uid:req.body.uid,
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
      models.proveedor.destroy({
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

exports.combobox = function (req, res) {
  models.proveedor.findAll({
    order: 'razonsocial'
  }).then(function (proveedores) {
    //iniciativas.forEach(log)
    res.json(proveedores);
  }).catch(function (err) {
    //console.log(err);
    res.json({ error_code: 1 });
  });
}

exports.list = function (req, res) {
  // Use the Proyectos model to find all proveedores
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;
  var condition = "";

  if (!sidx)
    sidx = "razonsocial";

  if (!sord)
    sord = "asc ";

  var orden = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + orden + ") " +
    "as resultNum, id, numrut, dvrut, razonsocial, uid, negociadordivot, borrado "+ 
    "from sip.proveedor where proveedor.borrado = 1 ORDER BY razonsocial asc )" +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql0);
            console.log(sql);

  if (filters) {
    var jsonObj = JSON.parse(filters);

    if (JSON.stringify(jsonObj.rules) != '[]') {

      jsonObj.rules.forEach(function (item) {

        if (item.op === 'cn') {
          if (item.field === 'numrut')
            condition += "rtrim(convert(char,numrut))+'-'+dvrut"  + " like '%" + item.data + "%' AND "
          else 
            condition +=  item.field + " like '%" + item.data + "%' AND "
        }

      });

      var sql = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + orden + ") " +
        "as resultNum,id, numrut, dvrut, razonsocial, uid, negociadordivot, borrado "+ 
        "from sip.proveedor where proveedor.borrado = 1 and " + condition.substring(0, condition.length - 4) + " ORDER BY razonsocial asc) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.proveedor.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {

            res.json({ records: records, total: total, page: page, rows: rows });
          });
       })

    } else {
            console.log(sql0);
      models.proveedor.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })  
  }
  }
  else {
      console.log(sql0);
      models.proveedor.count().then(function (records) {
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
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  console.log("->>> " + filters)

  // JSON.stringify(jsonObj.rules)

  //  if (filters.rules.field == 'numrut') {
  //    filters.rules.field = "rtrim(convert(varchar,[proveedor].[numrut]))+'-'+[proveedor].[dvrut]";
  //  }

  //console.log("->>> " + filters)

  if (!sidx)
    sidx = "razonsocial";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      //console.log("data->>> " + data[1].rules)
      models.proveedor.count({        
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.proveedor.findAll({
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

};

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
      caption: 'Rut',
      type: 'number',
      width: 10
    },
    {
      caption: 'Razon Social',
      type: 'string',
      width: 50
    },
    {
      caption: 'Negociador DIVOT',
      type: 'string',
      width: 50
    },
    {
      caption: 'Contacto',
      type: 'string',
      width: 50
    },
    {
      caption: 'Telefono',
      type: 'number',
      width: 10
    },
    {
      caption: 'Correo',
      type: 'string',
      width: 50
    }
  ];
  
 var sql = "SELECT CAST(numrut AS VARCHAR) +'-'+a.dvrut as numrut, a.razonsocial as razonsocial, b.first_name+' '+b.last_name as negociadordivot "+
    ",isnull(c.contacto,' ') as contacto,c.fono as fono,isnull(c.correo,' ') as correo "+
    "FROM sip.proveedor a left join dbo.art_user b on a.uid = b.uid left join sip.contactoproveedor c on a.id = c.idproveedor order by a.numrut"
    
    sequelize.query(sql)
      .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].numrut,
          proyecto[i].razonsocial,
          proyecto[i].negociadordivot,
          proyecto[i].contacto,
          proyecto[i].fono,
          proyecto[i].correo
        ];
        console.log(a);
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "Proveedores.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};