var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var nodeExcel = require('excel-export');
var bitacora = require("../../utils/bitacora");

exports.list = function (req, res) {

  var page = req.body.page;
  var rows = req.body.rows;
  var filters = req.body.filters;
  var sidx = req.body.sidx;
  var sord = req.body.sord;

  if (!sidx)
    sidx = "glosaclase";

  if (!sord)
    sord = "asc";

    var orden = sidx + " " + sord;

  utilSeq.buildCondition(filters, function (err, data) {
    if (err) {
      logger.debug("->>> " + err)
    } else {
      models.clasecriticidad.belongsTo(models.valores, { foreignKey: 'idcolor' });
      models.clasecriticidad.count({
        where: data
      }).then(function (records) {
        var total = Math.ceil(records / rows);
        models.clasecriticidad.findAll({
          offset: parseInt(rows * (page - 1)),
          limit: parseInt(rows),
          order: orden,
          where: data,
          include: [{
            model: models.valores
          }]
        }).then(function (criticidades) {
          //iniciativas.forEach(log)
          res.json({ records: records, total: total, page: page, rows: criticidades });
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
      })
    }
  });

};

exports.action = function (req, res) {
  var action = req.body.oper;
  var id = req.body.id;
  var color =  req.body.idcolor

  switch (action) {
    case "add":
      if (color == 0)       
          { color = null}

      if (req.body.calculado == 1)
          { color = null}
      models.clasecriticidad.create({
        factor: req.body.factor.replace(",", "."),
        glosaclase: req.body.glosaclase,
        calculado:req.body.calculado,
        idcolor:color,
        borrado: 1
      }).then(function (clasecriticidad) {
         bitacora.registrar(
                    null,
                    'clasecriticidad',
                    clasecriticidad.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.clasecriticidad,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
        res.json({ id: clasecriticidad.id, parent: null, message: 'Insertando', success: true });       
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });

      break;
    case "edit":

      if (color == 0)
          { color = null}

      if (req.body.calculado == 1)
          { color = null}

      if (req.body.factor != 0){
          var sql = "delete sic.desglosenotas from sic.desglosenotas n,sic.desglosefactores f "+ 
	                "where n.iddesglosefactores = f.id and f.idclasecriticidad  ="+ id 
      
          sequelize.query(sql).then(function (plantilla) {
                  res.json({ error_code: 0 });
                }).catch(function (err) {
                  res.json({ error_code: 1 });
          });

          var sql = "delete sic.desglosefactores "+ 
	                "where  idclasecriticidad   ="+ id 
      
          sequelize.query(sql).then(function (plantilla) {
                  res.json({ error_code: 0 });
                }).catch(function (err) {
                  res.json({ error_code: 1 });
          }); 
           var sql = "delete sic.desglosecolores "+ 
	                 "where  idclasecriticidad   ="+ id 
      
          sequelize.query(sql).then(function (plantilla) {
                  res.json({ error_code: 0 });
                }).catch(function (err) {
                  res.json({ error_code: 1 });
          }); 
      }  
             bitacora.registrar(
                null,
                'clasecriticidad',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.clasecriticidad, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.clasecriticidad.update({
                         factor:req.body.factor.replace(",", "."),
                         calculado:req.body.calculado,
                         idcolor:color
                         }, {
                         where: {
                                 id: req.body.id
                                }
                         }).then(function (clasecriticidad) {
                                res.json({ id: req.body.id, parent: req.body.id, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
    case "del":
              bitacora.registrar(
                null,
                'clasecriticidad',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.clasecriticidad, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                       models.clasecriticidad.destroy({
                       where: {
                               id: req.body.id
                              }
                       }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted

                            if (rowDeleted === 1) {

                                logger.debug('Deleted successfully');
                            }
                            res.json({ error: 0, glosa: '' ,success: true});
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
  }
}

exports.desglosefactores = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var idclasecriticidad = req.params.id;
    var filters = req.body.filters;
    var condition = "";

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sic.desglosefactores a 
            where idclasecriticidad =  `+ idclasecriticidad +
            `  ` + condition

    var sql = `
            SELECT 
                    id,nombrefactor,porcentaje
                    FROM sic.desglosefactores 
            where idclasecriticidad = `+ idclasecriticidad+
            `  ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

        logger.debug("lala : " + sql)
        logger.debug("lili : " + idclasecriticidad)
        


    sequelize.query(count,
        {
            replacements: { idclasecriticidad: idclasecriticidad, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), idclasecriticidad: idclasecriticidad, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.actiondesglosefactores = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "add":
      models.desglosefactores.create({
        idclasecriticidad: req.body.parent_id,
        nombrefactor: req.body.nombrefactor,
        porcentaje: req.body.porcentaje,
        borrado: 1
      }).then(function (desglosefactores) {
         bitacora.registrar(
                    req.body.parent_id,
                    'desglosefactores',
                    desglosefactores.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.desglosefactores,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
        res.json({ id: desglosefactores.id, parent: req.body.parent_id, message: 'Insertando', success: true });       

      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
             bitacora.registrar(
                req.body.parent_id,
                'desglosefactores',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.desglosefactores, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.desglosefactores.update({
                               porcentaje: req.body.porcentaje
                                       }, {
                        where: {
                                id: req.body.id
                               }
                        }).then(function (desglosefactores) {
                                res.json({ id: req.body.id, parent: req.body.parent_id, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
    case "del":
              bitacora.registrar(
                req.body.parent_id,
                'desglosefactores',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.desglosefactores, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.desglosefactores.destroy({
                        where: {
                                id: req.body.id
                               }
                        }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted
                            if (rowDeleted === 1) {
                                logger.debug('Deleted successfully');
                            }
                            res.json({ error: 0, glosa: '' ,success: true});
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
  }
}
exports.porcentajedesglosefactores = function (req, res) {
  var sql = "select sum(porcentaje) as total from sic.desglosefactores where idclasecriticidad="+req.params.parentRowKey;
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
  var condition = "";
  logger.info("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'conceptopresupuestario',
      type: 'number',
      width: 10
    },
    {
      caption: 'Nombre',
      type: 'string',
      width: 50
    }
  ];

  var sql = "SELECT id,conceptopresupuestario,glosaconcepto FROM sip.conceptospresupuestarios order by conceptopresupuestario "
  
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].conceptopresupuestario,
          proyecto[i].glosaconcepto
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "ConceptosPresupuestarios.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};

exports.desglosenotas = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var iddesglosefactores = req.params.id;
    var filters = req.body.filters;
    var condition = "";

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sic.desglosenotas 
            where iddesglosefactores =  `+ iddesglosefactores +
            `  ` + condition

    var sql = `
            SELECT 
                    n.id,n.nombrenota,n.idnota,v.nombre
                    FROM sic.desglosenotas n,sic.valores v
            where n.idnota =+ v.id
              And n.iddesglosefactores = `+ iddesglosefactores+
            `  ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

        logger.debug("lala : " + sql)
        logger.debug("lili : " + iddesglosefactores)
        


    sequelize.query(count,
        {
            replacements: { iddesglosefactores: iddesglosefactores, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), iddesglosefactores: iddesglosefactores, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.actiondesglosenotas = function (req, res) {
  var action = req.body.oper;

        logger.debug("parent_id : " + req.body.parent_id);

  switch (action) {
 
    case "add":
      models.desglosenotas.create({
        iddesglosefactores: req.body.parent_id,
        nombrenota: req.body.nombrenota,
        idnota: req.body.idnota,
        borrado: 1
      }).then(function (desglosenotas) {
        bitacora.registrar(
                    req.body.parent_id,
                    'desglosenotas',
                    desglosenotas.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.desglosenotas,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
        res.json({ id: desglosenotas.id, parent: req.body.parent_id, message: 'Insertando', success: true });       
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
              bitacora.registrar(
                req.body.parent_id,
                'desglosenotas',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.desglosenotas, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.desglosenotas.update({
                                   idnota: req.body.idnota,
                                   nombrenota: req.body.nombrenota,
                                  }, {
                        where: {
                                id: req.body.id
                               }
                        }).then(function (desglosenotas) {
                                res.json({ id: req.body.id, parent: req.body.parent_id, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
    case "del":
              bitacora.registrar(
                req.body.parent_id,
                'desglosenotas',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.desglosenotas, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.desglosenotas.destroy({
                        where: {
                                id: req.body.id
                               }
                        }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted
                            if (rowDeleted === 1) {
                                logger.debug('Deleted successfully');
                            }
                            res.json({ error: 0, glosa: '' ,success: true});
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
  }
};

exports.getColor = function (req, res) {

  var sql = "select id,nombre from sic.valores " +
    "where borrado=1 and tipo = 'Color' order by nombre ";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};
exports.getNotas = function (req, res) {

  var sql = "select id,nombre from sic.valores " +
    "where borrado=1 and tipo = 'Nota' order by nombre ";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.desglosecolores = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var idclasecriticidad = req.params.id;
    var filters = req.body.filters;
    var condition = "";

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sic.desglosecolores
            where idclasecriticidad =  `+ idclasecriticidad +
            `  ` + condition

    var sql = `
            SELECT 
                    n.id,n.notainicial,n.notafinal,n.idcolor,v.nombre
                    FROM sic.desglosecolores n,sic.valores v
            where n.idcolor =+ v.id
              And n.idclasecriticidad = `+ idclasecriticidad+
            `  ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

    sequelize.query(count,
        {
            replacements: { idclasecriticidad: idclasecriticidad, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), idclasecriticidad: idclasecriticidad, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.actiondesglosecolores= function (req, res) {
  var action = req.body.oper;

        logger.debug("parent_id : " + req.body.parent_id);

  switch (action) {
 
    case "add":
      models.desglosecolores.create({
        idclasecriticidad: req.body.parent_id,
        idcolor: req.body.idcolor,
        notainicial: req.body.notainicial.replace(",", "."),  
        notafinal: req.body.notafinal.replace(",", "."),  
        borrado: 1
      }).then(function (desglosecolores) {
                bitacora.registrar(
                    req.body.parent_id,
                    'desglosecolores',
                    desglosecolores.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.desglosecolores,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
        res.json({ id: desglosecolores.id, parent: req.body.parent_id, message: 'Insertando', success: true });       
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;
    case "edit":
              bitacora.registrar(
                req.body.parent_id,
                'desglosecolores',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.desglosecolores, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.desglosecolores.update({
                               idcolor: req.body.idcolor,
                               notainicial: req.body.notainicial.replace(",", "."),  
                               notafinal: req.body.notafinal.replace(",", "."),  
                        }, {
                        where: {
                                id: req.body.id
                               }
                        }).then(function (desglosecolores) {
                                res.json({ id: req.body.id, parent: req.body.parent_id, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
    case "del":
                bitacora.registrar(
                req.body.parent_id,
                'desglosecolores',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.desglosecolores, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.desglosecolores.destroy({
                        where: {
                                id: req.body.id
                               }
                        }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted
                            if (rowDeleted === 1) {
                                logger.debug('Deleted successfully');
                            }
                            res.json({ error: 0, glosa: '' ,success: true});
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }
                });
      break;
  }
};