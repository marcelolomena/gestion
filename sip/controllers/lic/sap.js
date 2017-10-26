'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.presupuestoenvuelo;

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            sap: item.sap
        };
    });
}


function existeSap(req, res) {
    var sap = parseInt(req.params.sap);
    entity
        .findOne({ where: { sap: sap }})
        .then(function (result) {
            return res.json({ error: 0, nombre: result.nombreproyecto });
        })
        .catch(function (err) {
            return res.json({ error_code: 1 });
        });
}


module.exports = {
    listAll: listAll,
    existeSap: existeSap
};