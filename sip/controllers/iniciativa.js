var models = require('../models');
var sequelize = require('../models/index').sequelize;

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


exports.getPMOS = function (req, res) {



  var sql = "select a.uid,a.first_name + ' '  + a.last_name nombre from art_user a join sip.usr_rol  b on a.uid=b.uid join sip.rol r on r.rid=b.rid where glosarol='PMO' order by nombre;"

  sequelize.query(sql).spread(function (response) {
    res.json(response);
  }).error(function (err) {
    res.json(err);
  });

};


exports.getGerentes = function (req, res) {


  var sql = "select a.uid,a.first_name + ' '  + a.last_name nombre from art_user a join sip.usr_rol  b on a.uid=b.uid join sip.rol r on r.rid=b.rid where glosarol='Gerente' order by nombre;"

  sequelize.query(sql).spread(function (response) {
    res.json(response);
  }).error(function (err) {
    res.json(err);
  });

};

exports.getDivisiones = function (req, res) {

  var sql = "select distinct codDivision,glosaDivision from RecursosHumanos " +
    "where periodo=(select max(periodo) from RecursosHumanos) order by glosaDivision";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getProgramas = function (req, res) {

  models.Programa.findAll({ where: { 'is_active': 1 } }).then(function (programa) {
    res.json(programa);
  }).catch(function (err) {
    console.log(err);
    res.json({ error_code: 1 });
  });

};

exports.getEstado = function (req, res) {

  models.Parametro.findAll({ where: { 'tipo': 'estadoiniciativa' } }).then(function (estado) {
    res.json(estado);
  }).catch(function (err) {
    console.log(err);
    res.json({ error_code: 1 });
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

exports.add = function (req, res) {
  // Save the iniciativa and check for errors

  //var sql = "select distinct glosaDivision from RecursosHumanos where codDivision = " + req.body.iddivision;


  var tmp = function (callback) {
    return models.Parametro.find({ where: { 'id': req.body.idestado } }).then(function (parametro) {
      callback(parametro.nombre)
    });
  }

  var tmp2 = function (callback) {
    return models.User.find({ where: { 'uid': req.body.uidpmo } }).then(function (user) {
      callback(user.first_name + ' ' + user.last_name)
    });
  }

  var tmp3 = function (callback) {
    return models.User.find({ where: { 'uid': req.body.uidgerente } }).then(function (user) {
      callback(user.first_name + ' ' + user.last_name)
    });
  }
  var tmp4 = function (callback) {
    return models.RecursosHumanos.find({ limit: 1, where: { 'codDivision': req.body.iddivision } }).then(function (personal) {
      callback(personal.glosaDivision)
    });
  }

  tmp(function (estado) {
    tmp2(function (pmo) {
      tmp3(function (gerente) {
        tmp4(function (personal) {
          models.Iniciativa.create({
            nombre: req.body.nombre,
            iddivision: req.body.iddivision,
            divisionsponsor: personal,
            uidsponsor1: req.body.uidsponsor1,
            sponsor1: req.body.sponsor1,
            uidsponsor2: req.body.uidsponsor2,
            sponsor2: req.body.sponsor2,
            uidgerente: req.body.uidgerente,
            gerenteresponsable: gerente,
            uidpmo: req.body.uidpmo,
            pmoresponsable: pmo,
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
            pptoestimadogasto: req.body.pptoestimadogasto,
            pptoestimadoinversion: req.body.pptoestimadoinversion,
            idestado: req.body.idestado,
            estado: estado,
            borrado: 1
          }).then(function (iniciativa) {
            res.json({ error_code: 0 });
          }).catch(function (err) {
            console.log(err);
            res.json({ error_code: 1 });
          });
        });
      });

    });
  });








};


exports.update = function (req, res) {
  // Save the iniciativa and check for errors
  models.Iniciativa.update({
    nombre: req.body.nombre,
    iddivision: req.body.iddivision,
    divisionsponsor: req.body.divisionsponsor,
    uidsponsor1: req.body.uidsponsor1,
    sponsor1: req.body.sponsor1,
    uidsponsor2: req.body.uidsponsor2,
    sponsor2: req.body.sponsor2,
    uidgerente: req.body.uidgerente,//llave
    gerenteresponsable: req.body.gerenteresponsable,
    uidpmo: req.body.idpmo,
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
    pptoestimadogasto: req.body.pptoestimadogasto,
    pptoestimadoinversion: req.body.pptoestimadoinversion,
    idestado: 1,
    borrado: 1
  }, {
      where: {
        id: req.body.id
      }
    }).then(function (iniciativa) {
      res.json({ error_code: 0 });
    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 1 });
    });

};

exports.del = function (req, res) {
  models.Iniciativa.destroy({
    where: {
      id: req.body.id
    }
  });
};

// Create endpoint /iniciativas for GET
exports.getIniciativasPaginados = function (req, res) {
  // Use the Iniciativas model to find all iniciativas
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";

  if (!sidx)
    sidx = "nombre";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, * " +
    "FROM sip.iniciativa )" +
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
        "as resultNum, * " +
        "FROM sip.iniciativa WHERE " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      models.Iniciativa.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {

      models.Iniciativa.count().then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {

    models.Iniciativa.count().then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
};