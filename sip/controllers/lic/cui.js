'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.estructuracui;

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.cui + ' - ' + item.nombre
        };
    });
}


module.exports = {
    listAll: listAll
};