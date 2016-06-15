var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.flujoenvuelo.create({
                iddetalleenvuelo: req.params.id,
                periodo: req.body.periodo,
                presupuestoorigen: req.body.presupuestoorigen,
                borrado: 1
            }).then(function (detalle) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            var presupuestoorigen = req.body.presupuestoorigen.split(".").join("").replace(",", ".")
            //console.log("req.params.id :" + req.params.id)
            //console.log("req.body.id :" + req.body.id)
            //console.log("req.body.periodo :" + req.body.periodo)
            //console.log("req.body.presupuestoorigen :" + presupuestoorigen)
            models.flujoenvuelo.update({
                periodo: req.body.periodo,
                presupuestoorigen: presupuestoorigen
            }, {
                where: {
                    id: parseInt(req.body.id)
                }
                }).then(function (detalle) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });
            break;
        case "del":
            models.flujoenvuelo.destroy({
                where: {
                    id: req.params.id
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

    var additional = [{
        "field": "iddetalleenvuelo",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.flujoenvuelo.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.flujoenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (flujoenvuelo) {
                    res.json({ records: records, total: total, page: page, rows: flujoenvuelo });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
