var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
var logger = require("../utils/logger");
// Create endpoint /proyecto for GET
exports.getPresupuestoServicios = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idpresupuesto=" + id;

  if (!sidx)
    sidx = "a.id";

  if (!sord)
    sord = "desc";

  var order = sidx + " " + sord;

  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn')
          if (item.field == 'nombre') {
            condition += 'c.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'glosaservicio') {
            condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'moneda') {
            condition += 'd.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'razonsocial') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }
  sqlcount = "Select count(*) AS count  FROM sip.detallepre a " +
    "LEFT JOIN sip.proveedor b ON a.idproveedor = b.id " +
    "LEFT JOIN sip.servicio c ON c.id = a.idservicio " +
    "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
    "WHERE a.idpresupuesto=" + id + " ";
  if (filters && condition != "") {
    sqlcount += " AND " + condition + " ";
  }

  var sql = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rowspp + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.id, c.nombre, a.idservicio, d.moneda, a.idmoneda, a.montoforecast, a.montoanual, " +
    "a.costoforecast, a.costoanual, a.comentario, a.glosaservicio, a.idproveedor, " +
    "a.cuota, a.numerocuota, a.idfrecuencia, a.desde, a.masiva, a.ivarecuperable, a.mesesentrecuotas, " +
    "a.gastodiferido, b.razonsocial, a.desdediferido FROM sip.detallepre a " +
    "LEFT JOIN sip.proveedor b ON a.idproveedor = b.id " +
    "LEFT JOIN sip.servicio c ON c.id = a.idservicio  " +
    "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
    "WHERE a.idpresupuesto=" + id + " ";
  if (filters && condition != "") {
    sql += " AND " + condition + ") ";
  } else {
    sql += ") ";
  }
  sql += "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

  logger.debug(sql);

  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    logger.debug("####COUNT:" + recs[0].count + " Total:" + total);
    sequelize.query(sql).spread(function (rows) {
      res.json({ records: records, total: total, page: page, rows: rows });
    });
  });

};

