var plantillaController = require('../controllers/plantilla');
var detalleplantillaController = require('../controllers/detalleplantilla');
var plantillacuiController = require('../controllers/plantillacui');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')


module.exports = function (passport) {

    router.get('/plantilla', isAuthenticated, function (req, res) {
        res.render('plantilla', { user: req.user });
    });

    router.route('/plantilla/list')
        .get(isAuthenticated, plantillaController.list);

    router.route('/plantilla/action')
        .post(isAuthenticated, plantillaController.action);

    router.route('/plantilla/excel')
        .get(isAuthenticated, plantillaController.getExcel);

    router.route('/detalleplantilla/:id')
        .post(isAuthenticated, detalleplantillaController.list);      
        
    router.route('/cuiservicios/:id')
        .get(isAuthenticated, plantillacuiController.getCuiServicios);  
        
    router.route('/cuiproveedores/:id/:idservicio')
        .get(isAuthenticated, plantillacuiController.getCuiProveedores);                
  
    return router;

}