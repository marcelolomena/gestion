var actividadesController = require('../controllers/actividades');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/actividades', isAuthenticated, function (req, res) {
        res.render('actividades', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/actividades/list')
        .get(isAuthenticated, actividadesController.list);

    router.route('/actividades/action')
        .post(isAuthenticated, actividadesController.action);

    router.route('/actividades/excel')
        .get(isAuthenticated, actividadesController.getExcel);

    return router;
    

}