//Muestra los registros que deben tener explicaci�n por diferencias entre compromiso y presupuesto
exports.getExplicaciones = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idpresupuesto=" + id;

  if (!sidx)
    sidx = "a.id";

  if (!sord)
    sord = "desc";

  var order = sidx + " " + sord;

  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn')
          if (item.field == 'nombre') {
            condition += 'c.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'glosaservicio') {
            condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'moneda') {
            condition += 'd.' + item.field + " like '%" + item.data + "%' AND ";
          } else if (item.field == 'razonsocial') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          }
      });
      condition = condition.substring(0, condition.length - 5);
      logger.debug("***CONDICION:" + condition);
    }
  }
  sqlcount = "Select count(*) AS count  FROM sip.detallepre a " +
    "JOIN sip.proveedor b ON a.idproveedor = b.id "+ 
    "JOIN sip.servicio c ON c.id = a.idservicio "+  
    "JOIN sip.detalleplan d ON a.id=d.iddetallepre "+
    "WHERE a.idpresupuesto= "+ id + " "+
    "GROUP BY a.id,c.nombre, a.glosaservicio, b.razonsocial, a.comentario "+
    "HAVING ABS(sum(isnull(d.caja,0)) - sum(isnull(d.compromisopesos,0))) > 10000000 ";
  if (filters && condition != "") {
    sqlcount += " AND " + condition + " ";
  }

  var sql = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rowspp + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum,a.id, c.nombre, a.glosaservicio, b.razonsocial, a.comentario, "+ 
    "sum(d.caja) presupuesto, sum(d.compromisopesos) compromiso "+ 
    "FROM sip.detallepre a "+
    "JOIN sip.proveedor b ON a.idproveedor = b.id "+ 
    "JOIN sip.servicio c ON c.id = a.idservicio "+  
    "JOIN sip.detalleplan d ON a.id=d.iddetallepre "+
    "WHERE a.idpresupuesto= "+ id + " "+
    "GROUP BY a.id,c.nombre, a.glosaservicio, b.razonsocial, a.comentario "+
    "HAVING ABS(sum(isnull(d.caja,0)) - sum(isnull(d.compromisopesos,0))) > 10000000 ";  
    
  if (filters && condition != "") {
    sql += " AND " + condition + ") ";
  } else {
    sql += ") ";
  }
  sql += "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

  logger.debug(sql);

  sequelize.query(sqlcount).spread(function (recs) {
    var records = recs[0].count;
    var total = Math.ceil(parseInt(recs[0].count) / rowspp);
    logger.debug("####COUNT:" + recs[0].count + " Total:" + total);
    sequelize.query(sql).spread(function (rows) {
      res.json({ records: records, total: total, page: page, rows: rows });
    });
  });

};

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  var id = req.params.id
  var filtrosubgrilla = "idpresupuesto=" + id;

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
      caption: 'Cuenta Contable',
      type: 'number',
      width: 15
    },
    {
      caption: 'Nombre Cuenta',
      type: 'string',
      width: 50
    },
    {
      caption: 'Nombre Servicio',
      type: 'string',
      width: 50
    },
    {
      caption: 'Moneda',
      type: 'number',
      width: 20
    },
    {
      caption: 'Monto Forecast',
      type: 'number',
      width: 10
    },
    {
      caption: 'Monto Anual',
      type: 'number',
      width: 15
    }
  ];

  var sql = "SELECT a.id, f.cui, c.nombre, d.moneda, a.montoforecast, a.montoanual " +
    "FROM sip.detallepre a " +
    "LEFT JOIN sip.servicio c ON c.id = a.idservicio  " +
    "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
    "LEFT JOIN sip.presupuesto e ON a.idpresupuesto=e.id LEFT JOIN sip.estructuracui f ON e.idcui=f.id " +
    "WHERE a.idpresupuesto=" + id + " order by cuentacontable";

  logger.debug("sql:" + sql);
  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1,
          proyecto[i].CUI,
          proyecto[i].nombre,
          proyecto[i].moneda,
          (proyecto[i].montoforecast == '0') ? '0' : proyecto[i].montoforecast,
          (proyecto[i].montoanual == '0') ? '0' : proyecto[i].montoanual
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "ServiciosPresupuesto.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      logger.error(err);
      res.json({ error_code: 100 });
    });

};


