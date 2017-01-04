// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var presupuestoenvueloController = require('../controllers/presupuestoenvuelo');
var tareaenvueloController = require('../controllers/tareaenvuelo');
var fechaenvueloController = require('../controllers/fechaenvuelo');
var conversionenvueloController = require('../controllers/conversionenvuelo');
var flujopagoenvueloController = require('../controllers/flujopagoenvuelo');

module.exports = function (passport) {

    router.get('/presupuestoenvuelo', isAuthenticated, function (req, res) {
        res.render('presupuestoenvuelo', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/inscripcionsap', isAuthenticated, function (req, res) {
        res.render('inscripcionsap', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/presupuestoenvuelo/list')
        .post(isAuthenticated, presupuestoenvueloController.list);

    router.route('/presupuestoenvuelo/action')
        .post(isAuthenticated, presupuestoenvueloController.action);

    router.route('/tareaenvuelo/list/:id')
        .post(isAuthenticated, tareaenvueloController.list);

    router.route('/tareaenvuelo/action')
        .post(isAuthenticated, tareaenvueloController.action)

    router.route('/fechaenvuelo/list/:id')
        .post(isAuthenticated, fechaenvueloController.list);

    router.route('/fechaenvuelo/action')
        .post(isAuthenticated, fechaenvueloController.action)

    router.route('/conversionenvuelo/list/:id')
        .post(isAuthenticated, conversionenvueloController.list);

    router.route('/conversionenvuelo/action')
        .post(isAuthenticated, conversionenvueloController.action)

    router.route('/flujopagoenvuelo/list/:id')
        .post(isAuthenticated, flujopagoenvueloController.list);

    router.route('/flujopagoenvuelo/action')
        .post(isAuthenticated, flujopagoenvueloController.action)

    router.route('/generarproyectoenvuelo/:id')
        .post(isAuthenticated, presupuestoenvueloController.generarproyectoenvuelo)

    router.route('/proyectosportareaenvuelo/:idtareaenvuelo')
        .get(isAuthenticated, flujopagoenvueloController.getProyectosPorTareaEnVuelo);

    router.route('/subtareasportareaenvuelo/:idtareaenvuelo')
        .get(isAuthenticated, flujopagoenvueloController.getsubtareasportareaenvuelo);

    return router;

}
