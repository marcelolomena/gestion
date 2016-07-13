// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var userController = require('../controllers/user');

module.exports = function (passport) {
    router.route('/usuarios_por_rol/:rol')
        .get(isAuthenticated, userController.getUsersByRol);

    router.route('/usuarios_por_rol_art/:rol')
        .get(isAuthenticated, userController.getUsersByRolART);

    router.route('/usuariosprograma/:idiniciativaprograma')
        .get(isAuthenticated, userController.getUsersProgramMember);

    return router;

}