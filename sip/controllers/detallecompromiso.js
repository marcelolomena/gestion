var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

var log = function (inst) {
    console.dir(inst.get())
}

exports.action = function (req, res) {
    var action = req.body.oper;
    var montoorigen = req.body.montoorigen
    var costoorigen = req.body.costoorigen
    var parentRowKey = req.body.parentRowKey
    var valorcuota = req.body.valorcuota
    var impuesto = req.body.impuesto
    var factorimpuesto = req.body.factorimpuesto

/*    if (action != "del") {
        if (montoorigen != "")
            montoorigen = montoorigen.split(".").join("").replace(",", ".")
        if (costoorigen != "")
            costoorigen = costoorigen.split(".").join("").replace(",", ".")
        if (valorcuota != "")
            valorcuota = valorcuota.split(".").join("").replace(",", ".")
    }*/

    console.log("montoorigen : " + montoorigen)
    console.log("costoorigen : " + costoorigen)
    switch (action) {
        case "add":
            /*models.detallecompromiso.create({
                iddetalleserviciocto: req.params.idd,
                periodo: req.body.periodo,
                montoorigen: montoorigen,
                costoorigen: costoorigen,
                borrado: 1,
                valorcuota: valorcuota
            }).then(function (detalle) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                //console.log(err);
                res.json({ error_code: 1 });
            });*/
            
            var sql="SELECT * FROM sip.detallecompromiso WHERE iddetalleserviciocto="+req.params.idd +" AND periodo="+req.body.periodo;
            sequelize.query(sql).spread(function (rows) {
                if (rows.length > 0) {
                    console.log("periodo repetido");
                    res.json({ error_code: 10 });
                } else {
                    sequelize.query("EXECUTE sip.InsertaPeriodoContrato "+req.params.idd+","+
                    req.body.periodo+","+valorcuota)
                        .then(function (rows) {
                            console.log("****Creo Periodo contrato"); 
                            res.json({ error_code: 0 });
                        }).catch(function (err) {
                            console.log(err);
                            res.json({ error_code: 1 });
                        });                       
                }
            });            
                
            break;
        case "edit":
            /*
                        var valMoneda = function (callback) {
                            models.monedasconversion.findAll({
                                where: [{ idmoneda: req.body.idmoneda }, { periodo: req.body.periodo }]
                            }).then(function (monedasconversion) {
                                callback(monedasconversion[0].valorconversion);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
            */
/*
            models.detallecompromiso.update({
                periodo: req.body.periodo,
                montoorigen: montoorigen,
                costoorigen: costoorigen,
                valorcuota: valorcuota
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (detalle) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });*/
                
        sequelize.query("EXECUTE sip.UpdatePeriodoContrato "+req.body.id+","+
        valorcuota)
            .then(function (rows) {
                console.log("****Actualizo Periodo contrato"); 
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });   
            break;
        case "del":
            models.detallecompromiso.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
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

exports.list = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "periodo";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;
       
    sequelize.query("select * from sip.detallecompromiso where iddetalleserviciocto="+req.params.id)
        .spread(function (rows) {
        res.json({ records: 1, total: 1, page: 1, rows: rows });
        });    
    
    
/*
    var additional = [{
        "field": "iddetalleserviciocto",
        "op": "eq",
        "data": req.params.id
    }];
    
    

    var buscaParamValue = function (detallecto, callback) {
        return models.parametro.find({
            where: { id: detallecto.idfrecuencia }
        }).then(function (param) {
            switch (param.nombre) {
                case "Anual":
                    utilSeq.getYearRange(detallecto.fechainicio, detallecto.fechatermino, function (err, range) {
                        callback([range.length, range])
                    });
                    break;
                case "Mensual":
                    utilSeq.getMonthRange(detallecto.fechainicio, detallecto.fechatermino, function (err, range) {
                        callback([range.length, range])
                    });
                    break;
                case "Otros":
                    callback([0, []])
                    break;
            }

        }).catch(function (err) {
            console.log("Que paso?> " + err);
        });
    }

    var insertaPeriodos = function (callback) {
        models.detalleserviciocto.find({
            where: { id: req.params.id }
        }).then(function (detallecto) {
            buscaParamValue(detallecto, function (param) {
                var valcuo = detallecto.valorcuota;
                var valmon = detallecto.idmoneda;
                var valimp = detallecto.impuesto
                var valfac = detallecto.factorimpuesto
                //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> [" + req.params.id + "]")
                models.sequelize.transaction({ autocommit: true }, function (t) {
                    var promises = [], convert
                    for (var i = 0; i < param[0]; i++) {
                        //console.log("montoorigen = " + valcuo + valcuo * valimp);
                        //console.log("costoorigen = " + valcuo + valcuo * valimp * valfac);
                        var newPromise = models.detallecompromiso.create({
                            'iddetalleserviciocto': req.params.id,
                            'periodo': param[1][i], 'borrado': 1,
                            'montoorigen': valcuo + (valcuo * valimp),
                            'costoorigen': valcuo + (valcuo * valimp * valfac),
                            'valorcuota': valcuo,
                            'pending': true
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
                    console.log("--------> " + err);
                });

            })
        }).catch(function (err) {
            console.log(err);
        });
    }

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.detallecompromiso.count({
                where: data
            }).then(function (records) {
                if (records > 0) {
                    var total = Math.ceil(records / rows);
                    models.detallecompromiso.findAll({
                        offset: parseInt(rows * (page - 1)),
                        limit: parseInt(rows),
                        order: orden,
                        where: data
                    }).then(function (compromisos) {
                        res.json({ records: records, total: total, page: page, rows: compromisos });
                    }).catch(function (err) {
                        console.log(err);
                        res.json({ error_code: 1 });
                    });
                } else {
                    insertaPeriodos(function (compromisos) {
                        res.json({ rows: compromisos });
                    });
                }
            })
        }
    });*/
};
