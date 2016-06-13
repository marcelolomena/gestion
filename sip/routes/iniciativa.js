// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var iniciativaController = require('../controllers/iniciativa');
var iniciativaprogramaController = require('../controllers/iniciativaprograma');
var iniciativafechaController = require('../controllers/iniciativafecha');

module.exports = function (passport) {

    router.get('/iniciativas', isAuthenticated, function (req, res) {
        res.render('iniciativas', { user: req.user });
    });

    router.route('/iniciativas/list')
        .post(isAuthenticated, iniciativaController.list);

    router.route('/iniciativas/:id')
        .get(isAuthenticated, iniciativaController.get)

    router.route('/iniciativas/action')
        .post(isAuthenticated, iniciativaController.action);

    router.route('/iniciativasexcel')
        .get(isAuthenticated, iniciativaController.getExcel);

    router.route('/iniciativasprograma/codigoart/:id')
        .get(isAuthenticated, iniciativaprogramaController.codigoart);

    router.route('/iniciativaprograma/action')
        .post(isAuthenticated, iniciativaprogramaController.action);

    router.route('/iniciativaprograma/:id')
        .post(isAuthenticated, iniciativaprogramaController.list);

    router.route('/iniciativafecha/action')
        .post(isAuthenticated, iniciativafechaController.action);

    router.route('/iniciativafecha/:id')
        .post(isAuthenticated, iniciativafechaController.list);

    router.route('/divisiones')
        .get(isAuthenticated, iniciativaController.getDivisiones);

    router.route('/personal')
        .get(isAuthenticated, iniciativaController.getPersonal);

    router.route('/actualizaduracion/:id')
        .get(isAuthenticated, iniciativafechaController.actualizaDuracion);

    router.route('/usuarios_por_rol/:rol')
        .get(isAuthenticated, iniciativaController.getUsersByRol);
        
    return router;

}