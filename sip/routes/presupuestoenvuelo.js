// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var presupuestoenvueloController = require('../controllers/presupuestoenvuelo');
var tareaenvueloController = require('../controllers/tareaenvuelo');
var fechaenvueloController = require('../controllers/fechaenvuelo');
var flujopagoenvueloController = require('../controllers/flujopagoenvuelo');

module.exports = function (passport) {

    router.get('/presupuestoenvuelo', isAuthenticated, function (req, res) {
        res.render('presupuestoenvuelo', { user: req.user });
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

    router.route('/flujopagoenvuelo/list/:id')
        .post(isAuthenticated, flujopagoenvueloController.list);

    router.route('/flujopagoenvuelo/action')
        .post(isAuthenticated, flujopagoenvueloController.action)

    router.route('/generarproyectoenvuelo/:id')
        .post(isAuthenticated, presupuestoenvueloController.generarproyectoenvuelo)

    return router;

}
