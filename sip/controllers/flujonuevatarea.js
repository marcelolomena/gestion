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

    if (action != "del") {
        if (montoorigen != "")
            montoorigen = montoorigen.split(".").join("").replace(",", ".")
        if (costoorigen != "")
            costoorigen = costoorigen.split(".").join("").replace(",", ".")
    }

    switch (action) {
        case "add":
            models.flujonuevatarea.create({
                idtareasnuevosproyectos: req.params.idd,
                periodo: req.body.periodo,
                montoorigen: montoorigen,
                costoorigen: costoorigen,
                borrado: 1
            }).then(function (detalle) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                //console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.flujonuevatarea.update({
                periodo: req.body.periodo,
                montoorigen: montoorigen,
                costoorigen: costoorigen
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
            models.flujonuevatarea.destroy({
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
        "field": "idtareasnuevosproyectos",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.flujonuevatarea.belongsTo(models.art_sub_task, { foreignKey: 'idsubtarea' });
            models.art_sub_task.belongsTo(models.art_task, { foreignKey: 'task_id' });
            models.art_task.belongsTo(models.art_project_master, { foreignKey: 'pId' });
            models.flujonuevatarea.belongsTo(models.parametro, { foreignKey: 'idtipopago' });
            models.flujonuevatarea.count({
                where: data
            }).then(function (records) {
                //if (records > 0) {
                var total = Math.ceil(records / rows);
                models.flujonuevatarea.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [
                        {
                            model: models.art_sub_task,
                            include: [
                                {
                                    model: models.art_task,
                                    include: [
                                        {
                                        model: models.art_project_master
                                    }] 
                                }]
                        },
                        {
                            model: models.parametro
                        }]
                }).then(function (compromisos) {
                    res.json({ records: records, total: total, page: page, rows: compromisos });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });
                //} else {
                //  insertaPeriodos(function (compromisos) {
                //    res.json({ records: 12, total: 12, page: 1, rows: compromisos });
                // });
                //}
            })
        }
    });
};
