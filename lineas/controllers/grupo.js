var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.grupo.create({
                rut: req.body.rut,
                nombre: req.body.nombre,
                razonsocial: req.body.razonsocial
            }).then(function (grupo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.grupo.update({
                rut: req.body.rut,
                nombre: req.body.nombre,
                razonsocial: req.body.razonsocial
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (grupo) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });



            break;
        case "del":
            models.grupo.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
            });

            break;

    }
}

exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "rut";

    if (!sord)
        sord = "asc";

    var orden = "[grupo]." + sidx + " " + sord;

    var filter_one = []
    var filter_two = []
    var filter_three = []
    var filter_four = []

    if (filters != undefined) {
        //logger.debug(filters)
        var item = {}
        var jsonObj = JSON.parse(filters);

        jsonObj.rules.forEach(function (item) {
            if (item.field) {
                filter_one.push({ [item.field]: { $like: '%' + item.data + '%' } });
            }
        })
    }

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.grupo.count({
                where: filter_one
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.grupo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: filter_one
                }).then(function (mac) {
                    return res.json({ records: records, total: total, page: page, rows: mac });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

}

exports.actiondesglose = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.grupodesglose.create({
                idgrupo: req.body.parent_id,
                rut: req.body.rut,
                razonsocial: req.body.razonsocial
            }).then(function (grupo) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });
            break;
        case "edit":
            models.grupodesglose.update({
                rut: req.body.rut,
                razonsocial: req.body.razonsocial
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (grupo) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });


            break;
        case "del":

            models.grupodesglose.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
            });
            break;
    }
}

exports.listdesglose = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idgrupo",
        "op": "eq",
        "data": req.params.id
    }];

    if (!sidx)
        sidx = "rut";

    if (!sord)
        sord = "asc";

    var orden = "[grupodesglose]." + sidx + " " + sord;

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.grupodesglose.belongsTo(models.grupo, { foreignKey: 'idgrupo' });
            models.grupodesglose.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.grupodesglose.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    order: orden,
                    include: [{
                        model: models.grupo
                    }]
                }).then(function (grupodesglose) {
                    return res.json({ records: records, total: total, page: page, rows: grupodesglose });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.getgrupo = function (req, res) {
    sequelize.query(
        'select * from dbo.grupocliente ' +
        'where rutcliente =  ' + req.params.rut,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });

}