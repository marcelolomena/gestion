var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var plantillaController = require('../controllers/plantilla');

module.exports = function (passport) {

    router.get('/plantillapresupuestaria', isAuthenticated, function (req, res) {
        res.render('plantilla', { user: req.user });
    });

    router.route('/plantilla/list')
        .post(isAuthenticated, plantillaController.list);

    router.route('/plantilla/action')
        .post(isAuthenticated, plantillaController.action);

    router.route('/plantilla/cuentas')
        .get(isAuthenticated, plantillaController.cuentas);

    router.route('/plantilla/excel')
        .get(isAuthenticated, plantillaController.getExcel);
  
    router.route('/plantilla/action/:id')
        .post(isAuthenticated, plantillaController.oper);

    return router;

}