var estructuracuiController = require('../controllers/estructuracui');
var estructuracentroController = require('../controllers/estructuracentro');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/estructuracui', isAuthenticated, function (req, res) {
        res.render('estructuracui', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/estructuracui/responsables')
        .get(isAuthenticated, estructuracuiController.responsables);

    router.route('/estructuracui/gerencias')
        .get(isAuthenticated, estructuracuiController.gerencias);

    router.route('/estructuracui/cabecera/:id')
        .get(isAuthenticated, estructuracuiController.cabecera);

    router.route('/estructuracui/hijos/:id/:idpadre')
        .get(isAuthenticated, estructuracuiController.getEstructuraCui);

    router.route('/estructuracui/action')
        .post(isAuthenticated, estructuracuiController.action);

    router.route('/estructuracui/excel')
        .get(isAuthenticated, estructuracuiController.getExcel);

    router.route('/estructuracentro/cabeceracentro')
        .get(isAuthenticated, estructuracentroController.cabeceracentro)

    router.route('/estructuracentro/action')
        .post(isAuthenticated, estructuracentroController.action);

    return router;

}