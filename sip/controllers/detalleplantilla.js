var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "idcui";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idcui",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.plantillapresupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
            models.plantillapresupuesto.belongsTo(models.servicio, { foreignKey: 'idservicio' });
            models.plantillapresupuesto.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });            
            models.plantillapresupuesto.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.plantillapresupuesto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: 
                    [{model: models.estructuracui},
                     {model: models.servicio},
                     {model: models.proveedor}                      
                    ]
                }).then(function (plantillas) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: plantillas });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
