'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.traduccion;

var includes = [];

function map(req) {
    return {
        id: req.body.id || 0,
        idProducto: req.body.idProducto || req.params.pId,
        nombre: req.body.nombre,
        tipo: req.body.tipo
    }
}
function mapper(data) {
   var result =  _.map(data,function(item){
        item.dataValues.tipos = {nombre: item.tipo===1?'Versión':'Suite'};
        return item;
   });
   return result;
}

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}
function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idProducto', includes, mapper);
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
    listChilds: listChilds,
    action: action
};