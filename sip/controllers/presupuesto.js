var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var constants = require("../utils/constants");

var log = function (inst) {
  console.dir(inst.get())
}
// Create endpoint /proyecto for GET
exports.getPresupuestoPaginados = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "idcui";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  //var cuis = getCuis(req.user[0].uid);

  var superCui = function (uid, callback) {
    var rol = req.user[0].rid;
    if (rol != constants.ROLADMDIVOT) {
      var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + uid;
      console.log("query:" + sql1);
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            console.log("query:" + rows + ", valor:" + rows[0].cui);
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
              console.log("En cuis:" + rows);
              for (i = 0; i < rows.length; i++) {
                //console.log("cui:" + rows[i].id);
                cuis = cuis + rows[i].id + ",";
              }
              //return cuis.substring(0, cuis.length - 1);
              console.log("antes call:" + cuis.substring(0, cuis.length - 1));
              callback(cuis.substring(0, cuis.length - 1));
            });
        });
    } else {
      callback("*");
    }
  };

/*
  if (filters && JSON.stringify(jsonObj.rules) != '[]') {
    var jsonObj = JSON.parse(filters);

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
        "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
        "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.secuencia " +
        "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
        "WHERE " + condition.substring(0, condition.length - 4) + "  ORDER BY id desc) " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.presupuesto.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);

        sequelize.query(sql)
          .spread(function (rows) {

            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {
*/
      models.presupuesto.count().then(function (records) {
        var total = Math.ceil(records / rows);
        superCui(req.user[0].uid, function (elcui) {
          console.log('elcui:' + elcui)
          var rol = req.user[0].rid;
          var sqlok;
          if (rol == constants.ROLADMDIVOT) {
            sqlok = "declare @rowsPerPage as bigint; " +
            "declare @pageNum as bigint;" +
            "set @rowsPerPage=" + rows + "; " +
            "set @pageNum=" + page + ";   " +
            "With SQLPaging As   ( " +
            "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
            "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
            "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.secuencia " +
            "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
            "ORDER BY id desc) " +
            "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
          } else {
            sqlok = "declare @rowsPerPage as bigint; " +
            "declare @pageNum as bigint;" +
            "set @rowsPerPage=" + rows + "; " +
            "set @pageNum=" + page + ";   " +
            "With SQLPaging As   ( " +
            "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
            "as resultNum, a.*, b.CUI, b.nombre, b.nombreresponsable as responsable, c.ejercicio " +
            "FROM sip.presupuesto a JOIN sip.estructuracui b ON a.idcui=b.secuencia " +
            "JOIN sip.ejercicios c ON c.id=a.idejercicio " +
            "WHERE a.idcui IN (" + elcui + ") " +
            "ORDER BY id desc) " +
            "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";          
          }
          sequelize.query(sqlok).spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
        });
      })
/*
  }*/
};


function getCuis(uid) {
  var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + uid;
  console.log("query:" + sql1);
  sequelize.query(sql1)
    .spread(function (rows) {
      if (rows.length > 0) {
        console.log("query:" + rows + ", valor:" + rows[0].cui);
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
          console.log("En cuis:" + rows);
          for (i = 0; i < rows.length; i++) {
            console.log("cui:" + rows[i].id);
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
  console.log("En getExcel");
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
      console.log(err);
      res.json({ error_code: 100 });
    });

};

exports.getUsersByRol = function (req, res) {
  //console.log(req.query.rol);
  console.log(req.params.rol);

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
    console.log(err);
    res.json({ error_code: 1 });
  });

};

