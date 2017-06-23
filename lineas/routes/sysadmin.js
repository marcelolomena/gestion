var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var sysadminController = require('../controllers/sysadmin');

module.exports = function (passport) {

    router.route('/sysadmin')
        .post(isAuthenticated, sysadminController.grid);

    router.route('/sysadmin/sistema')
        .post(isAuthenticated, sysadminController.sistema);      

    router.route('/sysadmin/contenido')
        .post(isAuthenticated, sysadminController.contenido);            
    return router;

}