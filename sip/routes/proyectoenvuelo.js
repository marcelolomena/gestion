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

    router.route('/detalleenvuelo/:id')
        .post(isAuthenticated, detalleenvueloController.list);

    router.route('/flujoenvuelo/:id')
        .post(isAuthenticated, flujoenvueloController.list);
        
    router.route('/tareasap/:id')
        .get(isAuthenticated, detalleenvueloController.tareasap);        

    return router;

}