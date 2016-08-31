// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var reportesController = require('../controllers/reportes');

module.exports = function (passport) {

    router.route('/reporte/test')
        .get(isAuthenticated, reportesController.test);

    router.route('/reporte/troya')
        .get(isAuthenticated, reportesController.troya);                          

    return router;

}