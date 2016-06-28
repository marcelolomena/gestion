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

    router.route('/estructuracui/cabecera/:id')
        .get(isAuthenticated, estructuracuiController.cabecera);                             
  
    return router;

}