var dashboardController = require('../controllers/dashboard')
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')

module.exports = function (passport) {

    router.route('/dashboard/:id')
        .get(isAuthenticated, dashboardController.presupuesto);

    return router;

}