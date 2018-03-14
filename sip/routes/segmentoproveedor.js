var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var segmentoController = require('../controllers/sic/segmentoproveedor');


module.exports = function(passport) {
    router.get('/sic/segmentoproveedor', isAuthenticated, function(req, res) {
        res.render('sic/segmentoproveedor', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/segmentoproveedor/list')
        .get(isAuthenticated, segmentoController.list);

    router.route('/sic/segmentoproveedor/action')
        .post(isAuthenticated, segmentoController.action);

    router.route('/sic/segmentoproveedor/excel')
        .get(isAuthenticated, segmentoController.getExcel);

    return router;
}