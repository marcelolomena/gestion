'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.estructuracuibch;

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.cui,
            nombre: item.cui + ' - ' + item.unidad
        };
    });
}


module.exports = {
    listAll: listAll
};