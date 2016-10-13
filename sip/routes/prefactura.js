// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturaController = require('../controllers/prefactura');
var prefacturasController = require('../controllers/prefacturas');

module.exports = function (passport) {

    ////Test Pdf Phantom
    router.get('/factura', isAuthenticated, function (req, res) {
        res.render('factura', { user: req.user });
    });

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

    return router;

}