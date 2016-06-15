var proyectosenvueloController = require('../controllers/proyectosenvuelo');
var detalleenvueloController = require('../controllers/detalleenvuelo');
var flujoenvueloController = require('../controllers/flujoenvuelo');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')

module.exports = function (passport) {

    router.get('/proyectosenvuelo', isAuthenticated, function (req, res) {
        res.render('proyectosenvuelo', { user: req.user });
    });

    router.route('/proyectosenvuelo/list')
        .post(isAuthenticated, proyectosenvueloController.list);

    router.route('/proyectosenvuelo/action')
        .post(isAuthenticated, proyectosenvueloController.action);

    router.route('/flujoenvuelo/:id')
        .post(isAuthenticated, flujoenvueloController.list);

    router.route('/tareasap/:id')
        .get(isAuthenticated, detalleenvueloController.tareasap);

    router.route('/tareaservicio/:id')
        .get(isAuthenticated, detalleenvueloController.tareaservicio);
        
    router.route('/detalleenvuelo/:id')
        .get(isAuthenticated, detalleenvueloController.list);        
        
    router.route('/detalleenvuelo/action')
        .post(isAuthenticated, detalleenvueloController.action);

    return router;

}