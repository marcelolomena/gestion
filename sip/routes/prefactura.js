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
        res.render('solicitud', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/solicitud/lista')
        .post(isAuthenticated, prefacturaController.lista);

    router.route('/solicitud/generar')
        .get(isAuthenticated, prefacturaController.generar);

    router.route('/solicitud/anular/:id')
        .get(isAuthenticated, prefacturaController.anular);

    router.get('/prefactura', isAuthenticated, function (req, res) {
        res.render('prefactura', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/prefacturas', isAuthenticated, function (req, res) {
        res.render('prefacturas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/prefacturas/anular/:id')
        .get(isAuthenticated, prefacturasController.anular);

    router.route('/prefacturas/list')
        .post(isAuthenticated, prefacturasController.list);

    router.get('/pert', isAuthenticated, function (req, res) {
        res.render('pert', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/solicitudesporfactura/:id')
        .post(isAuthenticated, prefacturasController.solicitudesporfactura);

    router.route('/generarprefacturas')
        .get(isAuthenticated, prefacturasController.generar);

    router.route('/solicitudesaprobadas')
        .post(isAuthenticated, prefacturasController.solicitudesaprobadas);

    router.get('/genprefacturas', isAuthenticated, function (req, res) {
        res.render('genprefacturas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/desgloseporsolicitud/:id')
        .post(isAuthenticated, prefacturasController.desgloseporsolicitud);

    router.route('/desglosecontable/action')
        .post(isAuthenticated, prefacturasController.actiondesglose);

    router.route('/porcentajedesglose/:parentRowKey')
        .get(isAuthenticated, prefacturasController.porcentajedesglose);

    router.route('/allcuis')
        .get(isAuthenticated, prefacturasController.getallcuis);

    return router;

}