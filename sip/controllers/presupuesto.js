var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var constants = require("../utils/constants");
var logger = require("../utils/logger");

// List para pagina principal de presupuesto
// Lista presupuesto propios y de sus cui hijos
exports.getPresupuestoPaginados = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "a.id";

  if (!sord)
    sord = "desc";

  var order = sidx + " " + sord;
  //var cuis = getCuis(req.session.passport.user);

  var superCui = function (uid, callback) {
    var rol = req.session.passport.sidebar[0].rid;
    if (rol != constants.ROLADMDIVOT) {
      var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + uid;
      logger.debug("query:" + sql1);
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            logger.debug("query:" + rows + ", valor:" + rows[0].cui);
            idcui = rows[0].cui;
          } else {
            idcui = 0; //cui no existente para que no encuentre nada
          }
        }).then(function (servicio) {
          var sql = "select a.id " +
            "from   sip.estructuracui a " +
            "where  a.cui = " + idcui + " " +
            "union " +
            "select b.id " +
            "from   sip.estructuracui a,sip.estructuracui b " +
            "where  a.cui = " + idcui + " " +
            "  and  a.cui = b.cuipadre " +
            "union " +
            "select c.id " +
            "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c " +
            "where  a.cui = " + idcui + " " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "union " +
            "select d.id " +
            "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d " +
            "where  a.cui = " + idcui + " " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "  and  c.cui = d.cuipadre ";
          sequelize.query(sql)
            .spread(function (rows) {
              var cuis = "";
              logger.debug("En cuis:" + rows);
              for (i = 0; i < rows.length; i++) {
                //logger.debug("cui:" + rows[i].id);
                cuis = cuis + rows[i].id + ",";
              }
              //return cuis.substring(0, cuis.length - 1);
              logger.debug("antes call:" + cuis.substring(0, cuis.length - 1));
              callback(cuis.substring(0, cuis.length - 1));
            });
        });
    } else {
      callback("*");
    }
  };

  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn')
          if (item.field == 'CUI' || item.field == 'nombre' || item.field == 'nombreresponsable') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'estado') {
            condition += "a.estado like '%" + item.data + "%' AND ";
          } else {
            condition += 'c.' + item.field + "=" + item.data + " AND ";
          }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }

    superCui(req.session.passport.user, function (elcui) {//req.user[0].uid
      logger.debug('elcui:' + elcui)
      var rol = req.session.passport.sidebar[0].rid;//req.user[0].rid;
      var sqlok;
      if (rol == constants.ROLADMDIVOT) {
        sqlok = "declare @rowsPerPage as bigint; " +
          "declare @pageNum as bigint;" +
          "set @rowsPerPage=" + rowspp + "; " +
          "set @pageNum=" + page + ";   " +
          "With SQLPaging As   ( " +
          "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY a.id desc) " +
          "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable, c.ejercicio " +
          "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id " +
          "JOIN sip.ejercicios c ON c.id=a.idejercicio ";
        if (filters && condition != "") {
          logger.debug("**" + condition + "**");
          sqlok += "WHERE " + condition + " ";
        }
        sqlok += "ORDER BY id desc) " +
          "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        sqlcount = "Select count(*) AS count FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id JOIN sip.ejercicios c ON c.id=a.idejercicio ";
        if (filters && condition != "") {
          sqlcount += "WHERE " + condition + " ";
        }          
      } else {
        sqlok = "declare @rowsPerPage as bigint; " +
          "declare @pageNum as bigint;" +
          "set @rowsPerPage=" + rowspp + "; " +
          "set @pageNum=" + page + ";   " +
          "With SQLPaging As   ( " +
          "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY a.id desc) " +
          "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
          "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id " +
          "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
          "WHERE a.idcui IN (" + elcui + ") ";
        if (filters && condition != "") {
          logger.debug("**" + condition + "**");
          sqlok += "AND " + condition + " ";
        }
        sqlok += "ORDER BY id desc) " +
          "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        sqlcount = "Select count(*) AS count FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id JOIN sip.ejercicios c ON c.id=a.idejercicio ";
        sqlcount +=  "WHERE a.idcui IN (" + elcui + ") ";
        if (filters && condition != "") {
          sqlcount += "AND " + condition + " ";
        }          
      }
      
      sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        logger.debug("####COUNT:" + recs[0].count + " Total:" + total);
        logger.debug("EL SUPER ID : " + req.session.passport.user)
        logger.debug("ROL : " + req.session.passport.sidebar[0].rid)
      sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
      });
    });
  })
};


