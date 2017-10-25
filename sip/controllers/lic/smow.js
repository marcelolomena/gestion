'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.[Entity];
entity.belongsTo(models.[Entity], { foreignKey: '[foreignKey]' });

function map(req) {
    return {
        id: req.body.id || 0,
    }
}
function mapper(data) {
    return _.map(data, function (item) {
        return item;
    });
}
var includes = [
    {
        model: models.[foreignEntity]
    }
];

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
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
}