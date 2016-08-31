// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var userController = require('../controllers/user');
var roldenegocioController = require('../controllers/roldenegocio');

module.exports = function (passport) {
    router.route('/usuarios_por_rol/:rol')
        .get(isAuthenticated, userController.getUsersByRol);

    router.route('/usuarios_por_rol_art/:rol')
        .get(isAuthenticated, userController.getUsersByRolART);

    router.route('/usuariosprograma/:idiniciativaprograma')
        .get(isAuthenticated, userController.getUsersProgramMember);

    router.route('/usuariosporprograma/:program_id')
        .get(isAuthenticated, userController.getUsersByProgram);

    router.get('/roldenegocio', isAuthenticated, function (req, res) {
        res.render('roldenegocio', { user: req.user });
    });

    router.route('/usuariosdelegados/:uid')
        .get(isAuthenticated, userController.getUsersDelegados)


    router.route('/roldenegocio/list')
        .post(isAuthenticated, roldenegocioController.list);

    router.route('/roldenegocio/action')
        .post(isAuthenticated, roldenegocioController.action);

    return router;

}