exports.getCUIs = function (req, res) {
  var idcui;
  var rol = req.user[0].rid;
  console.log("******usr*********:" + req.user[0].uid);
  console.log("******rol*********:" + req.user[0].rid);
  console.log("*ROLADM*:" + constants.ROLADMDIVOT);
  if (rol == constants.ROLADMDIVOT) {
    var sql = "SELECT id, nombre FROM sip.estructuracui " +
      "ORDER BY nombre";
    sequelize.query(sql)
      .spread(function (rows) {
        res.json(rows);
      }).catch(function (err) {
        res.json({ error_code: 1 });
      });
  } else {
    var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + req.user[0].uid;
    console.log("query:" + sql1);
    sequelize.query(sql1)
      .spread(function (rows) {
        if (rows.length > 0) {
          console.log("query:" + rows + ", valor:" + rows[0].cui);
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

  console.log("***SQL***:" + sql);
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
  console.log("Id Prep:" + idpre);
  console.log("Ejercicio:" + ejercicio);
  console.log("montos:"+req.body.montoforecast+", "+req.body.montoanual)
  switch (action) {
    case "add":
      var sql = "SELECT * FROM sip.presupuesto b JOIN sip.ejercicios c ON b.idejercicio=c.id " +
        "WHERE b.idcui=" + id_cui + " AND b.idejercicio=" + ejercicio + " AND (b.estado = 'Aprobado' OR b.estado = 'Confirmado') ";
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
              montoforecast:req.body.montoforecast,
              montoanual: req.body.montoanual,
              estado: 'Creado',
              version: version,
              borrado: 1
            }).then(function (presupuesto) {
              models.detallepre.findAll({
                where: { 'idpresupuesto': idpre }
              }).then(function (servicio) {
                if (servicio.length > 0) {
                  for (var i = 0; i < servicio.length; i++) {
                    var idservorig = servicio[i].id;
                    console.log("----->" + servicio[i].json)
                    console.log("****LLamo InsertaPeriodo"); 
                    sequelize.query('EXECUTE sip.InsertaPeriodo ' + servicio[i].id
                      + "," + ejercicio
                      + "," + id_cui
                      + "," + presupuesto.id
                      + "," + servicio[i].idservicio
                      + "," + servicio[i].glosaservicio                      
                      + "," + servicio[i].idproveedor
                      + "," + servicio[i].idmoneda
                      + "," + servicio[i].montoforecast
                      + "," + servicio[i].montoanual
                      + "," + servicio[i].cuota
                      + "," + servicio[i].numerocuota
                      + "," + servicio[i].desde
                      + "," + servicio[i].masiva
                      + "," + servicio[i].mesesentrecuotas
                      + "," + servicio[i].gastodiferido                                    
                      + ';').then(function (response) {
                        console.log("****LLamo InsertaPeriodo");
                      }).error(function (err) {
                        res.json(err);
                      });
                  }
                  sequelize.query('EXECUTE sip.InsertaServiciosAdicionalesComp ' + ejercicio
                    + "," + id_cui
                    + "," + presupuesto.id
                    + ';').then(function (response) {
                      console.log("****LLamo InsertaServiciosAdicionalesComp");                    
                    }).error(function (err) {
                      res.json(err);
                    });                    
                } else {
                  console.log("****LLamo InsertaServiciosPresupuesto"); 
                  sequelize.query('EXECUTE sip.InsertaServiciosPresupuesto ' + ejercicio
                    + "," + id_cui
                    + "," + presupuesto.id
                    + ';').then(function (response) {
                      console.log("****LLamo InsertaServiciosPresupuesto");                    
                    }).error(function (err) {
                      res.json(err);
                    });                  
                }
                res.json({ error_code: 0 });
              }).catch(function (err) {
                res.json({ error_code: 1 });
              });
            }).catch(function (err) {
              console.log(err);
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
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      sequelize.query('EXECUTE sip.EliminaPresupuesto ' + req.body.id
        + ';').then(function (response) {
          res.json({ error_code: 0 });
        }).error(function (err) {
          res.json(err);
        });
      break;

  }
}

exports.updateTotales = function (req, res) {
  console.log("****id:"+req.params.id);
  sequelize.query('EXECUTE sip.actualizadetallepre ' + req.params.id
    + ';').then(function (response) {
      res.json({ error_code: 0 });
    }).error(function (err) {
      res.json(err);
    });

};

exports.confirma = function (req, res) {
  console.log("****id:"+req.params.id+" estado:"+req.params.estado);
  var id = req.params.id;
  var estado = req.params.estado;
  var idcui = req.params.idcui;
  var ideje = req.params.ideje;
  if (estado === 'Confirmado'){
    var sql = "SELECT * FROM sip.presupuesto b JOIN sip.ejercicios c ON b.idejercicio=c.id " +
      "WHERE b.idcui=" + idcui + " AND b.idejercicio=" + ideje + " AND (b.estado = 'Aprobado' OR b.estado = 'Confirmado') ";
    sequelize.query(sql)
      .spread(function (rows) {
        if (rows.length > 0) {
          res.json({ error_code: 10 });
        } else {
          sql = "UPDATE sip.presupuesto SET estado='"+estado+"' WHERE id="+id;
          sequelize.query(sql).then(function (response) {
              res.json({ error_code: 0 });
            }).error(function (err) {
              res.json(err);
            });
        }     
    }).catch(function (err) {
      res.json({ error_code: 1 });
    });
  } else {
      sql = "UPDATE sip.presupuesto SET estado='"+estado+"' WHERE id="+id;
      sequelize.query(sql).then(function (response) {
          res.json({ error_code: 0 });
        }).error(function (err) {
          res.json(err);
        });    
  }

};