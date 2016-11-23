var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var criticidadController = require('../controllers/sic/clasecriticidad');


module.exports = function(passport) {
    router.get('/sic/clasecriticidad', isAuthenticated, function(req, res) {
        res.render('sic/clasecriticidad', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/clasecriticidad/list')
        .get(isAuthenticated, criticidadController.list);

    router.route('/sic/clasecriticidad/action')
        .post(isAuthenticated, criticidadController.action);

    router.route('/sic/desglosefactores/:id')
        .post(isAuthenticated, criticidadController.desglosefactores);

    router.route('/sic/actiondesglosefactores/action')
        .post(isAuthenticated, criticidadController.actiondesglosefactores);
    
    router.route('/sic/porcentajedesglosefactores/:parentRowKey')
        .get(isAuthenticated, criticidadController.porcentajedesglosefactores);

    router.route('/sic/desglosenotas/:id')
        .post(isAuthenticated, criticidadController.desglosenotas);

    router.route('/sic/actiondesglosenotas/action')
        .post(isAuthenticated, criticidadController.actiondesglosenotas);

    return router;
}