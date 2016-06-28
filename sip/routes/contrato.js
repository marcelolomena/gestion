// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var contratoservicioController = require('../controllers/contratoservicio');
var contratoController = require('../controllers/contrato');

module.exports = function (passport) {

    router.get('/contratos', isAuthenticated, function (req, res) {
        res.render('contratos', { user: req.user });
    });

    router.route('/contratos/list')
        .post(isAuthenticated, contratoController.list)
        .get(isAuthenticated, contratoController.listall);
 
    router.route('/contratos/action')
        .post(isAuthenticated, contratoController.action);

    router.route('/contratos/excel')
        .get(isAuthenticated, contratoController.excel);

    router.route('/sap')
        .get(isAuthenticated, contratoservicioController.sap);

    router.route('/tarea/:id')
        .get(isAuthenticated, contratoservicioController.tarea);

    router.route('/contratoservicio/:id')
        .post(isAuthenticated, contratoservicioController.list);

    router.route('/contratoservicio/action/:id')
        .post(isAuthenticated, contratoservicioController.action);

    router.route('/contratoproyecto/action/:id')
        .post(isAuthenticated, contratoservicioController.oper);

    return router;

}