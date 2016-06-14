var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.proyectosenvuelo.create({
                sap: req.body.sap,
                nombre: req.body.nombre,
                idcui: req.body.idcui,
                cui: req.body.cui,
                porcentajeavance: req.body.porcentajeavance,
                fechainicio: req.body.fechainicio,
                fechapap: req.body.fechapap,
                fechacierresap: req.body.fechacierresap,
                uidlider: req.body.uidlider,
                liderproyecto: req.body.liderproyecto,
                uidpmo: req.body.uidpmo,
                pmoresponsable: req.body.pmoresponsable,
                borrado: 1
            }).then(function (contrato) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.proyectosenvuelo.update({
                sap: req.body.sap,
                nombre: req.body.nombre,
                idcui: req.body.idcui,
                cui: req.body.cui,
                porcentajeavance: req.body.porcentajeavance,
                fechainicio: req.body.fechainicio,
                fechapap: req.body.fechapap,
                fechacierresap: req.body.fechacierresap,
                uidlider: req.body.uidlider,
                liderproyecto: req.body.liderproyecto,
                uidpmo: req.body.uidpmo,
                pmoresponsable: req.body.pmoresponsable,
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
            models.proyectosenvuelo.destroy({
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
        sidx = "nombre";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.proyectosenvuelo.belongsTo(models.estructuracui, { foreignKey: 'idcui' });

            models.proyectosenvuelo.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.proyectosenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.estructuracui
                    }]
                }).then(function (proyectosenvuelo) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: proyectosenvuelo });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
