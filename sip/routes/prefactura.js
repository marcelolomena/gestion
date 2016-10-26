// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturaController = require('../controllers/prefactura');
var prefacturasController = require('../controllers/prefacturas');

module.exports = function (passport) {

    router.route('/factura/prefactura/:id')
        .get(isAuthenticated, prefacturaController.test);

    router.get('/solicitud', isAuthenticated, function (req, res) {
        res.render('solicitud', { user: req.user });
    });

    router.route('/solicitud/lista')
        .post(isAuthenticated, prefacturaController.lista);    

    router.route('/solicitud/generar')
        .get(isAuthenticated, prefacturaController.generar);      

    router.get('/prefactura', isAuthenticated, function (req, res) {
        res.render('prefactura', { user: req.user });
    });  

    router.get('/prefacturas', isAuthenticated, function (req, res) {
        res.render('prefacturas', { user: req.user });
    });  

    router.route('/prefacturas/list')
        .post(isAuthenticated, prefacturasController.list); 

    router.get('/pert', isAuthenticated, function (req, res) {
        res.render('pert', { user: req.user });
    });

    router.route('/solicitudesporfactura/:id')
        .post(isAuthenticated, prefacturasController.solicitudesporfactura); 

    router.route('/generarprefacturas')
        .get(isAuthenticated, prefacturasController.generar); 

    router.route('/solicitudesaprobadas')
        .post(isAuthenticated, prefacturasController.solicitudesaprobadas); 

    router.get('/genprefacturas', isAuthenticated, function (req, res) {
        res.render('genprefacturas', { user: req.user });
    });

    return router;

}