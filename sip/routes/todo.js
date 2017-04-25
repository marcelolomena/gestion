var proveedorController = require('../controllers/proveedor');
var contactoController = require('../controllers/contacto')
var parametroController = require('../controllers/parametro');
var proyectoController = require('../controllers/proyecto');
var proyectoTareasController = require('../controllers/proyectotareas');
var erogacionesController = require('../controllers/erogaciones');
var programaController = require('../controllers/programa');
var paramController = require('../controllers/param');
var cuiController = require('../controllers/estructuracui');
var cuentaController = require('../controllers/cuenta');
var servicioController = require('../controllers/servicio');
var monedaController = require('../controllers/moneda');
var compromisoController = require('../controllers/detallecompromiso');
var graficoController = require('../controllers/graficotest');
var testController = require('../controllers/test')
var rolesController = require('../controllers/roles')
var permisosController = require('../controllers/permisos')
var registroController = require('../controllers/registro')
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var testxmlController = require('../controllers/testxml')

module.exports = function (passport) {

    router.get('/proveedores', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'proveedores', title: 'Proveedores' });
    });

    router.route('/proveedores/combobox')
        .get(isAuthenticated, proveedorController.combobox);

    router.route('/proveedores/list')
        .post(isAuthenticated, proveedorController.list);

    router.route('/proveedores/action')
        .post(isAuthenticated, proveedorController.action);

    router.route('/proveedoresexcel')
        .get(isAuthenticated, proveedorController.getExcel);

    router.route('/contactos/list/:id')
        .get(isAuthenticated, contactoController.list);

    router.route('/contactos/action')
        .post(isAuthenticated, contactoController.action);

    router.get('/parametros', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'parametros', title: 'PARAMETROS' });
    });

    router.get('/roles', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'roles', title: 'ROLES' });
    });

    router.route('/roles/list')
        .post(isAuthenticated, rolesController.list);

    router.route('/roles/list2/:id')
        .post(isAuthenticated, rolesController.list2);

    router.route('/roles/action')
        .post(isAuthenticated, rolesController.action);

    router.get('/permisos', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'permisos', title: 'ROLES' });        
    });

    router.route('/permisos/list')
        .post(isAuthenticated, permisosController.list);

    router.route('/permisos/list2/:id')
        .post(isAuthenticated, permisosController.list2);

    router.route('/permisos/list3/:rid/:mid')
        .post(isAuthenticated, permisosController.list3);

    router.route('/permisos/action')
        .post(isAuthenticated, permisosController.action);

    router.route('/permisos/action2')
        .post(isAuthenticated, permisosController.action2);

    router.route('/getroles')
        .get(isAuthenticated, rolesController.getRoles);

    router.route('/getmenus')
        .get(isAuthenticated, permisosController.getMenus);

    router.route('/getsubmenus')
        .get(isAuthenticated, permisosController.getSubMenus);

    router.route('/parametros/list')
        .post(isAuthenticated, parametroController.list);

    router.route('/parametros/list')
        .post(isAuthenticated, parametroController.list);

    router.route('/parametros/action')
        .post(isAuthenticated, parametroController.action);

    router.route('/parameters/:param')
        .get(isAuthenticated, paramController.getListParam);

    router.get('/proyectos', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'proyectos', title: 'Informe de Saldos de Proyectos DIVOT' });        
    });

    router.route('/proyectoslist')
        .get(isAuthenticated, proyectoController.getProyectosPaginados);

    router.route('/lastdateload/:id')
        .get(isAuthenticated, proyectoController.lastdateLoad);        

    router.route('/proyectostareas/:id')
        .get(isAuthenticated, proyectoTareasController.getProyectosTareas);

    router.route('/proyectostareasexcel/:id')
        .get(isAuthenticated, proyectoTareasController.getExcel);

    router.route('/proyectosexcel')
        .get(isAuthenticated, proyectoController.getExcel);

    router.route('/programa/:id')
        .get(isAuthenticated, programaController.getPrograma);

    router.route('/programas/:id')
        .get(isAuthenticated, programaController.getProgramasId);

    router.route('/programas')
        .get(isAuthenticated, programaController.getProgramas);

    router.route('/tipos')
        .get(isAuthenticated, parametroController.getTipos);

    router.route('/erogacioneslist/:id')
        .get(isAuthenticated, erogacionesController.getErogacionesPaginados);

    router.route('/erogacionesexcel/:id')
        .get(isAuthenticated, erogacionesController.getExcel);

    router.route('/servicios')
        .get(isAuthenticated, servicioController.getServicios);

    router.route('/cui')
        .get(isAuthenticated, cuiController.getEstructuraCui);

    router.route('/cuentas')
        .get(isAuthenticated, cuentaController.getCuentas);

    router.route('/compromisos/:id')
        .post(isAuthenticated, compromisoController.list);

    router.route('/compromisos/:idd/action')
        .post(isAuthenticated, compromisoController.action);

    router.route('/monedas')
        .get(isAuthenticated, monedaController.getMonedas);

    router.route('/contactos/:id')
        .get(isAuthenticated, contactoController.getContactos);

    router.get('/serviciosext', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'serviciosext', title: 'SERVICIOS' });        
    });

    router.route('/serviciosext/list')
        .post(isAuthenticated, servicioController.list);

    router.route('/serviciosext/action')
        .post(isAuthenticated, servicioController.action);

    router.route('/serviciosext/cuentas')
        .get(isAuthenticated, servicioController.cuentas);

    router.route('/serviciosext/excel')
        .get(isAuthenticated, servicioController.getExcel);

    router.route('/test')
        .get(isAuthenticated, testController.test);

    router.get('/graficotest', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'grafico', title: 'SAP ACTIVAS' });
    });

    router.route('/graficodatareal/:idsap')
        .get(isAuthenticated, graficoController.graficoDataReal);

    router.route('/graficodatapres/:idsap')
        .get(isAuthenticated, graficoController.graficoDataPres);

    router.route('/sapgrafico')
        .get(isAuthenticated, graficoController.sapgrafico);

    router.get('/registro', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'registro', title: 'REGISTRO' });        
    });

    router.route('/registro/list')
        .post(isAuthenticated, registroController.list);

    router.get('/resetpwd', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'resetpwd', title: 'Cambio de Password' });                
    });

    router.route('/testxml')
        .get(isAuthenticated, testxmlController.xmltest);

    return router;

}