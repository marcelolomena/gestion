'use strict';
var logger = require('../../utils/logger');
var _ = require('lodash');

function create(entity, data, res) {
    entity.create(data)
        .then(function (created) {
            return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1, glosa: err.message });
        });
}
function update(entity, data, res) {
    entity.update(data, {
        where: {
            id: data.id
        }
    })
        .then(function (updated) {
            return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1, glosa: err.message });
        });
}
function destroy(entity, id, res) {
    entity.destroy({
        where: {
            id: id
        }
    }).then(function (rowDeleted) {
        if (rowDeleted === 1) {
            logger.debug('Deleted successfully');
        }
        return res.json({ success: true, glosa: '' });
    }).catch(function (err) {
        logger.error(err);
        return res.json({ success: false, glosa: err.message });
    });
}

module.exports = {
    create: create,
    update: update,
    destroy: destroy,
    getFilters:getFilters
};

function getFilters(filters) {
   if (filters) {
    var jsonObj = JSON.parse(filters);
    var conditions = _.map(jsonObj.rules || [], function (item) {
        switch (item.op) {
            case 'eq':
                return { [item.field]: item.data };
            case 'cn':
                return { [item.field]: { $like: '%' + item.data + '%' } };
            case 'ge':
                return { [item.field]: { $gte: item.data } };
            case "le":
                return { [item.field]: { $lte: item.data } };
            case "ne":
                return { [item.field]: { $ne: item.data } };
        }
    });
    return conditions;
}
return{};
}
var pp = {
    'eq': '==', 'ne': '!', 'lt': '<', 'le': '<=', 'gt': '>', 'ge': '>=', 'bw': '^',
    'bn': '!^', 'in': '=', 'ni': '!=', 'ew': '\|', 'en': '!@', 'cn': '~',
    'nc': '!~', 'nu': '#', 'nn': '!#', 'bt': '...'
};