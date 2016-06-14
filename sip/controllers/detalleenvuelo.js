var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');


exports.tareasap = function (req, res) {

    models.detalleproyecto.belongsTo(models.proyecto, { foreignKey: 'idproyecto' });
    models.detalleproyecto.findAll({
        attributes: ['idproyecto', 'tarea'],
        include: [{
            model: models.proyecto, where: { sap: req.params.id },
        }]
    }).then(function (proyecto) {
        res.json(proyecto);
    }).catch(function (err) {
        console.log(err);
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
        sidx = "nombre";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idproyectoenvuelo",
        "op": "eq",
        "data": req.params.id
    }];
    models.detalleenvuelo.belongsTo(models.proyectosenvuelo, { foreignKey: 'idproyectoenvuelo' });
    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {

            models.detalleenvuelo.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.detalleenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.proyectosenvuelo
                    }]
                }).then(function (detalleenvuelo) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: detalleenvuelo });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
