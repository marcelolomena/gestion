var recuperacionController = require('../controllers/factorrecuperacion');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/factorrecuperacion', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'factorrecuperacion', title: 'Factor de Recuperación' });
    });

    router.route('/factorrecuperacion/list')
        .get(isAuthenticated, recuperacionController.list);

    router.route('/factorrecuperacion/action')
        .post(isAuthenticated, recuperacionController.action);

    router.route('/factorrecuperacion/excel')
        .get(isAuthenticated, recuperacionController.getExcel);

    return router;

}