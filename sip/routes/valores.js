var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var valoresController = require('../controllers/sic/valores');


module.exports = function(passport) {
    router.get('/sic/valores', isAuthenticated, function(req, res) {
        res.render('sic/valores', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/valores/list')
        .post(isAuthenticated, valoresController.list);

    router.route('/sic/valores/action')
        .post(isAuthenticated, valoresController.action);

    router.route('/sic/valores/tipos')
        .get(isAuthenticated, valoresController.getTipos);

    return router;
}