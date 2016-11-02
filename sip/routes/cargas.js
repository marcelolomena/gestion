var cargasController = require('../controllers/cargas');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/cargas', isAuthenticated, function (req, res) {
        res.render('cargas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/cargas/list')
        .get(isAuthenticated, cargasController.list);

    router.route('/cargas/guardar')
        .post(isAuthenticated, cargasController.guardar);

    router.route('/cargas/archivo')
        .post(isAuthenticated, cargasController.archivo);

    router.route('/detallecarga/:id')
        .get(isAuthenticated, cargasController.detallecarga);

    return router;

}