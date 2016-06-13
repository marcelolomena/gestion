var plantillaController = require('../controllers/plantilla');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/plantilla', isAuthenticated, function (req, res) {
        res.render('plantilla', { user: req.user });
    });

    router.route('/plantilla/list')
        .post(isAuthenticated, plantillaController.list);

    router.route('/plantilla/action')
        .post(isAuthenticated, plantillaController.action);

    router.route('/plantilla/excel')
        .get(isAuthenticated, plantillaController.getExcel);
  
    return router;

}