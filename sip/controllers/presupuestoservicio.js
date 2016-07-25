var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');
// Create endpoint /proyecto for GET
exports.getPresupuestoServicios = function (req, res) {
  // Use the Proyectos model to find all proyectos
  var page = req.query.page;
  var rows = req.query.rows;
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

  var sql0 = "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rows + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.id, c.nombre, a.idservicio, d.moneda, a.idmoneda, a.montoforecast, a.montoanual, " +
    "a.costoforecast, a.costoanual, a.comentario, a.glosaservicio, a.idproveedor, " +
    "a.cuota, a.numerocuota, a.idfrecuencia, a.desde, a.masiva, a.ivarecuperable, a.mesesentrecuotas, " +
    "a.gastodiferido, b.razonsocial FROM sip.detallepre a " +
    "LEFT JOIN sip.proveedor b ON a.idproveedor = b.id " +
    "LEFT JOIN sip.servicio c ON c.id = a.idservicio  " +
    "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
    "WHERE a.idpresupuesto=" + id + ")" +
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
        "as resultNum, a.id, c.nombre, a.idservicio, b.cuentacontable, b.nombrecuenta, d.moneda, a.idmoneda, a.montoforecast, a.montoanual, " +
        "a.comentario, a.glosaservicio, a.idproveedor, " +
        "a.cuota, a.numerocuota, a.idfrecuencia, a.desde, a.masiva, a.ivarecuperable, a.mesesentrecuotas, " +
        "a.gastodiferido, b.razonsocial  FROM sip.detallepre a " +
        "LEFT JOIN sip.proveedor b ON a.idproveedor = b.id " +
        "LEFT JOIN sip.servicio c ON c.id = a.idservicio  " +
        "LEFT JOIN sip.moneda d ON a.idmoneda = d.id " +
        "WHERE a.idpresupuesto=" + id + " " + condition.substring(0, condition.length - 4) + ")" +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

      console.log(sql);

      models.detallepre.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })

    } else {
      console.log(sql0);
      models.detallepre.count({ where: [filtrosubgrilla] }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
          .spread(function (rows) {
            res.json({ records: records, total: total, page: page, rows: rows });
          });
      })
    }

  } else {
    console.log(sql0);
    models.detallepre.count({ where: [filtrosubgrilla] }).then(function (records) {
      var total = Math.ceil(records / rows);
      sequelize.query(sql0)
        .spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        });
    })

  }
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

  console.log("sql:" + sql);
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
      console.log(err);
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
  console.log("****MONEDAS+"+monedas);
  
  var insertaPeriodos = function (idservicio, cuotas, callback) {
    console.log("insertaPeriodos:" + idservicio + "," + cuotas);
    models.sequelize.transaction({ autocommit: true }, function (t) {

      var promises = []
      var d = new Date();
      var anio = d.getFullYear()
      var mes = 9;
      console.log("Recibe:" + cuotas[0][0] + "," + cuotas[0][1] + "," + cuotas[0][2] + "," + cuotas[0][3]);
      for (var i = 0; i < 4; i++) {
        var mm = mes + i;
        var mmm = mm < 10 ? '0' + mm : mm;
        var periodo = anio + '' + mmm;
        var newPromise = models.detalleplan.create({
          'iddetallepre': idservicio,
          'periodo': periodo,
          'presupuestobasecaja': 0,
          'presupuestobasecosto': 0,
          'presupuestoorigen': 0,
          'presupuestopesos': 0,
          'caja': 0,
          'costo': 0,
          'cajacomprometido': 0,
          'costocomprometido': 0,
          'totalcaja': 0,
          'totalcosto': 0,
          'borrado': 1
        }, { transaction: t });

        promises.push(newPromise);
      };
      mes = 1;
      anio = anio + 1;
      for (var i = 0; i < 12; i++) {
        var mm = mes + i;
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
    console.log("actualizaPeriodos:" + idservicio + "," + cuotas);
    models.sequelize.transaction({ autocommit: true }, function (t) {
      var promises = []
      var d = new Date();
      var anio = d.getFullYear()
      var mes = 1;
      anio = anio + 1;
      for (var i = 0; i < 12; i++) {
        var mm = mes + i;
        var mmm = mm < 10 ? '0' + mm : mm;
        var periodo = anio + '' + mmm;

       var sql = "update sip.detalleplan set "+
       "presupuestoorigen = "+cuotas[0][i]+", "+
       "presupuestopesos ="+cuotas[1][i]+", "+
       "caja="+cuotas[2][i] +", "+
       "costo="+cuotas[3][i] + ", "+
       "totalcaja="+cuotas[2][i]+"+cajacomprometido, "+
       "totalcosto="+cuotas[3][i]+"+costocomprometido "+
       " where iddetallepre="+idservicio+" and periodo="+periodo;

        var newPromise = sequelize.query(sql)
          .spread(function(results, metadata) {
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
      return err;
    });

  }

  switch (action) {
    case "add":
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
        borrado: 1
      }).then(function (servicio) {
        idservicio = servicio.id;
        console.log("****servicio:" + idservicio);
        //Find en tabla valor moneda
        //Then conversion
        //var monedas = getMonedas(idPre, req.body.idmoneda);
        //console.log("****MONEDAS+"+monedas);
        //var conversion = [26100, 26200, 26000, 26300, 26400, 26500, 26600, 26700, 26800, 26900, 27000, 26100];
        var cuotas = calculoCuotas(
          req.body.cuota,
          req.body.numerocuota,
          req.body.mesesentrecuotas,
          req.body.desde,
          req.body.masiva,
          0.77,
          monedas,
          req.body.gastodiferido
        );
        console.log("CUOTAS:" + cuotas);
        insertaPeriodos(idservicio, cuotas, function (err, compromisos) {
          console.log("***  ***ACTualizadetallepre:" + idservicio);
          sequelize.query('EXECUTE sip.actualizadetallepre ' + idservicio
            + ';').then(function (response) {
              res.json({ error_code: 0 });
            }).error(function (err) {
              res.json(err);
            });
        });
      }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
      });


      break;
    case "edit":
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
        gastodiferido: req.body.gastodiferido
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
            0.77,
            monedas,
            req.body.gastodiferido
          );
          actualizaPeriodos(idservicio, cuotas, function (err, compromisos) {
            console.log("***actualizadetallepre:" + idservicio);
            sequelize.query('EXECUTE sip.actualizadetallepre ' + idservicio
              + ';').then(function (response) {
                res.json({ error_code: 0 });
              }).error(function (err) {
                res.json(err);
              });
          });

        }).catch(function (err) {
          console.log(err);
          res.json({ error_code: 1 });
        });
      break;
    case "del":
      var id = req.body.id;
      var sql = "DELETE FROM sip.detalleplan WHERE iddetallepre=" + id + "; " +
        "DELETE FROM sip.detallepre WHERE id=" + id;

      sequelize.query(sql).then(function (response) {
        res.json({ error_code: 0 });
      }).error(function (err) {
        res.json(err);
      });

      break;

  }

}

