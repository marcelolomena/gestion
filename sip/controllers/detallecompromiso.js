var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

var log = function (inst) {
    console.dir(inst.get())
}

exports.action = function (req, res) {
    var action = req.body.oper;
    var montoorigen = req.body.montoorigen

    if (action != "del") {
        if (montoorigen != "")
            montoorigen = montoorigen.split(".").join("").replace(",", ".")
    }

    switch (action) {
        case "add":
            models.DetalleCompromiso.create({
                iddetalleserviciocto: req.params.idd,
                periodo: req.body.periodo,
                montoorigen: montoorigen,
                borrado: 1
            }).then(function (detalle) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                //console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.DetalleCompromiso.update({
                periodo: req.body.periodo,
                montoorigen: montoorigen,
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

    var buscaParamValue = function (detallecto, callback) {
        return models.Parametro.find({
            where: { id: detallecto.idfrecuencia }
        }).then(function (param) {
            utilSeq.getDateRange(detallecto.fechainicio, function (err, range) {
                callback([param.valor, range])
            });
        });
    }

    var insertaPeriodos = function (callback) {
        models.DetalleServicioCto.find({
            where: { id: req.params.id }
        }).then(function (detallecto) {
            buscaParamValue(detallecto, function (param) {
                models.sequelize.transaction({ autocommit: true }, function (t) {
                    var promises = []
                    for (var i = 0; i < param[0]; i++) {
                        var newPromise = models.DetalleCompromiso.create({
                            'iddetalleserviciocto': req.params.id,
                            'periodo': param[1][i], 'borrado': 1,
                            'montoorigen': 0,
                            'montopesos': 0, 'pending': true
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
            models.DetalleCompromiso.count({
                where: data
            }).then(function (records) {
                if (records > 0) {
                    var total = Math.ceil(records / rows);
                    models.DetalleCompromiso.findAll({
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
                        res.json({ records: 12, total: 12, page: 1, rows: compromisos });
                    });
                }
            })
        }
    });
};