function getCuis(uid) {
  var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + uid;
  logger.debug("query:" + sql1);
  sequelize.query(sql1)
    .spread(function (rows) {
      if (rows.length > 0) {
        logger.debug("query:" + rows + ", valor:" + rows[0].cui);
        idcui = rows[0].cui;
      } else {
        idcui = 0; //cui no existente para que no encuentre nada
      }
    }).then(function (servicio) {
      var sql = "select a.id " +
        "from   sip.estructuracui a " +
        "where  a.cui = " + idcui + " " +
        "union " +
        "select b.id " +
        "from   sip.estructuracui a,sip.estructuracui b " +
        "where  a.cui = " + idcui + " " +
        "  and  a.cui = b.cuipadre " +
        "union " +
        "select c.id " +
        "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c " +
        "where  a.cui = " + idcui + " " +
        "  and  a.cui = b.cuipadre " +
        "  and  b.cui = c.cuipadre " +
        "union " +
        "select d.id " +
        "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d " +
        "where  a.cui = " + idcui + " " +
        "  and  a.cui = b.cuipadre " +
        "  and  b.cui = c.cuipadre " +
        "  and  c.cui = d.cuipadre ";
      sequelize.query(sql)
        .spread(function (rows) {
          var cuis;
          logger.debug("En cuis:" + rows);
          for (i = 0; i < rows.length; i++) {
            logger.debug("cui:" + rows[i].id);
            cuis = cuis + rows[i].id + ",";
          }
          return cuis.substring(0, cuis.length - 1);
        });
    });
}

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  logger.debug("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'CUI',
      type: 'number',
      width: 10
    },
    {
      caption: 'Nombre CUI',
      type: 'string',
      width: 40
    },
    {
      caption: 'Responsable',
      type: 'string',
      width: 40
    },
    {
      caption: 'Ejercicio',
      type: 'number',
      width: 20
    },
    {
      caption: 'Versión',
      type: 'number',
      width: 10
    },
    {
      caption: 'Estado',
      type: 'string',
      width: 15
    },
    {
      caption: 'Monto Forecast',
      type: 'number',
      width: 15
    },
    {
      caption: 'Monto Anual',
      type: 'number',
      width: 15
    },
    {
      caption: 'Descripción',
      type: 'string',
      width: 30
    }
  ];

  var sql = "SELECT a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
    "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.secuencia " +
    "JOIN sip.ejercicios c ON c.id=a.idejercicio ";

  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].CUI,
          proyecto[i].nombre,
          proyecto[i].responsable,
          proyecto[i].ejercicio,
          proyecto[i].version,
          proyecto[i].estado,
          proyecto[i].montoforecast,
          proyecto[i].montoanual,
          proyecto[i].descripcion
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "Presupuestos.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.err(err);
      res.json({ error_code: 100 });
    });

};

exports.getUsersByRol = function (req, res) {
  //logger.debug(req.query.rol);
  logger.debug(req.params.rol);

  models.user.belongsToMany(models.rol, { foreignKey: 'uid', through: models.usrrol });
  models.rol.belongsToMany(models.user, { foreignKey: 'id', through: models.usrrol });
  //{through: 'UserRole', constraints: true}
  models.User.findAll({
    include: [{
      model: models.rol,
      //attributes:['first_name'],
      where: { 'glosarol': req.params.rol },
      order: ['"first_name" ASC', '"last_name" ASC']
    }]
  }).then(function (gerentes) {
    //gerentes.forEach(log)
    res.json(gerentes);
  }).catch(function (err) {
    logger.error(err);
    res.json({ error_code: 1 });
  });

};

