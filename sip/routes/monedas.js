var monedasController = require('../controllers/monedas');
var monedasConversionController = require('../controllers/monedasconversion');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/monedasconversion', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'monedasconversion', title: 'Monedas' });
    });

    router.route('/monedas/list')
        .get(isAuthenticated, monedasController.list);

    router.route('/monedas/action')
        .post(isAuthenticated, monedasController.action);

    router.route('/monedas/excel')
        .get(isAuthenticated, monedasController.getExcel);

    router.route('/monedasconversion/list/:id')
        .post(isAuthenticated, monedasConversionController.list);

    router.route('/monedasconversion/action')
        .post(isAuthenticated, monedasConversionController.action);

    return router;

}