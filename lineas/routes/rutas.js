var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var externoController = require('../controllers/dataexterna')
var operacionesController = require('../controllers/operaciones')
var grupoController = require('../controllers/grupo')
var macgrupalController = require('../controllers/macgrupal')

module.exports = function (passport) {

    router.route('/getdatoscliente/:rut') 
        .get(isAuthenticated, externoController.getdatoscliente);

    router.route('/getmacporrut/:rut')
        .get(isAuthenticated, externoController.getmacporrut);

    router.route('/vermac/:id')
        .get(isAuthenticated, externoController.listlimite);

    router.route('/getdatosclientecongrupo/:id')
        .get(isAuthenticated, externoController.getdatosclientecongrupo);

    router.route('/getdatosclientecongrupo2/:rut')
        .get(isAuthenticated, externoController.getdatosclientecongrupo2);

    router.route('/getdatosclientecongrupo3/:idgrupo/:idempresa')
        .get(isAuthenticated, externoController.getdatosclientecongrupo3);

    router.route('/buscargrupo/:rut')
        .get(isAuthenticated, externoController.getgrupo);

    router.route('/creargruponuevo/:id/:nombre')
        .get(isAuthenticated, externoController.creargruponuevo);

    router.route('/crearmacgrupal/:id')
        .post(isAuthenticated, externoController.crearmacgrupal);

    router.route('/getdatosmacgrupal/:id')
        .get(isAuthenticated, externoController.getdatosmacgrupal);

    router.route('/getmacindividuales/:id')
        .get(isAuthenticated, externoController.getmacindividuales);

    router.route('/getmacindividual/:id')
        .get(isAuthenticated, externoController.getmacindividual);

    router.route('/gettiposaprobacion')
        .get(isAuthenticated, externoController.gettiposaprobacion);
    
    router.route('/getsublimitesasignacion/:id')
        .get(isAuthenticated, externoController.listsublimite);




    router.route('/grupoempresa/:id')
        .get(isAuthenticated, grupoController.listgrupoempresa);

    router.route('/grupoempresa')
        .post(isAuthenticated, grupoController.actiongrupoempresa)

    router.route('/grupoempresanew/:id')
        .get(isAuthenticated, grupoController.listgrupoempresanew);

    router.route('/grupoempresanew')
        .post(isAuthenticated, grupoController.actiongrupoempresanew)




    router.route('/vermacgrupal/:id')
        //.post(isAuthenticated, macgrupalController.action)
        .get(isAuthenticated, macgrupalController.list);

    router.route('/macindividuales/:id')
        //.post(isAuthenticated, macgrupalController.action)
        .get(isAuthenticated, macgrupalController.listindividuales);




    router.route('/getdatosclientelimite/:rut') 
        .get(isAuthenticated, operacionesController.getdatosclientelimite);

    router.route('/limite/:id')
        .get(isAuthenticated, operacionesController.listlimite);

    router.route('/sublimite/:id/:rut')
        .get(isAuthenticated, operacionesController.listsublimite);

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

    router.route('/tipooperacion/:id') //grilla operaciones
        .get(isAuthenticated, operacionesController.listtipooperaciones);

    router.route('/getoperaciones2/:id/:rut') //subgrilla operaciones
        .get(isAuthenticated, operacionesController.listoperaciones2);

    router.route('/verproductoslinea/:id')
        .get(isAuthenticated, operacionesController.listproductoslinea);

    router.route('/vercondicioneslinea/:id')
        .get(isAuthenticated, operacionesController.listcondicioneslinea);

    router.route('/vergarantiaslinea/:id')
        .get(isAuthenticated, operacionesController.listgarantiaslinea);

    router.route('/vercomentarioslinea/:id')
        .get(isAuthenticated, operacionesController.listcomentarioslinea);

    router.route('/cargarbloqueo/:id')
        .post(isAuthenticated, operacionesController.actionbloquear);

    router.route('/asignar/:id')
        .get(isAuthenticated, operacionesController.listasignar);

    router.route('/aprobaciones/:id/:estado')
        .get(isAuthenticated, operacionesController.listaprobaciones);

    router.route('/getoperacionesasignar/:id/:rut')
        .get(isAuthenticated, operacionesController.operacionesasignar);

     router.route('/verdetallebloqueo/:id')
        .get(isAuthenticated, operacionesController.listverdetallebloqueo);

    router.route('/reservar/:id')
        .get(isAuthenticated, operacionesController.listlimite);

    router.route('/reservasublimites/:id/:rut')
        .get(isAuthenticated, operacionesController.listsublimite);


        return router;
}
    