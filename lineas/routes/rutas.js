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

    router.route('/getdatoscliente/:rut') 
        .get(isAuthenticated, carteraController.getdatoscliente);

    router.route('/getdatosclientelimite/:rut') 
        .get(isAuthenticated, operacionesController.getdatosclientelimite);

    router.route('/getmacporrut/:rut')
        .get(isAuthenticated, carteraController.getmacporrut);

    router.route('/limite/:id')
        .get(isAuthenticated, operacionesController.listlimite);

    router.route('/sublimite/:id')
        .get(isAuthenticated, operacionesController.listsublimite);

    router.route('/vermac/:id')
        .get(isAuthenticated, carteraController.listlimite);

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

    router.route('/grupoempresa/:id')
        .get(isAuthenticated, grupoController.listgrupoempresa);

    router.route('/grupoempresa')
        .post(isAuthenticated, grupoController.actiongrupoempresa)

    router.route('/creargruponuevo/:id/:nombre')
        .get(isAuthenticated, carteraController.creargruponuevo);

    router.route('/crearmacgrupal/:id')
        .post(isAuthenticated, carteraController.crearmacgrupal);

    router.route('/getdatosmacgrupal/:id')
        .get(isAuthenticated, carteraController.getdatosmacgrupal);

    router.route('/getmacindividuales/:id')
        .get(isAuthenticated, carteraController.getmacindividuales);

    router.route('/getmacindividual/:id')
        .get(isAuthenticated, carteraController.getmacindividual);


    router.route('/veroperacionesmodal/:id')
        .get(isAuthenticated, operacionesController.listveroperacionlimite);
    
    router.route('/verdetalleslim/:id')
        .get(isAuthenticated, operacionesController.listverdetallelim);
    
    router.route('/veroperacionesmodal2/:id')
        .get(isAuthenticated, operacionesController.listveroperacionsublimite);
    
    router.route('/verdetalleslim2/:id')
        .get(isAuthenticated, operacionesController.listverdetallelim2);

    router.route('/getultimomac/:id')
        .get(isAuthenticated, operacionesController.listultimomac);
   
    router.route('/getsublimitesoperaciones/:id')
        .get(isAuthenticated, operacionesController.listsublimop);

    router.route('/tipooperacion/:id')
        .get(isAuthenticated, operacionesController.listtipooperaciones);

    router.route('/getoperaciones2/:id/:rut')
        .get(isAuthenticated, operacionesController.listoperaciones2);

    router.route('/verproductoslinea/:id')
        .get(isAuthenticated, operacionesController.listproductoslinea);

    router.route('/vercondicioneslinea/:id')
        .get(isAuthenticated, operacionesController.listcondicioneslinea);

    router.route('/vergarantiaslinea/:id')
        .get(isAuthenticated, operacionesController.listgarantiaslinea);

    router.route('/vercomentarioslinea/:id')
        .get(isAuthenticated, operacionesController.listcomentarioslinea);

        
        return router;
}