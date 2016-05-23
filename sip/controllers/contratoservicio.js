var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
    var action = req.body.oper;
}

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "servicio";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idcontrato",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {

        if (err) {
            console.log("->>> " + err)
        } else {
            models.DetalleServicioCto.belongsTo(models.Contrato, { foreignKey: 'idcontrato' });
            models.DetalleServicioCto.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.DetalleServicioCto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.Contrato
                    }]
                }).then(function (contratos) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: contratos });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
