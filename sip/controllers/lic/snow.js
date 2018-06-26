'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var _ = require('lodash');
var pug = require('pug');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var logger = require('../../utils/logger');

var entity = models.snow$;

var includes = [];

function map(req) {
    return {
        id: req.query.id || 0,
        aplicacion: req.quey.aplicacion,
        fabricante: req.quey.fabricante,
        categoria: req.query.categoria,
        licencia: req.query.licencia,
        paquete : req.query.paquete,
        formulariolicencia : req.query.formlicencia
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return item;
    });
}

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

module.exports = {
    list:list
}