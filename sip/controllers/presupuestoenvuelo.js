var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
  console.dir(inst.get())
}

exports.getPersonal = function (req, res) {

  var term = req.query.term;

  var sql = "SELECT LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ) value," +
    "RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)) label " +
    "FROM RecursosHumanos WHERE LEN(emailTrab) != 1 AND " +
    "periodo=(select max(periodo) from RecursosHumanos) AND " +
	   "nombre+apellido like '%" + term + "%' order by nombre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;

  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'Nombre',
      type: 'string',
      width: 50
    },
    {
      caption: 'División',
      type: 'string',
      width: 100
    },
    {
      caption: 'Sponsor 1',
      type: 'string',
      width: 50
    },
    {
      caption: 'Sponsor 2',
      type: 'string',
      width: 50
    },
    {
      caption: 'PMO',
      type: 'string',
      width: 50
    },
    {
      caption: 'Gerente',
      type: 'string',
      width: 50
    },
    {
      caption: 'Estado',
      type: 'string',
      width: 50
    },
    {
      caption: 'Categoría',
      type: 'string',
      width: 50
    },
    {
      caption: 'Q1',
      type: 'string',
      width: 15
    },
    {
      caption: 'Q2',
      type: 'string',
      width: 15
    },
    {
      caption: 'Q3',
      type: 'string',
      width: 15
    },
    {
      caption: 'Q4',
      type: 'string',
      width: 15
    },
    {
      caption: 'Fecha Comite',
      type: 'string',
      width: 15
    },
    {
      caption: 'Año',
      type: 'number',
      width: 15
    },
    {
      caption: 'Presupuesto Gasto (USD)',
      type: 'number',
      width: 15
    },
    {
      caption: 'Presupuesto Inversión (USD)',
      type: 'number',
      width: 15
    }

  ];

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      log(err)
    } else {
      models.iniciativa.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.iniciativa.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: order,
          where: data
        }).then(function (iniciativas) {
          var arr = []
          for (var i = 0; i < iniciativas.length; i++) {

            a = [i + 1, iniciativas[i].nombre,
              iniciativas[i].divisionsponsor,
              iniciativas[i].sponsor1,
              iniciativas[i].sponsor2,
              iniciativas[i].pmoresponsable,
              iniciativas[i].gerenteresponsable,
              iniciativas[i].estado,
              iniciativas[i].categoria,
              iniciativas[i].q1,
              iniciativas[i].q2,
              iniciativas[i].q3,
              iniciativas[i].q4,
              iniciativas[i].fechacomite,
              iniciativas[i].ano,
              iniciativas[i].pptoestimadogasto,
              iniciativas[i].pptoestimadoinversion
            ];
            arr.push(a);
          }
          conf.rows = arr;
          var result = nodeExcel.execute(conf);
          res.setHeader('Content-Type', 'application/vnd.openxmlformates');
          res.setHeader("Content-Disposition", "attachment;filename=" + "iniciativas.xlsx");
          res.end(result, 'binary');

        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });


};

