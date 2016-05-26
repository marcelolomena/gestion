var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

var log = function (inst) {
    console.dir(inst.get())
}

exports.action = function (req, res) {
    var action = req.body.oper;
    var montoorigen

    if (action != "del") {
        if (req.body.montoorigen != "")
            montoorigen = req.body.montoorigen.split(".").join("").replace(",", ".")
    }

    switch (action) {
        case "add":
            models.DetalleCompromiso.create({
                iddetalleserviciocto: req.body.iddetalleserviciocto,
                periodo: req.body.periodo,
                idmoneda: req.body.idmoneda,
                montoorigen: montoorigen,
                montopesos: req.body.montopesos,
                borrado: 1
            }).then(function (detalle) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.DetalleCompromiso.update({
                iddetalleserviciocto: req.body.iddetalleserviciocto,
                periodo: req.body.periodo,
                idmoneda: req.body.idmoneda,
                montoorigen: montoorigen,
                montopesos: req.body.montopesos,
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (detalle) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });
            break;
        case "del":
            models.DetalleCompromiso.destroy({
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

    var additional = [{
        "field": "iddetalleserviciocto",
        "op": "eq",
        "data": req.params.id
    }];

    //
    var tmp = function (callback) {
        models.DetalleCompromiso.count({
            where: { iddetalleserviciocto: req.params.id }
        }).then(function (cant) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + cant)
            if (cant === 0) {
                models.DetalleServicioCto.find({
                    where: { id: req.params.id }
                }).then(function (detallecto) {
                    models.Parametro.find({
                        where: { id: detallecto.idfrecuencia }
                    }).then(function (param) {
                        console.log(">>>>>>>>>>>>>>>>>>>>> " + param.nombre)
                        console.log(">>>>>>>>>>>>>>>>>>>>> " + param.valor)


                        models.sequelize.transaction({ autocommit: true }, function (t) {
                            var promises = []
                            for (var i = 0; i < param.valor; i++) {
                                var newPromise = models.DetalleCompromiso.create({
                                    'iddetalleserviciocto': req.params.id,
                                    'periodo': 201701, 'borrado': 1, 'pending': true
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

                            console.log("YAY ---> " + result);
                            callback(result)
                            //res.json({ records: 12, total: 12, page: 1, rows: result });
                        }).catch(function (err) {
                            console.log("NO!!! ---> " + err);
                            return next(err);
                        });

                    }).catch(function (err) {
                        console.log(err);
                        //res.json({ error_code: 1 });
                    });

                }).catch(function (err) {
                    console.log(err);
                    //res.json({ error_code: 1 });
                });
            }

        })

    }

    tmp(function (resultado) {
        /*
        utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
            if (err) {
                console.log("->>> " + err)
            } else {
                console.log("PICOCON ---> " + filters);
                models.DetalleCompromiso.count({
                    where: data
                }).then(function (records) {
                    var total = Math.ceil(records / rows);
                    models.DetalleCompromiso.findAll({
                        offset: parseInt(rows * (page - 1)),
                        limit: parseInt(rows),
                        order: orden,
                        where: data
                    }).then(function (detalles) {
                        //Contrato.forEach(log)
                        res.json({ records: records, total: total, page: page, rows: detalles });
                    }).catch(function (err) {
                        //console.log(err);
                        res.json({ error_code: 1 });
                    });
                })
            }
        });
        */
        res.json({ records: 12, total: 12, page: 1, rows: resultado });
    });

};
