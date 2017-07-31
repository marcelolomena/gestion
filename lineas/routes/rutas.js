var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

var carteraController = require('../controllers/cartera')
var operacionesController = require('../controllers/operaciones')
var grupoController = require('../controllers/grupo')
var macgrupalController = require('../controllers/macgrupal')

module.exports = function (passport) {

    router.route('/grid_cartera')
        .post(isAuthenticated, carteraController.action)
        .get(isAuthenticated, carteraController.list);

    router.route('/limite/:id')
        .get(isAuthenticated, carteraController.listlimite);

    router.route('/sublimite/:id')
        .get(isAuthenticated, carteraController.listsublimite);

    router.route('/garantiareallimite/:id')
        .get(isAuthenticated, carteraController.listgarantiareallimite);

    router.route('/vermac/:id')
        .get(isAuthenticated, carteraController.listlimite);

    router.route('/limite')
        .post(isAuthenticated, carteraController.actionlimite);

    router.route('/garantia/:id')
        .get(isAuthenticated, carteraController.listgarantia);

    router.route('/garantia')
        .post(isAuthenticated, carteraController.actiongarantia);
    /*
        router.route('/grupo')
            .post(isAuthenticated, grupoController.action)
            .get(isAuthenticated, grupoController.list);
    
        router.route('/grupodesglose/:id')
            .get(isAuthenticated, grupoController.listdesglose);
    
        router.route('/grupodesglose')
            .post(isAuthenticated, grupoController.actiondesglose);
    */
    router.route('/getdatoscliente/:rut')
        .get(isAuthenticated, carteraController.getdatoscliente);

    router.route('/getdatosclientecongrupo/:id')
        .get(isAuthenticated, carteraController.getdatosclientecongrupo);

    router.route('/buscargrupo/:rut')
        .get(isAuthenticated, carteraController.getgrupo);

    router.route('/vermacgrupal/:id')
        //.post(isAuthenticated, macgrupalController.action)
        .get(isAuthenticated, macgrupalController.list);

    router.route('/macindividuales/:id')
        //.post(isAuthenticated, macgrupalController.action)
        .get(isAuthenticated, macgrupalController.listindividuales);

    router.route('/macs/:id')
        .get(isAuthenticated, carteraController.listmacs);

    router.route('/limite/:id')
        .get(isAuthenticated, operacionesController.listlimite);

    router.route('/sublimite/:id')
        .get(isAuthenticated, operacionesController.listsublimite);

    router.route('/operaciones/:id')
        .get(isAuthenticated, operacionesController.listoperacion);

    router.route('/grupoempresa/:id')
        .get(isAuthenticated, grupoController.listgrupoempresa);

    router.route('/grupoempresa')
        .post(isAuthenticated, grupoController.actiongrupoempresa)

    router.route('/operacionmac/:id')
        .get(isAuthenticated, operacionesController.listoperacionmac);

    router.route('/creargruponuevo/:id/:nombre')
        .get(isAuthenticated, carteraController.creargruponuevo);

    router.route('/crearmacgrupal/:id')
        .post(isAuthenticated, carteraController.crearmacgrupal);

    router.route('/getdatosmacgrupal/:id')
        .get(isAuthenticated, carteraController.getdatosmacgrupal);

    
    router.route('/verlimite/:id')
        .get(isAuthenticated, operacionesController.listverlmite);

    router.route('/vertablimites/:id')
        .get(isAuthenticated, operacionesController.listtabverlimite);

    router.route('/getmacindividuales/:id')
        .get(isAuthenticated, carteraController.getmacindividuales);

    router.route('/getmacindividual/:id')
        .get(isAuthenticated, carteraController.getmacindividual);

    router.route('/vertabsublimites/:id')
        .get(isAuthenticated, operacionesController.listtabversublimite);

    return router;
}