exports.getRolNegocio = function (req, res) {
  var idcui;
  var rol = req.session.passport.sidebar[0].rid;
  logger.debug("******usr*********:" + req.session.passport.user);
  logger.debug("******rol*********:" + req.session.passport.sidebar[0].rid);
  logger.debug("*ROLADM*:" + constants.ROLADMDIVOT+ ", "+rol);
  if (rol == constants.ROLADMDIVOT) {
    res.json({ error_code: 0 });
  } else {
    res.json({ error_code: 10 });
  }
};

exports.getCUIs = function (req, res) {
  var idcui;
  var rol = req.session.passport.sidebar[0].rid;
  logger.debug("******usr*********:" + req.session.passport.user);
  logger.debug("******rol*********:" + req.session.passport.sidebar[0].rid);
  logger.debug("*ROLADM*:" + constants.ROLADMDIVOT);
  if (rol == constants.ROLADMDIVOT) {
    var sql = "SELECT id, convert(VARCHAR, cui)+' '+nombre AS nombre FROM sip.estructuracui " +
      "ORDER BY nombre";
    sequelize.query(sql)
      .spread(function (rows) {
        res.json(rows);
      }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
      });
  } else {
    var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + req.session.passport.user;
    logger.debug("query:" + sql1);
    sequelize.query(sql1)
      .spread(function (rows) {
        if (rows.length > 0) {
          logger.debug("query:" + rows + ", valor:" + rows[0].cui);
          idcui = rows[0].cui;
        } else {
          idcui = 0; //cui no existente para que no encuentre nada
        }
      }).then(function (servicio) {
        var sql = "select a.id, a.nombre " +
          "from   sip.estructuracui a " +
          "where  a.cui = " + idcui + " " +
          "union " +
          "select b.id, b.nombre " +
          "from   sip.estructuracui a,sip.estructuracui b " +
          "where  a.cui = " + idcui + " " +
          "  and  a.cui = b.cuipadre " +
          "union " +
          "select c.id, c.nombre " +
          "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c " +
          "where  a.cui = " + idcui + " " +
          "  and  a.cui = b.cuipadre " +
          "  and  b.cui = c.cuipadre " +
          "union " +
          "select d.id, d.nombre " +
          "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d " +
          "where  a.cui = " + idcui + " " +
          "  and  a.cui = b.cuipadre " +
          "  and  b.cui = c.cuipadre " +
          "  and  c.cui = d.cuipadre ";
        sequelize.query(sql)
          .spread(function (rows) {
            res.json(rows);
          }).catch(function (err) {
            logger.error(err)
            res.json({ error_code: 1 });
          });
      });
  }
};


exports.getEjercicios = function (req, res) {

  var sql = "SELECT id, ejercicio FROM sip.ejercicios where estado='vigente'";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getVersion = function (req, res) {
  var cui = req.params.cui;
  var ejercicio = req.params.ejercicio;
  var sql = "SELECT max(version) AS version " +
    "FROM sip.presupuesto WHERE idcui=" + cui + " AND idejercicio=" + ejercicio;

  logger.debug("***SQL***:" + sql);
  sequelize.query(sql)
    .spread(function (rows) {
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.json({ version: 1 });
      }
    });

};

