'use strict';
var models = require('../../models');
var logger = require('../../utils/logger');
var nodeExcel = require('excel-export');
var _ = require('lodash');

function createP(entity, data) {
    return entity.create(data);
}

function create(entity, data, res) {
    createP(entity, data)
        .then(function (created) {
            return res.json({
                error: 0,
                glosa: ''
            });
        }).catch(function (err) {
            logger.error(entity.name + ':create, ' + err);
            return res.json({
                error: 1,
                glosa: err.message
            });
        });
}

function updateP(entity, data) {
    return entity.update(data, {
        where: {
            id: data.id
        }
    });
}

function update(entity, data, res) {
    updateP(entity, data)
        .then(function (updated) {
            return res.json({
                error: 0,
                glosa: ''
            });
        }).catch(function (err) {
            logger.error(entity.name + ':update, ' + err);
            return res.json({
                error: 1,
                glosa: err.message
            });
        });
}

function destroyP(entity, id) {
    return entity.destroy({
        where: {
            id: id
        }
    });
}

function destroy(entity, id, res) {
    destroyP(entity, id)
        .then(function (rowDeleted) {
            if (rowDeleted === 1) {
                logger.debug(entity.name + ' Deleted successfully');
            }
            return res.json({
                success: true,
                glosa: ''
            });
        }).catch(function (err) {
            logger.error(entity.name + ':destroy, ' + err);
            return res.json({
                success: false,
                glosa: err.message
            });
        });
}

function list(req, res, entity, includes, transformer) {
    var page = parseInt(req.query.page);
    var rows = parseInt(req.query.rows);
    var orden = [
        [req.query.sidx || 'id', req.query.sord || 'asc']
    ];
    var whereClause = getFilters(req.query.filters);

    entity.count({
        where: whereClause
    }).then(function (records) {
        var total = Math.ceil(records / rows);
        return entity.findAll({
            offset: parseInt(rows * (page - 1)),
            limit: parseInt(rows),
            order: orden,
            where: whereClause,
            include: includes
        }).then(function (data) {
            var resultData = transformer(data);
            return res.json({
                records: records,
                total: total,
                page: page,
                rows: resultData
            });
        }).catch(function (err) {
            logger.error(entity.name + ':list.findAll, ' + err.message);
            return res.json({
                error_code: 1
            });
        })
    }).catch(function (err) {
        logger.error(entity.name + ':list.count, ' + err.message);
        return res.json({
            error_code: 1
        });
    });
}

function listChilds(req, res, entity, pIdName, includes, transformer) {
    var page = parseInt(req.query.page);
    var rows = parseInt(req.query.rows);
    var orden = (req.query.sidx || (entity.name + '.id')) + ' ' + (req.query.sord || 'desc');
    var whereClause = getFilters(req.query.filters);
    var pFilter = {
        field: pIdName,
        op: "eq",
        data: req.params.pId
    };
    whereClause.push(translateFilter(pFilter));
    entity.count({
        where: whereClause
    }).then(function (records) {
        var total = Math.ceil(records / rows);
        return entity.findAll({
            offset: parseInt(rows * (page - 1)),
            limit: parseInt(rows),
            // order: orden,
            where: whereClause,
            include: includes
        }).then(function (data) {
            var resultData = transformer(data);
            return res.json({
                records: records,
                total: total,
                page: page,
                rows: resultData
            });
        }).catch(function (err) {
            logger.error(entity.name + ':listChilds.findAll, ' + err.message);
            return res.json({
                error_code: 1
            });
        })
    }).catch(function (err) {
        logger.error(entity.name + ':listChilds.count, ' + err.message);
        return res.json({
            error_code: 1
        });
    });
}

function listAll(req, res, entity, mapper) {
    entity.findAll().then(function (rows) {
        return res.json(_.orderBy(_.map(rows, mapper), ['nombre']));
    }).catch(function (err) {
        logger.error(entity.name + ':listAll.findAll, ' + err.message);
        return res.json({
            error_code: 1
        });
    });
}

function exportList(req, res, entity, includes, transformer, cols, fileName) {
    var whereClause = getFilters(req.query.filters);
    return entity.findAll({
        where: whereClause,
        include: includes
    }).then(function (data) {
        var result = nodeExcel.execute({
            cols: cols,
            rows: transformer(data)
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        var ts = new Date(Date.now());
        var sts = ts.getFullYear().toString() + _.padStart((ts.getMonth() + 1).toString(), 2, '0') + _.padStart(ts.getUTCDate().toString(), 2, '0');
        res.setHeader('Content-Disposition', 'attachment;filename=' + fileName + '_' + sts + '.xlsx');
        return res.end(result, 'binary');
    }).catch(function (err) {
        logger.error(entity.name + ':exportList.findAll, ' + err.message);
        return res.json({
            error_code: 1
        });
    })
}

function toDate(ddmmaaaa) {
    if (!ddmmaaaa) {
        return null;
    }
    var parts = _.split(ddmmaaaa, '-');
    var result = new Date(Date.UTC(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])));
    return result;
}

function fromDate(fecha) {
    var result = fecha ? _.padStart(fecha.getUTCDate(), 2, '0') + '-' + _.padStart(getUTCMonth(fecha), 2, '0') + '-' + fecha.getUTCFullYear() : '';
    return result;
}

function now() {
    return new Date(Date.now())
}
module.exports = {
    createP: createP,
    updateP: updateP,
    destroyP: destroyP,
    create: create,
    update: update,
    destroy: destroy,
    list: list,
    listChilds: listChilds,
    listAll: listAll,
    exportList: exportList,
    getFilters: getFilters,
    toDate: toDate,
    fromDate: fromDate,
    now: now
};

function getUTCMonth(date) {
    return date.getUTCMonth() + 1;
}

function getMonth(date) {
    return date.getMonth() + 1;
}

function translateFilter(item) {
    switch (item.op) {
        case 'eq':
            return {
                [item.field]: item.data
            };
        case 'cn':
            return {
                [item.field]: {
                    $like: '%' + item.data + '%'
                }
            };
        case 'ge':
            return {
                [item.field]: {
                    $gte: item.data
                }
            };
        case "le":
            return {
                [item.field]: {
                    $lte: item.data
                }
            };
        case "ne":
            return {
                [item.field]: {
                    $ne: item.data
                }
            };
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
    'eq': '==',
    'ne': '!',
    'lt': '<',
    'le': '<=',
    'gt': '>',
    'ge': '>=',
    'bw': '^',
    'bn': '!^',
    'in': '=',
    'ni': '!=',
    'ew': '\|',
    'en': '!@',
    'cn': '~',
    'nc': '!~',
    'nu': '#',
    'nn': '!#',
    'bt': '...'
};