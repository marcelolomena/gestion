'use strict';
var models = require('../../models');
var logger = require('../../utils/logger');
var nodeExcel = require('excel-export');
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
function list(req, res, entity, includes, transformer) {
    var page = req.query.page;
    var rows = req.query.rows;

    var filters = req.query.filters;
    var sidx = req.query.sidx || 'id';
    var sord = req.query.sord || 'desc';
    var orden = entity.name + '.' + sidx + ' ' + sord;
    var whereClause = getFilters(filters);

    entity.count({
        where: whereClause
    })
        .then(function (records) {
            var total = Math.ceil(records / rows);
            return entity.findAll({
                offset: parseInt(rows * (page - 1)),
                limit: parseInt(rows),
                // order: orden,
                where: whereClause,
                include: includes
            })
                .then(function (data) {
                    var resultData = transformer(data);
                    return res.json({ records: records, total: total, page: page, rows: resultData });
                })
                .catch(function (err) {
                    logger.error(err.message);
                    return res.json({ error_code: 1 });
                })
        })
        .catch(function (err) {
            logger.error(err.message);
            return res.json({ error_code: 1 });
        });
}
function listChilds(req, res, entity, pIdName, includes, transformer) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'id';
    var sord = req.query.sord || 'desc';
    var orden = entity.name + '.' + sidx + ' ' + sord;
    var whereClause = getFilters(filters);
    var pFilter = {
        field: pIdName,
        op: "eq",
        data: req.params.pId
    };
    whereClause.push(translateFilter(pFilter));


    entity.count({
        where: whereClause
    })
        .then(function (records) {
            var total = Math.ceil(records / rows);
            return entity.findAll({
                offset: parseInt(rows * (page - 1)),
                limit: parseInt(rows),
                // order: orden,
                where: whereClause,
                include: includes
            })
                .then(function (data) {
                    var resultData = transformer(data);
                    return res.json({ records: records, total: total, page: page, rows: resultData });
                })
                .catch(function (err) {
                    logger.error(err.message);
                    return res.json({ error_code: 1 });
                })
        })
        .catch(function (err) {
            logger.error(err.message);
            return res.json({ error_code: 1 });
        });
}
function listAll(req, res, entity, mapper) {
    entity.findAll()
        .then(function (rows) {
            return res.json(_.orderBy(_.map(rows, mapper), ['nombre']));
        })
        .catch(function (err) {
            logger.error(err.message);
            return res.json({
                error_code: 1
            });
        });
}
function exportList(req, res, entity, includes, transformer, cols) {
    var filters = req.query.filters;
    var whereClause = getFilters(filters);
    return entity.findAll({
        where: whereClause,
        include: includes
    })
        .then(function (data) {
            var conf = {}
            con.cols = cols;
            conf.rows = transformer(data);
            var result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformates');
            res.setHeader("Content-Disposition", "attachment;filename=" + "preguntasolicitud_" + + Math.floor(Date.now()) + ".xlsx");
            return res.end(result, 'binary');
        })
        .catch(function (err) {
            logger.error(err.message);
            return res.json({ error_code: 1 });
        })

}
module.exports = {
    create: create,
    update: update,
    destroy: destroy,
    list: list,
    listChilds: listChilds,
    listAll: listAll,
    exportList: exportList,
    getFilters: getFilters
};

function translateFilter(item) {
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
}
function getFilters(filters) {
    if (filters) {
        var jsonObj = JSON.parse(filters);
        var conditions = _.map(jsonObj.rules || [], function (item) {
            return translateFilter(item);
        });
        return conditions;
    }
    return [];
}
var pp = {
    'eq': '==', 'ne': '!', 'lt': '<', 'le': '<=', 'gt': '>', 'ge': '>=', 'bw': '^',
    'bn': '!^', 'in': '=', 'ni': '!=', 'ew': '\|', 'en': '!@', 'cn': '~',
    'nc': '!~', 'nu': '#', 'nn': '!#', 'bt': '...'
};