var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
    var action = req.body.oper;
    var valorcuota = req.body.valorcuota
    var impuesto = req.body.impuesto
    var factorimpuesto = req.body.factorimpuesto
    var anexo = req.body.anexo == "" ? "ND": req.body.anexo;
    var saldopresupuesto = req.body.saldopresupuesto == "" ? "0": req.body.saldopresupuesto;
    

    switch (action) {
        case "add":
            var sql = "DECLARE @ctacontable INT; "+
            "SELECT @ctacontable=idcuenta FROM sip.servicio WHERE id="+ req.body.idservicio+"; "+
            "INSERT INTO sip.detalleserviciocto (idcontrato, anexo, idcui, idservicio, idcuenta, "+
            "fechainicio, fechatermino, fechacontrol, valorcuota, valortotal, idmoneda, "+
            "idplazocontrato, idcondicion, impuesto, factorimpuesto, idcontactoproveedor, idestadocto, "+
            "glosaservicio, borrado, mesesentrecuotas, periodoprimeracuota, numerocuotas, periodoinicioservicio, "+
            "diferido, saldopresupuesto, tipogeneracion, comentario) "+
            "VALUES ("+req.body.parent_id+",'"+ anexo+"',"+ req.body.idcui+","+req.body.idservicio+", @ctacontable,'"+req.body.fechainicio+"','"+
            req.body.fechatermino+"','"+req.body.fechacontrol+"',"+req.body.valorcuota+","+ req.body.valorcuota+","+ req.body.idmoneda+","+
            req.body.idplazocontrato+","+req.body.idcondicion+","+
            req.body.impuesto+","+ req.body.factorimpuesto+","+req.body.idcontactoproveedor+","+req.body.idestadocto+",'"+
            req.body.glosaservicio+"',1,"+req.body.mesesentrecuotas+","+req.body.periodoprimeracuota+","+
            req.body.numerocuotas+","+req.body.periodoinicioservicio+","+req.body.diferido+","+req.body.saldopresupuesto+","+
            req.body.tipogeneracion+",'"+req.body.comentario+ "'); "+
            "DECLARE @id INT;"+
            "select @id = @@IDENTITY; "+
            "select @id as id;";
            sequelize.query(sql).spread(function (contratosrv) {
                    console.log("------------>cc:"+contratosrv);
                    console.log("------------>ID:"+contratosrv[0].id)
                    if (req.body.tipogeneracion == 1){
                        var cuotas = calculoCuotas(
                            req.body.valorcuota,
                            req.body.numerocuotas,
                            req.body.mesesentrecuotas,
                            req.body.periodoprimeracuota,
                            req.body.impuesto,
                            req.body.factorimpuesto,
                            req.body.diferido,
                            req.body.periodoinicioservicio
                        );
                        var mesini = req.body.periodoinicioservicio;
                        var mescuota = req.body.periodoprimeracuota;
                        var inicio = mesini < mescuota ? meisini : mescuota;
                        insertaPeriodos(contratosrv[0].id, cuotas, inicio, function (err, compromisos) {
                            console.log("***Periodos Creados");
                        });
                    }
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });

            break;
        case "edit":
            var anexo = req.body.anexo == "" ? "ND": req.body.anexo;
            
            var sql="DECLARE @ctacontable INT; "+
            "SELECT @ctacontable=idcuenta FROM sip.servicio WHERE id="+ req.body.idservicio+"; "+
            "UPDATE sip.detalleserviciocto set anexo='"+anexo+"', idcui="+req.body.idcui+", idservicio="+req.body.idservicio+
            ", idcuenta=@ctacontable, fechainicio='"+req.body.fechainicio+"', fechatermino='"+req.body.fechatermino+
            "', fechacontrol='"+req.body.fechacontrol+"', valorcuota="+req.body.valorcuota+", valortotal="+req.body.valorcuota+
            ", idmoneda="+req.body.idmoneda+", idplazocontrato="+req.body.idplazocontrato+", idcondicion="+req.body.idcondicion+
            ", impuesto="+req.body.impuesto+", factorimpuesto="+req.body.factorimpuesto+", idcontactoproveedor="+req.body.idcontactoproveedor+
            ", idestadocto="+req.body.idestadocto+", glosaservicio='"+req.body.glosaservicio+"', mesesentrecuotas="+req.body.mesesentrecuotas+
            ", periodoprimeracuota="+req.body.periodoprimeracuota+", numerocuotas="+req.body.numerocuotas+", periodoinicioservicio="+req.body.periodoinicioservicio+
            ", diferido="+req.body.diferido+", saldopresupuesto="+req.body.saldopresupuesto+", tipogeneracion="+req.body.tipogeneracion+
            ", comentario='"+req.body.comentario+"' "+
            "WHERE id="+req.body.id;
            console.log("sql:"+sql);
            sequelize.query(sql).spread(function (contratosrv) {
                if (req.body.tipogeneracion == 1){
                    var cuotas = calculoCuotas(
                        req.body.valorcuota,
                        req.body.numerocuotas,
                        req.body.mesesentrecuotas,
                        req.body.periodoprimeracuota,
                        req.body.impuesto,
                        req.body.factorimpuesto,
                        req.body.diferido,
                        req.body.periodoinicioservicio
                    );                
                    var mesini = req.body.periodoinicioservicio;
                    var mescuota = req.body.periodoprimeracuota;
                    console.log("***mesini:"+mesini+", mescuota:"+mescuota);
                    var inicio = mesini < mescuota ? mesini : mescuota;
                    borraPeriodos(req.body.id, function (nada) {
                        console.log("***Parametros:"+req.body.id+","+ cuotas+","+ inicio);
                        actualizaPeriodos(req.body.id, cuotas, inicio, function (err, compromisos) {
                            console.log("***Periodos Actualizados");
                        });
                        res.json({ error_code: 0 });
                    });
                } else {
                    borraPeriodos(req.body.id, function (nada) {
                        res.json({ error_code: 0 });
                    });  
                }
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });                
            
            break;
        case "del":
            models.detallecompromiso.destroy({
                where: {
                    iddetalleserviciocto: req.body.id
                }
            }).then(function (rowDeleted) {

                models.detalleserviciocto.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });

            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
    }


    var insertaPeriodos = function (idservicio, cuotas, mesini, callback) {
        console.log("insertaPeriodos:" + idservicio + "," + cuotas + " mini:" + mesini);
        models.sequelize.transaction({ autocommit: true }, function (t) {

            var promises = []
            var d = new Date();
            var anio = d.getFullYear()
            var mes = 1; //parseInt(mesini);
            var mesidx = 0;
            console.log("Recibe:" + cuotas[0][0] + "," + cuotas[0][1] + "," + cuotas[0][2] + "," + cuotas[0][3]);
            for (var i = 0; i < cuotas[0].length; i++) {
                var mm = mes + parseInt(mesidx);
                var mmm = mm < 10 ? '0' + mm : mm;
                var periodo = anio + '' + mmm;
                console.log("Periodo:"+periodo);
                var newPromise = models.detallecompromiso.create({
                    'iddetalleserviciocto': idservicio,
                    'periodo': periodo, 'borrado': 1,
                    'montoorigen': cuotas[1][i],
                    'costoorigen': cuotas[2][i],
                    'valorcuota': cuotas[0][i],
                    'pending': true
                }, { transaction: t });

                promises.push(newPromise);
                if (mm == 12) {
                    mesidx = 0;
                    mes = 0;
                    anio++;
                }
                mesidx++
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
    
    var borraPeriodos = function (idservicio, callback) {
        var sqldel = "delete from sip.detallecompromiso where iddetalleserviciocto="+idservicio;
        var borraperiodos = sequelize.query(sqldel)
            .spread(function (results) {
                callback("*");   
        });
    }
    
    var actualizaPeriodos = function (idservicio, cuotas, mesini, callback) {
        console.log("actualizaPeriodos:" + idservicio + "," + cuotas + " mini:" + mesini);
        models.sequelize.transaction({ autocommit: true }, function (t) {

            var promises = []
            var d = new Date();
            var anio = d.getFullYear()
            var mes = 1; //parseInt(mesini);
            var mesidx = 0;
            //borra periodos anteriores
            /*var sqldel = "delete from sip.detallecompromiso where iddetalleserviciocto="+idservicio;
            var borraperiodos = sequelize.query(sqldel)
                    .spread(function (results, metadata) {
                }, { transaction: t });
            promises.push(borraperiodos);*/
            
            console.log("Actualiza:" + cuotas[0][0] + "," + cuotas[0][1] + "," + cuotas[0][2] + "," + cuotas[0][3]);
            for (var i = 0; i < cuotas[0].length; i++) {
                var mm = mes + parseInt(mesidx);
                var mmm = mm < 10 ? '0' + mm : mm;
                var periodo = anio + '' + mmm;
                console.log("Periodo:"+periodo);
                var newPromise = models.detallecompromiso.create({
                    'iddetalleserviciocto': idservicio,
                    'periodo': periodo, 'borrado': 1,
                    'montoorigen': cuotas[1][i],
                    'costoorigen': cuotas[2][i],
                    'valorcuota': cuotas[0][i],
                    'pending': true
                }, { transaction: t });

                promises.push(newPromise);
                if (mm == 12) {
                    mesidx = 0;
                    mes = 0;
                    anio++;
                }
                mesidx++
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
    
}

function calculoCuotas(cuota, ncuotas, mesesentremedio, mescuota1, coniva, frecup, diferido, desdediferido) {
    console.log("CUOTAS DENTRO:" + cuota + "," + ncuotas + "," + mesesentremedio + "," + mescuota1 + "," + coniva + "," + frecup + "," +diferido + "," +desdediferido);
    var origen = [];
    var caja = [];
    var costo = [];
    var delta = parseInt(mescuota1)-parseInt(desdediferido);
    delta = Math.abs(delta);
    var delta = parseInt(mescuota1) > parseInt(desdediferido) ? parseInt(mescuota1) : parseInt(desdediferido);
    for (var i = 0; i < (parseInt(ncuotas) * parseInt(mesesentremedio))+delta; i++) {
        console.log("llenando");
        origen.push(0);
        caja.push(0);
        costo.push(0);
    }
    console.log("origen:"+origen);
    var mesesentre = parseInt(mesesentremedio);

    //Caja
    for (i = mescuota1, j = 0; i < caja.length + 1 && j < ncuotas; i = parseInt(i) + mesesentre, j++) {
        //console.log("***SALTO:" + (parseInt(i) + mesesentre));
        origen[i - 1] = cuota;
        if (coniva == "1") {
            var valorcaja = origen[i - 1] * 1.19;
        } else {
            var valorcaja = origen[i - 1];
        }
        caja[i - 1] = valorcaja;
    }
    //Costo con diferimiento
    //frecup = parseFloat(frecup) / 100; //En BD el dato es int por eso tiene un 77
    for (var i = desdediferido, j = 0, h = mescuota1; i <= caja.length + 1 && j < ncuotas && h <= costo.length; i = parseInt(i) + mesesentre, j++ , h = parseInt(h) + mesesentre) {
        console.log("*****JJJJ:" + j+ " h:"+h+ " i:"+i);
        if (coniva == "1") {
            var iva = origen[h - 1] * 0.19;
        } else {
            var iva = 0;
        }

        var recuperacion = iva * frecup;
        var total = parseFloat(origen[h - 1]) + parseFloat(recuperacion);
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
    var todo = [origen, caja, costo];
    console.log(todo);
    return todo;
}

exports.oper = function (req, res) {
    var action = req.body.oper;
    var valorcuota = req.body.valorcuota
    var impuesto = req.body.impuesto
    var factorimpuesto = req.body.factorimpuesto

    if (action != "del") {
        if (valorcuota != "")
            valorcuota = valorcuota.split(".").join("").replace(",", ".")

        if (impuesto != "")
            impuesto = impuesto.split(".").join("").replace(",", ".")

        if (factorimpuesto != "")
            factorimpuesto = factorimpuesto.split(".").join("").replace(",", ".")
    }

    switch (action) {
        case "add":
            //var factor = req.body.impuesto == 1 ? 1.19 : 1;
            //console.log("idcuenta ------------------> " + servicio.idcuenta);
            //console.log("cuentacontable ------------------> " + servicio.CuentasContable.cuentacontable);
            models.detalleserviciocto.create({
                idcontrato: req.body.parent_id,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: null,
                //servicio: null,
                idcuenta: null,
                cuentacontable: null,
                sap: req.body.sap,
                tarea: req.body.tarea,
                codigoart: req.body.codigoart,
                fechainicio: req.body.fechainicio,
                fechatermino: req.body.fechatermino,
                fechacontrol: req.body.fechacontrol,
                valorcuota: valorcuota,
                idmoneda: req.body.idmoneda,
                idfrecuencia: req.body.idfrecuencia,
                frecuenciafacturacion: req.body.frecuenciafacturacion,
                idplazocontrato: req.body.idplazocontrato,
                plazocontrato: req.body.plazocontrato,
                idcondicion: req.body.idcondicion,
                condicionnegociacion: req.body.condicionnegociacion,
                impuesto: impuesto,
                factorimpuesto: factorimpuesto,
                idcontactoproveedor: req.body.idcontactoproveedor,
                idestadocto: req.body.idestadocto,
                estadocontrato: req.body.estadocontrato,
                glosaservicio: req.body.glosaservicio,
                borrado: 1
            }).then(function (contrato) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.detalleserviciocto.update({
                idcontrato: req.body.idcontrato,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: req.body.idservicio,
                //servicio: req.body.servicio,
                idcuenta: req.body.idcuenta,
                cuentacontable: req.body.cuentacontable,
                sap: req.body.sap,
                tarea: req.body.tarea,
                codigoart: req.body.codigoart,
                fechainicio: req.body.fechainicio,
                fechatermino: req.body.fechatermino,
                fechacontrol: req.body.fechacontrol,
                valorcuota: req.body.valorcuota,
                idmoneda: req.body.idmoneda,
                idfrecuencia: req.body.idfrecuencia,
                frecuenciafacturacion: req.body.frecuenciafacturacion,
                idplazocontrato: req.body.idplazocontrato,
                plazocontrato: req.body.plazocontrato,
                idcondicion: req.body.idcondicion,
                condicionnegociacion: req.body.condicionnegociacion,
                impuesto: impuesto,
                factorimpuesto: factorimpuesto,
                idcontactoproveedor: req.body.idcontactoproveedor,
                idestadocto: req.body.idestadocto,
                estadocontrato: req.body.estadocontrato,
                glosaservicio: req.body.glosaservicio
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
            models.detallecompromiso.destroy({
                where: {
                    iddetalleserviciocto: req.body.id
                }
            }).then(function (rowDeleted) {

                models.detalleserviciocto.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });

            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
    }
}

exports.sap = function (req, res) {
    models.proyecto.findAll({
        attributes: ['id', 'sap']
    }).then(function (proyecto) {
        //console.dir(proyecto)
        res.json(proyecto);
    }).catch(function (err) {
        //console.log(err);
        res.json({ error_code: 1 });
    });
}

exports.plantillapresupuesto = function (req, res) {

    /*models.plantillapresupuesto.belongsTo(models.servicio, { foreignKey: 'idservicio' });
    models.plantillapresupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
    models.plantillapresupuesto.findAll({
        where: { idproveedor: req.params.id },
        attributes: ['id'],
        include: [
            {
                model: models.servicio, attributes: ['id', 'nombre']
            },
            {
                model: models.estructuracui, attributes: ['id', 'cui', 'nombre']
            }]
    }).then(function (plantillapresupuesto) {
        res.json(plantillapresupuesto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });*/
    
    var sql="SELECT a.idcui AS id, b.cui, b.nombre  FROM sip.plantillapresupuesto a JOIN sip.estructuracui b ON a.idcui=b.id WHERE idproveedor="+req.params.id+
            " GROUP BY a.idcui, b.cui, b.nombre ";
    sequelize.query(sql).spread(function (cuis) {
        console.log("Rescato cuis");
        res.json(cuis);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });     

}

exports.cuiforservice = function (req, res) {
    /*
    models.plantillapresupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
    models.plantillapresupuesto.findAll({
        where: [{ idproveedor: req.params.idp }, { idservicio: req.params.ids }],
        attributes: ['id'],
        include: [
            {
                model: models.estructuracui, attributes: ['id', 'cui', 'nombre']
            }]
    }).then(function (plantillapresupuesto) {
        res.json(plantillapresupuesto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });*/

    var sql="SELECT a.idservicio AS id, b.nombre AS nombre FROM sip.plantillapresupuesto a JOIN sip.servicio b ON a.idservicio=b.id "+ 
        "WHERE a.idproveedor="+req.params.idp+" AND a.idcui="+req.params.ids+" AND b.tiposervicio='Continuidad' "+
        "GROUP BY a.idservicio, b.nombre";
    sequelize.query(sql).spread(function (cuis) {
        console.log("Rescato servicios");
        res.json(cuis);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });  
}

exports.tarea = function (req, res) {
    models.detalleproyecto.findAll({
        attributes: ['id', 'tarea'],
        where: { idproyecto: req.params.id }
    }).then(function (proyecto) {
        res.json(proyecto);
    }).catch(function (err) {
        //console.log(err);
        res.json({ error_code: 1 });
    });
}

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "servicio.nombre";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idcontrato",
        "op": "eq",
        "data": req.params.id
    }];

    //console.log(")))))))))))))))))))))) " + req.user.last_name)

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {

        if (err) {
            console.log("->>> " + err)
        } else {

            models.detalleserviciocto.belongsTo(models.contrato, { foreignKey: 'idcontrato' });
            models.detalleserviciocto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
            models.detalleserviciocto.belongsTo(models.servicio, { foreignKey: 'idservicio' });
            models.detalleserviciocto.belongsTo(models.cuentascontables, { foreignKey: 'idcuenta' });
            models.detalleserviciocto.belongsTo(models.moneda, { foreignKey: 'idmoneda' });

            models.detalleserviciocto.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.detalleserviciocto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.contrato
                    }, {
                            model: models.estructuracui
                        }, {
                            model: models.servicio
                        }]
                }).then(function (contratos) {
                    //console.dir(contratos)
                    res.json({ records: records, total: total, page: page, rows: contratos });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};


exports.getPeriodos = function (req, res) {

  var promises = []
  var d = new Date();
  var anio = d.getFullYear()
  mes = 1;
  for (var i = 0; i < 12; i++) {
    var mm = mes + i;
    var mmm = mm < 10 ? '0' + mm : mm;
    //var periodo = anio + '' + mmm;
    var periodo = parseInt(mmm);
    var texto = mmm + '-' + anio;
    var newPromise = { 'id': periodo, 'nombre': texto };
    promises.push(newPromise);
  };
  anio = anio+1;
  for (var i = 0; i < 12; i++) {
    var mm = mes + i;
    var mmm = mm < 10 ? '0' + mm : mm;
    //var periodo = anio + '' + mmm;
    var periodo = parseInt(mmm)+12;
    var texto = mmm + '-' + anio;
    var newPromise = { 'id': periodo, 'nombre': texto };
    promises.push(newPromise);
  };  
  res.json(promises);
};

exports.getSaldoPresup = function (req, res) {
console.log("En getSaldoPresup");
  var serv = req.params.id;
  var cui = req.params.id2;
  var d = new Date();
  var anio = d.getFullYear();
  var sql = "DECLARE @ejer int; "+
  "SELECT @ejer=id FROM sip.ejercicios WHERE ejercicio="+anio+"; "+ 
  "select montopresupuestocaja from sip.saldospresupuestos where "+
  " idcui="+cui+" and idservicio="+serv+" and idejercicio=@ejer";
  console.log("query:"+sql);
    sequelize.query(sql).spread(function (saldo) {
        console.log("En getSaldoPresup 2:"+saldo[0].montopresupuestocaja);
        res.json(saldo);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });  


};