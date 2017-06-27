var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

var carteraController = require('../controllers/cartera')
var grupoController = require('../controllers/grupo')

module.exports = function (passport) {

    router.route('/grid_cartera')
        .post(isAuthenticated, carteraController.action)
        .get(isAuthenticated, carteraController.list);

    router.route('/limite/:id')
        .get(isAuthenticated, carteraController.listlimite);

    router.route('/limite')
        .post(isAuthenticated, carteraController.actionlimite);

    router.route('/garantia/:id')
        .get(isAuthenticated, carteraController.listgarantia);

    router.route('/garantia')
        .post(isAuthenticated, carteraController.actiongarantia);

    router.route('/grupo')
        .post(isAuthenticated, grupoController.action)
        .get(isAuthenticated, grupoController.list);

    router.route('/grupodesglose/:id')
        .get(isAuthenticated, grupoController.listdesglose);

    router.route('/grupodesglose')
        .post(isAuthenticated, grupoController.actiondesglose);

    router.route('/getdatoscliente/:rut')
        .get(isAuthenticated, carteraController.getdatoscliente);

    router.route('/buscargrupo/:rut')
        .get(isAuthenticated, grupoController.getgrupo);

    return router;
}