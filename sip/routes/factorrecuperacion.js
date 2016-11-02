var recuperacionController = require('../controllers/factorrecuperacion');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/factorrecuperacion', isAuthenticated, function (req, res) {
        res.render('factorrecuperacion', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/factorrecuperacion/list')
        .get(isAuthenticated, recuperacionController.list);

    router.route('/factorrecuperacion/action')
        .post(isAuthenticated, recuperacionController.action);

    router.route('/factorrecuperacion/excel')
        .get(isAuthenticated, recuperacionController.getExcel);

    return router;

}