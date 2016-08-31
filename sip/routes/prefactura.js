// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturaController = require('../controllers/prefactura');

module.exports = function (passport) {

    router.get('/factura', isAuthenticated, function (req, res) {
        res.render('factura', { user: req.user });
    });

    router.route('/factura/prefactura')
        .post(isAuthenticated, prefacturaController.generar);

    return router;

}