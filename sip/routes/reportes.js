// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var reportesController = require('../controllers/reportes');

module.exports = function (passport) {

    router.get('/reporte', isAuthenticated, function (req, res) {
        res.render('reporte', { user: req.user });
    });

    router.get('/reportetroya', isAuthenticated, function (req, res) {
        res.render('reportetroya', { user: req.user });
    });

    router.get('/reportepivote', isAuthenticated, function (req, res) {
        res.render('reportepivote', { user: req.user });
    });    

    router.route('/reporte/lstGerencias')
        .get(isAuthenticated, reportesController.lstGerencias);

    router.route('/reporte/lstGerenciasTroya')
        .get(isAuthenticated, reportesController.lstGerenciasTroya);    

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

    router.route('/reporte/lstServiceFromConcept/:nombre/:id')
        .get(isAuthenticated, reportesController.lstServiceFromConcept);             

    router.route('/reporte/repo1')
        .get(isAuthenticated, reportesController.reporteGerenciasPdf);     

    router.route('/reporte/lstDepartamentosTroya/:id')
        .get(isAuthenticated, reportesController.lstDepartamentosTroya);   

    router.route('/reporte/testtroya')
        .post(isAuthenticated, reportesController.testtroya);   

    router.route('/reporte/integrado')
        .get(isAuthenticated, reportesController.reporteIntegrado);                                   

    return router;

}