exports.getServicios = function (req, res) {
  var id = req.params.id;

  var sql = "DECLARE @cui INT; " +
    "SELECT @cui=idcui FROM sip.presupuesto WHERE id=" + id + " " +
    "SELECT a.idservicio AS id, b.nombre AS nombre FROM sip.plantillapresupuesto a JOIN sip.servicio b ON a.idservicio=b.id " +
    "WHERE a.idcui=@cui " +
    "GROUP BY a.idservicio, b.nombre " +
    "ORDER BY b.nombre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getProveedores = function (req, res) {
  var id = req.params.id;

  var sql = "DECLARE @cui INT; " +
    "SELECT @cui=idcui FROM sip.presupuesto WHERE id=" + id + " " +
    "SELECT a.idproveedor AS id, b.razonsocial AS nombreproveedor FROM sip.plantillapresupuesto a JOIN sip.proveedor b ON a.idproveedor=b.id " +
    "WHERE a.idcui=@cui " +
    "GROUP BY a.idproveedor, b.razonsocial  " +
    "ORDER BY b.razonsocial";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getProveedoresServ = function (req, res) {
  var id = req.params.id;
  var id2 = req.params.id2;

  var sql = "DECLARE @cui INT; " +
    "SELECT @cui=idcui FROM sip.presupuesto WHERE id=" + id + " " +
    "SELECT a.idproveedor AS id, b.razonsocial AS nombreproveedor FROM sip.plantillapresupuesto a JOIN sip.proveedor b ON a.idproveedor=b.id " +
    "WHERE a.idcui=@cui and a.idservicio=" + id2 + " " +
    "GROUP BY a.idproveedor, b.razonsocial  " +
    "ORDER BY b.razonsocial";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getMonedas = function (req, res) {

  var sql = "SELECT id, moneda FROM sip.moneda";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.action = function (req, res) {
  var action = req.body.oper;
  var idPre = req.params.id
  var monedas = getMonedas(idPre, req.body.idmoneda);
  logger.debug("****MONEDAS+" + monedas);

  var estadoPrep = function (idPrep, callback) {
    var sql = "SELECT estado FROM sip.presupuesto WHERE id=" + idPrep;
    var estadoPrep;
    sequelize.query(sql)
      .spread(function (rows) {
        if (rows.length > 0) {
          logger.debug("***Estado:" + rows[0].estado);
          estadoPrep = rows[0].estado;
        } else {
          estadoPrep = ""; //no existe el presupuesto
        }
        callback(estadoPrep);
      })
  }

  estadoPrep(idPre, function (estado) {
    if (estado == "Aprobado") {
      action = 'nada';
      res.json({ error_code: 10 });
    } else {
      switch (action) {
        case "add":
          logger.debug("***AGREGANDO***");
          var idservicio = 0;
          models.detallepre.create({
            idpresupuesto: idPre,
            idservicio: req.body.idservicio,
            idmoneda: req.body.idmoneda,
            comentario: req.body.comentario,
            idproveedor: req.body.idproveedor,
            glosaservicio: req.body.glosaservicio,
            cuota: req.body.cuota,
            numerocuota: req.body.numerocuota,
            mesesentrecuotas: req.body.mesesentrecuotas,
            desde: req.body.desde,
            masiva: req.body.masiva,
            gastodiferido: req.body.gastodiferido,
            ivarecuperable: req.body.ivarecuperable,
            desdediferido: req.body.desdediferido,
            borrado: 1
          }).then(function (servicio) {
            idservicio = servicio.id;
            logger.debug("****servicio:" + idservicio);
            //Find en tabla valor moneda
            //Then conversion
            //var monedas = getMonedas(idPre, req.body.idmoneda);
            //logger.debug("****MONEDAS+"+monedas);
            //var conversion = [26100, 26200, 26000, 26300, 26400, 26500, 26600, 26700, 26800, 26900, 27000, 26100];
            var cuotas = calculoCuotas(
              req.body.cuota,
              req.body.numerocuota,
              req.body.mesesentrecuotas,
              req.body.desde,
              req.body.masiva,
              req.body.ivarecuperable,
              monedas,
              req.body.gastodiferido,
              req.body.desdediferido
            );
            logger.debug("CUOTAS:" + cuotas);
            insertaPeriodos(idservicio, cuotas, function (err, compromisos) {
              logger.debug("***  ***ACTualizadetallepre:" + idservicio);
              sequelize.query('EXECUTE sip.actualizadetallepre ' + idservicio
                + ';').then(function (response) {
                  res.json({ error_code: 0 });
                }).error(function (err) {
                  res.json(err);
                });
            });
          }).catch(function (err) {
            logger.error(err);
            res.json({ error_code: 1 });
          });


          break;
        case "edit":
          logger.debug("***ACTUALIZANDO***");
          models.detallepre.update({
            idservicio: req.body.idservicio,
            idmoneda: req.body.idmoneda,
            idproveedor: req.body.idproveedor,
            comentario: req.body.comentario,
            glosaservicio: req.body.glosaservicio,
            cuota: req.body.cuota,
            numerocuota: req.body.numerocuota,
            mesesentrecuotas: req.body.mesesentrecuotas,
            desde: req.body.desde,
            masiva: req.body.masiva,
            gastodiferido: req.body.gastodiferido,
            ivarecuperable: req.body.ivarecuperable,
            desdediferido: req.body.desdediferido            
          }, {
              where: {
                id: req.body.id
              }
            }).then(function (contrato) {
              var idservicio = req.body.id;
              //var conversion = [26100, 26200, 26000, 26300, 26400, 26500, 26600, 26700, 26800, 26900, 27000, 26100];
              var cuotas = calculoCuotas(
                req.body.cuota,
                req.body.numerocuota,
                req.body.mesesentrecuotas,
                req.body.desde,
                req.body.masiva,
                req.body.ivarecuperable,
                monedas,
                req.body.gastodiferido,
                req.body.desdediferido
              );
              actualizaPeriodos(idservicio, cuotas, function (err, compromisos) {
                logger.debug("***actualizadetallepre:" + idservicio);
                sequelize.query('EXECUTE sip.actualizadetallepre ' + idservicio
                  + ';').then(function (response) {
                    res.json({ error_code: 0 });
                  }).error(function (err) {
                    res.json(err);
                  });
              });

            }).catch(function (err) {
              logger.error(err);
              res.json({ error_code: 1 });
            });
          break;
        case "del":
          logger.debug("***ELIMINANDO***");
          var id = req.body.id;
          var sql = "DELETE FROM sip.detalleplan WHERE iddetallepre=" + id + "; " +
             "EXECUTE sip.actualizadetallepre " + id+ "; "+
            "DELETE FROM sip.detallepre WHERE id=" + id+ "; " ;
            logger.debug("sql:"+sql);
          sequelize.query(sql).then(function (response) {     
            
            res.json({ error_code: 0 });
          }).error(function (err) {
            res.json(err);
          });

          break;
      }
    }
  });


  var insertaPeriodos = function (idservicio, cuotas, callback) {
    logger.debug("insertaPeriodos:" + idservicio + "," + cuotas);
    models.sequelize.transaction({ autocommit: true }, function (t) {

      var promises = []
      var d = new Date();
      var anio = d.getFullYear()
      var mes = 9;
      logger.debug("Recibe:" + cuotas[0][0] + "," + cuotas[0][1] + "," + cuotas[0][2] + "," + cuotas[0][3]);
      for (var i = 0; i < 4; i++) {
        var mm = mes + i;
        var mmm = mm < 10 ? '0' + mm : mm;
        var periodo = anio + '' + mmm;
        var newPromise = models.detalleplan.create({
          'iddetallepre': idservicio,
          'periodo': periodo,
          'presupuestobasecaja': 0,
          'presupuestoorigen': cuotas[0][i],
          'presupuestopesos': cuotas[1][i],
          'caja': cuotas[2][i],
          'costo': cuotas[3][i],
          'cajacomprometido': 0,
          'costocomprometido': 0,
          'totalcaja': cuotas[2][i],
          'totalcosto': cuotas[3][i],
          'disponible': cuotas[2][i],
          'borrado': 1
        }, { transaction: t });

        promises.push(newPromise);
      };
      mes = 1;
      anio = anio + 1;
      for (var i = 4; i < 16; i++) {
        var mm = mes + i-4;
        var mmm = mm < 10 ? '0' + mm : mm;
        var periodo = anio + '' + mmm;

        var newPromise = models.detalleplan.create({
          'iddetallepre': idservicio,
          'periodo': periodo,
          'presupuestobasecaja': 0,
          'presupuestobasecosto': 0,
          'presupuestoorigen': cuotas[0][i],
          'presupuestopesos': cuotas[1][i],
          'caja': cuotas[2][i],
          'costo': cuotas[3][i],
          'cajacomprometido': 0,
          'costocomprometido': 0,
          'totalcaja': cuotas[2][i],
          'totalcosto': cuotas[3][i],
          'disponible': cuotas[2][i],
          'borrado': 1
        }, { transaction: t });

        promises.push(newPromise);
      };
      return Promise.all(promises).then(function (compromisos) {
        var compromisoPromises = [];
        for (var i = 0; i < compromisos.length; i++) {
          compromisoPromises.push(compromisos[i]);
        }
        return Promise.all(compromisoPromises);
      });
    }).then(function (result) {
      callback(result)
    }).catch(function (err) {
      logger.error(err)
      return err;
    });

    /*
    }).then(function (result) {
        callback(undefined,result)
    }).catch(function (err) {
        //return next(err);
         callback(err,undefined)
    });
*/
  }

  var actualizaPeriodos = function (idservicio, cuotas, callback) {
    logger.debug("actualizaPeriodos:" + idservicio + "," + cuotas);
    models.sequelize.transaction({ autocommit: true }, function (t) {
      var promises = []
      var d = new Date();
      var anio = d.getFullYear()
      
      //Meses forecast
      var mes = 9;
      for (var i = 0; i < 4; i++) {
        var mm = mes + (i);
        var mmm = mm < 10 ? '0' + mm : mm;
        var periodo = anio + '' + mmm;
        var totcaja = 0;
        var caja = cuotas[2][i];

        var sql = "update sip.detalleplan set " +
          "presupuestoorigen = " + cuotas[0][i] + ", " +
          "presupuestopesos =" + cuotas[1][i] + ", " +
          "caja=" + cuotas[2][i] + ", " +
          "costo=" + cuotas[3][i] + ", " +
          "disponible=" + cuotas[2][i] + "-isnull(cajacomprometido,0), " +
          "totalcaja=" + cuotas[2][i] + ", " +
          "totalcosto=" + cuotas[3][i] + " " +

          "where iddetallepre=" + idservicio + " and periodo=" + periodo;

        var newPromise = sequelize.query(sql)
          .spread(function (results, metadata) {
          },
          { transaction: t });
        promises.push(newPromise);
      };      
      
      //Meses a�o presupuesto
      var mes = 1;
      anio = anio + 1;
      for (var i = 4; i < 16; i++) {
        var mm = mes + (i-4);
        var mmm = mm < 10 ? '0' + mm : mm;
        var periodo = anio + '' + mmm;
        var totcaja = 0;
        var caja = cuotas[2][i];

        var sql = "update sip.detalleplan set " +
          "presupuestoorigen = " + cuotas[0][i] + ", " +
          "presupuestopesos =" + cuotas[1][i] + ", " +
          "caja=" + cuotas[2][i] + ", " +
          "costo=" + cuotas[3][i] + ", " +
          "disponible=" + cuotas[2][i] + "-isnull(cajacomprometido,0), " +
          "totalcaja=" + cuotas[2][i] + ", " +
          "totalcosto=" + cuotas[3][i] + " " +

          "where iddetallepre=" + idservicio + " and periodo=" + periodo;

        var newPromise = sequelize.query(sql)
          .spread(function (results, metadata) {
          },
          { transaction: t });
        promises.push(newPromise);
      };
      return Promise.all(promises).then(function (compromisos) {
        var compromisoPromises = [];
        for (var i = 0; i < compromisos.length; i++) {
          compromisoPromises.push(compromisos[i]);
        }
        return Promise.all(compromisoPromises);
      });

    }).then(function (result) {
      callback(result)
    }).catch(function (err) {
      logger.error(err)
      return err;
    });

  }


}

function getMonedas(idpresupuesto, idmoneda) {

  var sql = "DECLARE @periodo INT "+
"DECLARE @ejercicio INT "+
"DECLARE @ejercicio2 INT "+
"DECLARE @anioactual INT "+
"DECLARE @anioanterior INT "+
"SELECT @ejercicio=a.idejercicio, @anioactual=b.ejercicio FROM sip.presupuesto a JOIN sip.ejercicios b ON a.idejercicio= b.id WHERE a.id="+idpresupuesto+" "+
"SELECT @anioanterior = @anioactual -1 "+
"SELECT @ejercicio2=id FROM sip.ejercicios WHERE ejercicio=@anioanterior "+
"SELECT @periodo = convert(INT,concat(convert(VARCHAR(4), @anioanterior),'08')) "+
"SELECT periodo, valorconversion FROM sip.monedasconversion WHERE idejercicio=@ejercicio2 AND idmoneda="+idmoneda+" AND periodo>@periodo "+
"UNION "+
"SELECT periodo, valorconversion FROM sip.monedasconversion WHERE idejercicio=@ejercicio AND idmoneda="+idmoneda
  var conversion = [26100, 26200, 26000, 26300, 26400, 26500, 26600, 26700, 26800, 26900, 27000, 26100];
  //logger.debug("conversion:" + conversion);
  logger.debug("*** SQL MOnedas" + sql);
  var arr = [];
  sequelize.query(sql)
    .spread(function (rows) {
      for (var i in rows) {
        arr.push(rows[i].valorconversion);
      }
      logger.debug("*********   ROWSSSSS:" + arr);

    }).then()
  return arr;
}

function calculoCuotas(cuota, ncuotas, mesesentremedio, mescuota1, coniva, frecup, conversion, diferido, desdediferido) {
  logger.debug("CUPTAS DENTRO:" + cuota + "," + ncuotas + "," + mesesentremedio + "," + mescuota1 + "," + coniva + "," + frecup + "," + conversion);
  //var conversion = [26100,26200,26000,26300,26400,26500,26600,26700,26800,26900,27000,26100];
  var origen = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var pesos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var caja = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var costo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var mesesentre = parseInt(mesesentremedio);


  //Caja
  for (i = mescuota1, j = 0; i < caja.length + 1 && j < ncuotas; i = parseInt(i) + mesesentre, j++) {
    logger.debug("***SALTO:" + (parseInt(i) + mesesentre));
    origen[i - 1] = cuota;
    pesos[i - 1] = cuota * conversion[i - 1];
    if (coniva == "1") {
      
      var valorcaja = pesos[i - 1] * 1.19;
    } else {
      var valorcaja = pesos[i - 1];
    }
    caja[i - 1] = valorcaja;
  }
  //Costo con diferimiento
  frecup = frecup/100;
  for (var i = desdediferido, j = 0, h=mescuota1; i < caja.length + 1 && j < ncuotas && h<17; i = parseInt(i) + mesesentre, j++, h=parseInt(h)+mesesentre) {
    logger.debug("*****JJJJ:" + j);
    if (coniva == "1") {
      var iva = pesos[h - 1] * 0.19;
    } else {
      var iva = 0;
    }
    //frecup = frecup/100;
    var recuperacion = iva * frecup;
    var total = parseFloat(pesos[h - 1]) + parseFloat(recuperacion);
    if (diferido == "1") {
      var valorcosto = total / (mesesentre);
      var valorcosto = valorcosto.toFixed(2);
      for (k = i; k <= parseInt(i) + mesesentre - 1 && k < caja.length + 1; k++) {
        costo[k - 1] = valorcosto;
      }
    } else {
      costo[i - 1] = total;
    }

  }
  var todo = [origen, pesos, caja, costo];
  logger.debug(todo);
  return todo;
}

exports.getFrecuencia = function (req, res) {

  var sql = "SELECT id, nombre, valor FROM sip.parametro WHERE tipo='frecuenciafacturacion'";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.getPeriodos = function (req, res) {

  var promises = []
  var d = new Date();
  var anio = d.getFullYear()
  var mes = 9;
  
  for (var i = 0; i < 4; i++) {
    var mm = mes + i;
    var mmm = mm < 10 ? '0' + mm : mm;
    var periodo = parseInt(i)+1;
    var texto = mmm + '-' + anio;
    var newPromise = {'id':periodo, 'nombre': texto};
    promises.push(newPromise);
  };

  mes = 1;
  anio = anio + 1;
  for (var i = 0; i < 12; i++) {
    var mm = mes + i;
    var mmm = mm < 10 ? '0' + mm : mm;
    //var periodo = anio + '' + mmm;
    var periodo = parseInt(mmm)+4;
    var texto = mmm + '-' + anio;
    var newPromise = { 'id': periodo, 'nombre': texto };
    promises.push(newPromise);
  };

  res.json(promises);
};

exports.getTipoRecupera = function (req, res) {
  var promises = []
  
  var recname = 'No Recupera' 
  var recid = 100
  var newPromise = { 'id': recid, 'nombre': recname };
  promises.push(newPromise);
  var recname = 'Parcial' 
  var recid = 77
  var newPromise = { 'id': recid, 'nombre': recname };
  promises.push(newPromise);
  var recname = 'Total' 
  var recid = 0
  var newPromise = { 'id': recid, 'nombre': recname };
  promises.push(newPromise);
     
  res.json(promises);
};