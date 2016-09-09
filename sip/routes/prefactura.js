// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturaController = require('../controllers/prefactura');

module.exports = function (passport) {

    router.get('/factura', isAuthenticated, function (req, res) {
        res.render('factura', { user: req.user });
    });

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

    router.route('/factura/prefactura')
        .post(isAuthenticated, prefacturaController.test);

    return router;

}