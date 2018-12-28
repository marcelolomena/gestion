var actividadesController = require('../controllers/equipos');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/equipos', isAuthenticated, function (req, res) {
        res.render('equipos', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/equipos/list')
        .get(isAuthenticated, actividadesController.list);

    router.route('/equipos/action')
        .post(isAuthenticated, actividadesController.action);

    router.route('/equipos/excel')
        .get(isAuthenticated, actividadesController.getExcel);

    return router;
    

}