function getMonedas(idpresupuesto, idmoneda) {

  var sql = "DECLARE @ejercicio INT " +
    "SELECT @ejercicio=idejercicio FROM sip.presupuesto WHERE id=" + idpresupuesto + " " +
    "SELECT valorconversion FROM sip.monedasconversion WHERE idejercicio=@ejercicio AND idmoneda=" + idmoneda;
  var conversion = [26100, 26200, 26000, 26300, 26400, 26500, 26600, 26700, 26800, 26900, 27000, 26100];
  //console.log("conversion:" + conversion);
  //console.log("*** SQL MOnedas" + sql);
  var arr = [];
  sequelize.query(sql)
    .spread(function (rows) {
      for (var i in rows) {
        arr.push(rows[i].valorconversion);
      }
      console.log("*********   ROWSSSSS:" + arr);

    }).then ()
    return arr;
}

function calculoCuotas(cuota, ncuotas, mesesentremedio, mescuota1, coniva, frecup, conversion, diferido) {
  console.log("CUPTAS DENTRO:" + cuota + "," + ncuotas + "," + mesesentremedio + "," + mescuota1 + "," + coniva + "," + frecup + "," + conversion);
  //var conversion = [26100,26200,26000,26300,26400,26500,26600,26700,26800,26900,27000,26100];
  var origen = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var pesos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var caja = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var costo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var mesesentre = parseInt(mesesentremedio);



  for (i=mescuota1, j=0; i<caja.length+1 && j<ncuotas; i=parseInt(i)+mesesentre, j++) {
    console.log("***SALTO:" + i + mesesentre);
    origen[i - 1] = cuota;
    pesos[i - 1] = cuota * conversion[i - 1];
    if (coniva == "1") {
      var valorcaja = pesos[i - 1] * 1.19;
    } else {
      var valorcaja = pesos[i - 1];
    }
    caja[i - 1] = valorcaja;
  }
  for (var i=mescuota1, j=0; i<caja.length+1 && j<ncuotas; i=parseInt(i)+mesesentre, j++) {
    console.log("*****JJJJ:"+j);
    if (coniva == "1") {
      var iva = pesos[i - 1] * 0.19;
    } else {
      var iva = 0;
    }
    var recuperacion = iva * frecup;
    var total = parseFloat(pesos[i - 1]) + parseFloat(recuperacion);
    if (diferido == "1") {
      var valorcosto = total / (mesesentre+1);
      var valorcosto = valorcosto.toFixed(2);
      for (k = i; k <= parseInt(i) + mesesentre && k < caja.length + 1; k++) {
        costo[k - 1] = valorcosto;
      }
    } else {
      costo[i - 1] = total;
    }

  }
  var todo = [origen, pesos, caja, costo];
  console.log(todo);
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
  /*
  for (var i = 0; i < 4; i++) {
    var mm = mes + i;
    var mmm = mm < 10 ? '0' + mm : mm;
    var periodo = anio + '' + mmm;
    var texto = mmm + '-' + anio;
    var newPromise = {'id':periodo, 'nombre': texto};
    promises.push(newPromise);
  };*/

  mes = 1;
  anio = anio + 1;
  for (var i = 0; i < 12; i++) {
    var mm = mes + i;
    var mmm = mm < 10 ? '0' + mm : mm;
    //var periodo = anio + '' + mmm;
    var periodo = parseInt(mmm);
    var texto = mmm + '-' + anio;
    var newPromise = { 'id': periodo, 'nombre': texto };
    promises.push(newPromise);
  };

  res.json(promises);
};