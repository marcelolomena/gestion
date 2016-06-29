var estructuracuiController = require('../controllers/estructuracui');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/estructuracui', isAuthenticated, function (req, res) {
        res.render('estructuracui', { user: req.user });
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
  
    return router;

}