exports.getDivisiones = function (req, res) {

  var sql = "select * from art_division_master " +
    "where is_deleted=0 order by division";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.get = function (req, res) {
  models.presupuestoenvuelo.find({ where: { 'id': req.params.id } }).then(function (iniciativa) {
    res.json(iniciativa);
  }).catch(function (err) {
    console.log(err);
    res.json({ error_code: 1 });
  });
};

exports.list = function (req, res) {
  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var condition = "";
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombreproyecto";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.*, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe, pmo.[first_name] +' '+ pmo.[last_name] as nombrepmo, programa.program_code as codigoart "+
	"FROM [sip].[presupuestoenvuelo] a "+
	   "JOIN [dbo].[art_user] lider  ON a.[uidlider] = lider.[uid] "+ 
	   "JOIN  [dbo].[art_user] jefeproyecto  ON a.[uidjefeproyecto] = jefeproyecto.[uid] "+
     "JOIN [dbo].[art_user] pmo  ON a.[uidpmoresponsable] = pmo.[uid] "+
     "JOIN [dbo].[art_program] programa  ON a.[program_id] = programa.[program_id] "+
     "WHERE (a.[borrado] = 1) " +
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
        "as resultNum, a.*, lider.[first_name]+ ' '+lider.[last_name] as nombrelider, jefeproyecto.[first_name] +' '+ jefeproyecto.[last_name] as nombrejefe, pmo.[first_name] +' '+ pmo.[last_name] as nombrepmo "+
	"FROM [sip].[presupuestoenvuelo] a "+
	   "JOIN [dbo].[art_user] lider  ON a.[uidpmoresponsable] = lider.[uid] "+ 
     "JOIN [dbo].[art_user] pmo  ON a.[uidlider] = pmo.[uid] "+
	   "JOIN  [dbo].[art_user] jefeproyecto  ON a.uidjefeproyecto = jefeproyecto.[uid] "+
     "WHERE ( a.[borrado] = 1) AND " + condition.substring(0, condition.length - 4) + ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        
        console.log(sql);

      models.presupuestoenvuelo.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.presupuestoenvuelo.count({
        
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.presupuestoenvuelo.count({
    
      }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }

/*
  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.presupuestoenvuelo.belongsTo(models.programa, { foreignKey: 'program_id'});
      models.presupuestoenvuelo.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.presupuestoenvuelo.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [
            {
              model: models.programa
            }
          ]

        }).then(function (iniciativas) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });
  */

}

exports.combobox = function (req, res) {
  models.iniciativa.findAll({
    order: 'nombre'
  }).then(function (iniciativas) {
    //iniciativas.forEach(log)
    res.json(iniciativas);
  }).catch(function (err) {
    //console.log(err);
    res.json({ error_code: 1 });
  });
}

exports.action = function (req, res) {
  var action = req.body.oper;
  var gasto, inversion,previsto = 0
  var gastoaprobado, inversionaprobada,aprobado,aprobadodolares = 0
/*
if (action != "del") {
    if (req.body.pptoestimadogasto != "")
      gasto = req.body.pptoestimadogasto.split(".").join("").replace(",", ".")

    if (req.body.pptoestimadoinversion != "")
      inversion = req.body.pptoestimadoinversion.split(".").join("").replace(",", ".")
      
    if (req.body.pptoestimadoprevisto != "")
      previsto = req.body.pptoestimadoprevisto.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadogasto != "")
      gastoaprobado = req.body.pptoaprobadogasto.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadoinversion != "")
      inversionaprobada = req.body.pptoaprobadoinversion.split(".").join("").replace(",", ".")
      
    if (req.body.pptoaprobadoprevisto != "")
      aprobado = req.body.pptoaprobadoprevisto.split(".").join("").replace(",", ".")

    if (req.body.pptoaprobadodolares != "")
      aprobadodolares = req.body.pptoaprobadodolares.split(".").join("").replace(",", ".")
  }
  */


  switch (action) {
    case "add":
      if (req.body.fechacomite == "") {
        models.iniciativa.create({
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          sponsor1: req.body.sponsor1,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          //fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          /*
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          */
          idestado: req.body.idestado,
          estado: req.body.estado,
          borrado: 1
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      } else {
        models.iniciativa.create({
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          sponsor1: req.body.sponsor1,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          /*
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          */
          idestado: req.body.idestado,
          estado: req.body.estado,
          borrado: 1
        }).then(function (iniciativa) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      }
      break;
    case "edit":
      if (req.body.fechacomite == "") {
        models.iniciativa.update({
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          sponsor1: req.body.sponsor1,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          //fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          /*
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          */
          idestado: req.body.idestado,
          estado: req.body.estado
        }, {
            where: {
              id: req.body.id
            }
          }).then(function (contrato) {
            res.json({ error_code: 0 });
          }).catch(function (err) {
            console.log(err);
            res.json({ error_code: 1 });
          });
      } else {
        models.iniciativa.update({
          nombre: req.body.nombre,
          iddivision: req.body.iddivision,
          divisionsponsor: req.body.divisionsponsor,
          sponsor1: req.body.sponsor1,
          sponsor2: req.body.sponsor2,
          uidgerente: req.body.uidgerente,
          gerenteresponsable: req.body.gerenteresponsable,
          uidpmo: req.body.uidpmo,
          pmoresponsable: req.body.pmoresponsable,
          idtipo: req.body.idtipo,
          tipo: req.body.tipo,
          idcategoria: req.body.idcategoria,
          categoria: req.body.categoria,
          ano: req.body.ano,
          anoq: req.body.anoq,
          q1: req.body.q1,
          q2: req.body.q2,
          q3: req.body.q3,
          q4: req.body.q4,
          fechacomite: req.body.fechacomite,
          idmoneda: req.body.idmoneda,
          /*
          pptoestimadogasto: gasto,
          pptoestimadoinversion: inversion,
          pptoestimadoprevisto: previsto,
          pptoaprobadogasto: gastoaprobado,
          pptoaprobadoinversion: inversionaprobada,
          pptoaprobadoprevisto: aprobado,
          pptoaprobadodolares: aprobadodolares,
          */
          idestado: req.body.idestado,
          estado: req.body.estado
        }, {
            where: {
              id: req.body.id
            }
          }).then(function (contrato) {
            res.json({ error_code: 0 });
          }).catch(function (err) {
            console.log(err);
            res.json({ error_code: 1 });
          });
      }
      break;
    case "del":
      models.iniciativa.destroy({
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