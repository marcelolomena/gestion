var cargadteController = require('../controllers/cargadte');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/cargadte', isAuthenticated, function (req, res) {
        res.render('cargadte', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/cargadte/list')
        .get(isAuthenticated, cargadteController.list);

    router.route('/cargadte/guardar')
        .post(isAuthenticated, cargadteController.guardar);

    router.route('/cargadte/archivo')
        .post(isAuthenticated, cargadteController.archivo);

    return router;

}