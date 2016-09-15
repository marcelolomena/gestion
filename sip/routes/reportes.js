// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var reportesController = require('../controllers/reportes');

module.exports = function (passport) {

    router.get('/reporte', isAuthenticated, function (req, res) {
        res.render('reporte', { user: req.user });
    });

    router.route('/reporte/lstGerencias')
        .get(isAuthenticated, reportesController.lstGerencias);    

    router.route('/reporte/lstDepartamentos/:id')
        .get(isAuthenticated, reportesController.lstDepartamentos);       

    router.route('/reporte/lstServices/:id')
        .get(isAuthenticated, reportesController.lstServices); 

    router.route('/reporte/lstConceptoGasto')
        .get(isAuthenticated, reportesController.lstConceptoGasto);             

    router.route('/reporte/names')
        .get(isAuthenticated, reportesController.lstNames);       

    router.route('/reporte/gerencias')
        .get(isAuthenticated, reportesController.pdfManager);     

    router.route('/reporte/repo1')
        .get(isAuthenticated, reportesController.reporteGerenciasPdf);                

    return router;

}