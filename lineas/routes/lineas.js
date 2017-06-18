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

    router.route('/lineas/:id')
        .get(isAuthenticated, carteraController.listlineas);

    router.route('/lineas')
        .post(isAuthenticated, carteraController.actionlineas);

    router.route('/grupo')
        .post(isAuthenticated, grupoController.action)
        .get(isAuthenticated, grupoController.list);

    router.route('/grupodesglose/:id')
        .get(isAuthenticated, grupoController.listdesglose);

    router.route('/grupodesglose')
        .post(isAuthenticated, grupoController.actiondesglose);

    return router;
}