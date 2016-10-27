var cargasController = require('../controllers/cargas');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/cargas', isAuthenticated, function (req, res) {
        res.render('cargas', { user: req.user });
    });

    router.route('/cargas/list')
        .get(isAuthenticated, cargasController.list);

    router.route('/detallecarga/:id')
        .get(isAuthenticated, cargasController.detallecarga);             
  
    return router;

}