exports.action = function (req, res) {
  var action = req.body.oper;
  var idpre = req.body.id;
  var version = req.body.version;
  var id_cui = req.body.idcui;
  var ejercicio = req.body.idejercicio;
  logger.debug("Id Prep:" + idpre);
  logger.debug("Ejercicio:" + ejercicio);
  logger.debug("montos:" + req.body.montoforecast + ", " + req.body.montoanual)
  switch (action) {
    case "add":
      var sql = "SELECT * FROM sip.presupuesto b JOIN sip.ejercicios c ON b.idejercicio=c.id " +
        "WHERE b.idcui=" + id_cui + " AND b.idejercicio=" + ejercicio + " AND (b.estado = 'Aprobado' OR b.estado = 'Confirmado') ";
      logger.debug("coriiendo:" + sql);
      sequelize.query(sql)
        .spread(function (rows) {
          if (rows.length > 0) {
            res.json({ error_code: 10 });
          } else {
            var ejercicio = req.body.idejercicio;
            models.presupuesto.create({
              idejercicio: req.body.idejercicio,
              idcui: req.body.idcui,
              descripcion: req.body.descripcion,
              montoforecast: req.body.montoforecast,
              montoanual: req.body.montoanual,
              estado: 'Creado',
              version: version,
              borrado: 1
            }).then(function (presupuesto) {
              logger.debug("Creo presup:" + presupuesto.id + " idprebase:" + idpre);
              if (idpre != null) {
                logger.debug("llamando a sip.CopiaPresupuesto:" + idpre + ", " + id_cui + "," + ejercicio + "," + presupuesto.id);
                sequelize.query("EXECUTE sip.CopiaPresupuesto " + idpre
                  + "," + id_cui
                  + "," + ejercicio
                  + "," + presupuesto.id
                ).then(function (response) {
                  logger.debug("****LLamo CopiaPresupuesto");
                  res.json({ error_code: 0 });
                }).error(function (err) {
                  res.json(err);
                });
              } else {
                logger.debug("****LLamo InsertaServiciosPresupuesto");
                sequelize.query('EXECUTE sip.InsertaServiciosPresupuesto ' + ejercicio
                  + "," + id_cui
                  + "," + presupuesto.id
                ).then(function (response) {
                  //+ ';').then(function (response) {
                  logger.debug("****LLamo InsertaServiciosPresupuesto");
                  res.json({ error_code: 0 });
                }).error(function (err) {
                  res.json(err);
                });
              }
            }).catch(function (err) {
              logger.error(err)
              res.json({ error_code: 1 });
            });
          }
        });
      break;
    case "edit":
      models.presupuesto.update({
        idejercicio: req.body.idejercicio,
        idcui: req.body.idcui,
        descripcion: req.body.descripcion
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (contrato) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      sequelize.query('EXECUTE sip.EliminaPresupuesto ' + req.body.id
        + ';').then(function (response) {
          res.json({ error_code: 0 });
        }).catch(function (err) {
          logger.error(err)
          res.json(err);
        });
      break;

  }
}

exports.updateTotales = function (req, res) {
  logger.debug("****id:" + req.params.id);
  sequelize.query('EXECUTE sip.actualizadetallepre ' + req.params.id
    + ';').then(function (response) {
      res.json({ error_code: 0 });
    }).catch(function (err) {
      logger.error(err)
      res.json(err);
    });

};

exports.confirma = function (req, res) {
  logger.debug("****id:" + req.params.id + " estado:" + req.params.estado);
  var id = req.params.id;
  var estado = req.params.estado;
  var idcui = req.params.idcui;
  var ideje = req.params.ideje;
  if (estado === 'Confirmado') {
    var sql = "SELECT * FROM sip.presupuesto b JOIN sip.ejercicios c ON b.idejercicio=c.id " +
      "WHERE b.idcui=" + idcui + " AND b.idejercicio=" + ideje + " AND (b.estado = 'Aprobado' OR b.estado = 'Confirmado') ";
    sequelize.query(sql)
      .spread(function (rows) {
        if (rows.length > 0) {
          res.json({ error_code: 10 });
        } else {
          sql = "UPDATE sip.presupuesto SET estado='" + estado + "' WHERE id=" + id;
          sequelize.query(sql).then(function (response) {
            res.json({ error_code: 0 });
          }).catch(function (err) {
            logger.error(err)
            res.json(err);
          });
        }
      }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
      });
  } else {
    sql = "UPDATE sip.presupuesto SET estado='" + estado + "' WHERE id=" + id;
    sequelize.query(sql).then(function (response) {
      res.json({ error_code: 0 });
    }).catch(function (err) {
      logger.error(err)
      res.json(err);
    });
  }

};

// List para pagina de presupuesto read only
// Lista presupuestos de padres y hermanos e hijos
exports.getPresupuestoReadOnly = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "a.id";

  if (!sord)
    sord = "desc";

  var order = sidx + " " + sord;
  //var cuis = getCuis(req.session.passport.user);

  var superCui = function (uid, callback) {
    var rol = req.session.passport.sidebar[0].rid;
    if (rol != constants.ROLADMDIVOT) {
      var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + uid;
      logger.debug("query:" + sql1);
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            logger.debug("query:" + rows + ", valor:" + rows[0].cui);
            idcui = rows[0].cui;
          } else {
            idcui = 0; //cui no existente para que no encuentre nada
          }
        }).then(function (servicio) {
          var sql = "declare @cui as INT; "+
            "select @cui = sip.obtienecuipadre("+idcui+"); "+
            "select a.id " +
            "from   sip.estructuracui a " +
            "where  a.cui = @cui " +
            "union " +
            "select b.id " +
            "from   sip.estructuracui a,sip.estructuracui b " +
            "where  a.cui = @cui " +
            "  and  a.cui = b.cuipadre " +
            "union " +
            "select c.id " +
            "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c " +
            "where  a.cui = @cui " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "union " +
            "select d.id " +
            "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d " +
            "where  a.cui = @cui " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "  and  c.cui = d.cuipadre ";
          sequelize.query(sql)
            .spread(function (rows) {
              var cuis = "";
              logger.debug("En cuis:" + rows);
              for (i = 0; i < rows.length; i++) {
                //logger.debug("cui:" + rows[i].id);
                cuis = cuis + rows[i].id + ",";
              }
              //return cuis.substring(0, cuis.length - 1);
              logger.debug("antes call:" + cuis.substring(0, cuis.length - 1));
              callback(cuis.substring(0, cuis.length - 1));
            });
        });
    } else {
      callback("*");
    }
  };

  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn')
          if (item.field == 'CUI' || item.field == 'nombre' || item.field == 'nombreresponsable') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'estado') {
            condition += "a.estado like '%" + item.data + "%' AND ";
          } else {
            condition += 'c.' + item.field + "=" + item.data + " AND ";
          }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }

    superCui(req.session.passport.user, function (elcui) {//req.user[0].uid
      logger.debug('elcui:' + elcui)
      var rol = req.session.passport.sidebar[0].rid;//req.user[0].rid;
      var sqlok;
      if (rol == constants.ROLADMDIVOT) {
        sqlok = "declare @rowsPerPage as bigint; " +
          "declare @pageNum as bigint;" +
          "set @rowsPerPage=" + rowspp + "; " +
          "set @pageNum=" + page + ";   " +
          "With SQLPaging As   ( " +
          "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY a.id desc) " +
          "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable, c.ejercicio " +
          "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id " +
          "JOIN sip.ejercicios c ON c.id=a.idejercicio ";
        if (filters && condition != "") {
          logger.debug("**" + condition + "**");
          sqlok += "WHERE " + condition + " ";
        }
        sqlok += "ORDER BY id desc) " +
          "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        sqlcount = "Select count(*) AS count FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id "+
        "JOIN sip.ejercicios c ON c.id=a.idejercicio ";
        if (filters && condition != "") {
          sqlcount += "WHERE " + condition + " ";
        }          
      } else {
        sqlok = "declare @rowsPerPage as bigint; " +
          "declare @pageNum as bigint;" +
          "set @rowsPerPage=" + rowspp + "; " +
          "set @pageNum=" + page + ";   " +
          "With SQLPaging As   ( " +
          "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY a.id desc) " +
          "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
          "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id " +
          "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
          "WHERE a.idcui IN (" + elcui + ") ";
        if (filters && condition != "") {
          logger.debug("**" + condition + "**");
          sqlok += "AND " + condition + " ";
        }
        sqlok += "ORDER BY id desc) " +
          "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
        sqlcount = "Select count(*) AS count FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.id "+ 
        "JOIN sip.ejercicios c ON c.id=a.idejercicio ";
        sqlcount +=  "WHERE a.idcui IN (" + elcui + ") "; 
        if (filters && condition != "") {
          sqlcount += "AND " + condition + " ";
        }          
      }
      logger.debug('**SQLCount:' + sqlcount);
      logger.debug('**SQLOK:' + sqlok);
      sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        logger.debug("####COUNT:" + recs[0].count + " Total:" + total);
        logger.debug("EL SUPER ID : " + req.session.passport.user)
        logger.debug("ROL : " + req.session.passport.sidebar[0].rid)      
      sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
      });
    });
  })
};
