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
      models.Iniciativa.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.Iniciativa.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (iniciativas) {
          var arr = []
          for (var i = 0; i < iniciativa.length; i++) {

            a = [i + 1, iniciativa[i].nombre,
              iniciativa[i].divisionsponsor,
              iniciativa[i].sponsor1,
              iniciativa[i].sponsor2,
              iniciativa[i].pmoresponsable,
              iniciativa[i].gerenteresponsable,
              iniciativa[i].estado,
              iniciativa[i].categoria,
              iniciativa[i].q1,
              iniciativa[i].q2,
              iniciativa[i].q3,
              iniciativa[i].q4,
              iniciativa[i].fechacomite,
              iniciativa[i].ano,
              iniciativa[i].pptoestimadogasto,
              iniciativa[i].pptoestimadoinversion
            ];
            arr.push(a);
          }
          conf.rows = arr;
          var result = nodeExcel.execute(conf);
          res.setHeader('Content-Type', 'application/vnd.openxmlformates');
          res.setHeader("Content-Disposition", "attachment;filename=" + "iniciativas.xlsx");
          res.end(result, 'binary');

        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });


};

exports.getUsersByRol = function (req, res) {
  models.User.belongsToMany(models.Rol, { foreignKey: 'uid', through: models.UsrRol });
  models.Rol.belongsToMany(models.User, { foreignKey: 'rid', through: models.UsrRol });

  models.User.findAll({
    order: ['[User].first_name', '[User].last_name'],
    include: [{
      model: models.Rol,
      where: { 'glosarol': req.params.rol },
    }]
  }).then(function (gerentes) {
    //gerentes.forEach(log)
    res.json(gerentes);
  }).catch(function (err) {
    console.log(err);
    res.json({ error_code: 1 });
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
  models.Iniciativa.find({ where: { 'id': req.params.id } }).then(function (iniciativa) {
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
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      console.log("->>> " + err)
    } else {
      models.Iniciativa.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.Iniciativa.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data
        }).then(function (iniciativas) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: iniciativas });
        }).catch(function (err) {
          //console.log(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

}

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.Iniciativa.create({
        nombre: req.body.nombre,
        iddivision: req.body.iddivision,
        divisionsponsor: req.body.divisionsponsor,
        uidsponsor1: req.body.uidsponsor1,
        sponsor1: req.body.sponsor1,
        uidsponsor2: req.body.uidsponsor2,
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
        pptoestimadogasto: req.body.pptoestimadogasto.split(".").join("").replace(",", "."),
        pptoestimadoinversion: req.body.pptoestimadoinversion.split(".").join("").replace(",", "."),
        idestado: req.body.idestado,
        estado: req.body.estado,
        borrado: 1
      }).then(function (iniciativa) {
        res.json({ error_code: 0 });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":
      models.Iniciativa.update({
        nombre: req.body.nombre,
        iddivision: req.body.iddivision,
        divisionsponsor: req.body.divisionsponsor,
        uidsponsor1: req.body.uidsponsor1,
        sponsor1: req.body.sponsor1,
        uidsponsor2: req.body.uidsponsor2,
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
        pptoestimadogasto: req.body.pptoestimadogasto.split(".").join("").replace(",", "."),
        pptoestimadoinversion: req.body.pptoestimadoinversion.split(".").join("").replace(",", "."),
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
      break;
    case "del":
      models.Iniciativa.destroy({
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