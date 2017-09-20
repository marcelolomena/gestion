'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.tipoLicenciamiento;

function listAll(req, res) {
    base.findAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.nombre
        };
    });
}


module.exports = {
    listAll: listAll
};