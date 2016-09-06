// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var reportesController = require('../controllers/reportes');

module.exports = function (passport) {

    router.route('/reporte/gerencias')
        .get(isAuthenticated, reportesController.gerencias);           

    return router;

}