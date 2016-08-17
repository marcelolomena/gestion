var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
    var action = req.body.oper;
    var fecha;

    if (action != "del") {
        if (req.body.dolar != "")
            dolar = req.body.dolar.split(".").join("").replace(",", ".")

        if (req.body.uf != "")
            uf = req.body.uf.split(".").join("").replace(",", ".")

        if (req.body.fechaconversion != "")
            fecha = req.body.fechaconversion.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.conversionenvuelo.create({
                idpresupuestoenvuelo: req.body.parent_id,
                dolar: dolar,
                uf: uf,
                fechaconversion: fecha,
                extension: req.body.extension,
                borrado: 1
            }).then(function (iniciativa) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.conversionenvuelo.update({
                dolar: dolar,
                uf: uf,
                fechaconversion: fecha,
                extension: req.body.extension
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (iniciativa) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });
            break;
        case "del":
            models.conversionenvuelo.destroy({
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

// Create endpoint /iniciativaprograma for GET
exports.list = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "extension";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idpresupuestoenvuelo",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.conversionenvuelo.count({
                where: data
            }).then(function (records) {
                console.log("campos: " + records);
                var total = Math.ceil(records / rows);
                models.conversionenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (iniciativas) {
                    res.json({ records: records, total: total, page: page, rows: iniciativas });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};