// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturasolicitudController = require('../controllers/prefacturasolicitud');

module.exports = function (passport) {

    router.get('/prefacturasolicitud', isAuthenticated, function (req, res) {
        res.render('prefacturasolicitud', { user: req.user });
    });
    
    router.route('/prefacturasolicitud/:cui/:periodo')
        .get(isAuthenticated, prefacturasolicitudController.getSolicitudAprob);
                
    return router;

}