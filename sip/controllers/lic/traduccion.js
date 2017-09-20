'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.traduccion;
function map(req) {
    return {
        id: req.body.id || 0,
        idLicencia: req.body.idLicencia,
        nombre: req.body.nombre,
        tipo: req.body.tipo
    }
}

function list(req, res) {
    base.list(req, res, entity, [], function (data) {
        return data;
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