'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var utilSeq = require('../../utils/seq');
var _ = require('lodash');

var entity = models.torre;

function map(req) {
    return {
        id: req.body.id,
        nombre: req.body.nombre,
        correo: req.body.correo
    }
}

function list(req, res) {
    var id = req.params.id;
    var page = 1
    var rows = 10
    var filters = req.params.filters
    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            entity.count({
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                entity.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: ['id']
                }).then(function (instal) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: instal
                    });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error_code: 1
                    });
                });
            })
        }
    });
}


function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

module.exports = {
    list: list,
    action: action
};