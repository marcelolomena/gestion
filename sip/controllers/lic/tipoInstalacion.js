'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.tipoInstalacion;
var includes = [];
function map(req) {
    return {
        id: req.body.id || 0,
        nombre: req.body.nombre,
        borrado:  req.body.borrado || 1
    }
}
function mapper(data) {
    return data;
}

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}
function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.nombre
        };
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
    action: action,
    listAll: listAll
};