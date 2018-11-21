'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require("../../utils/logger");

var entity = models.parametro;

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.nombre
        };
    });
}

function getParametroUbicacion(req, res) {
    models.parametro.findAll({
        where: {
            tipo: 'ubicacion'
        }
    }).then(function (ubica) {
        return res.json(ubica);
    }).catch(function (err) {
        logger.error(err);
        res.json({
            error: 1
        });
    });
}

module.exports = {
    listAll: listAll,
    getParametroUbicacion: getParametroUbicacion
};