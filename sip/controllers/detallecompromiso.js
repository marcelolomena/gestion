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

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.DetalleCompromiso.belongsTo(models.DetalleServicioCto, { foreignKey: 'iddetalleserviciocto' });
            models.DetalleCompromiso.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.DetalleCompromiso.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.DetalleServicioCto
                    }]
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

};
