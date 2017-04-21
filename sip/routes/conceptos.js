var conceptoController = require('../controllers/concepto');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/conceptos', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'conceptos', title: 'Conceptos Presupuestarios' });
    });

    router.route('/conceptos/list')
        .get(isAuthenticated, conceptoController.list);

    router.route('/conceptos/action')
        .post(isAuthenticated, conceptoController.action);

    router.route('/conceptos/excel')
        .get(isAuthenticated, conceptoController.getExcel);

    return router;

}