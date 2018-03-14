var cuentasController = require('../controllers/cuentascontables');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/cuentascontables', isAuthenticated, function (req, res) {
        res.render('cuentascontables', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/cuentascontables/list')
        .get(isAuthenticated, cuentasController.list);

    router.route('/cuentascontables/action')
        .post(isAuthenticated, cuentasController.action);

    router.route('/cuentascontables/excel')
        .get(isAuthenticated, cuentasController.getExcel);

    router.route('/cuentascontables/conceptospresupuestarios')
        .get(isAuthenticated, cuentasController.getConceptos);

    return router;

}