var proveedorController = require('../controllers/proveedor');
var contactoController = require('../controllers/contacto')
var iniciativaController = require('../controllers/iniciativa');
var parametroController = require('../controllers/parametro');
var proyectoController = require('../controllers/proyecto');
var proyectoTareasController = require('../controllers/proyectotareas');
var erogacionesController = require('../controllers/erogaciones');
var programaController = require('../controllers/programa');
var iniciativaprogramaController = require('../controllers/iniciativaprograma');
var iniciativafechaController = require('../controllers/iniciativafecha');
var paramController = require('../controllers/param');
var presupuestoController = require('../controllers/presupuesto');
var presupuestoServiciosController = require('../controllers/presupuestoservicio');
var presupuestoperiodosController = require('../controllers/presupuestoperiodos');
var cuiController = require('../controllers/estructuracui');
var cuentaController = require('../controllers/cuenta');
var servicioController = require('../controllers/servicio');
var monedaController = require('../controllers/moneda');
var compromisoController = require('../controllers/detallecompromiso');
var graficoController = require('../controllers/graficotest');
var testController = require('../controllers/test')
var express=require('express')
var router=express.Router()
var isAuthenticated=require('../policies/isAuthenticated')    

module.exports = function (passport) {

    router.get('/proveedores', isAuthenticated, function (req, res) {
        res.render('proveedores', { user: req.user });
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

    router.get('/iniciativas', isAuthenticated, function (req, res) {
        res.render('iniciativas', { user: req.user });
    });

    router.get('/parametros', isAuthenticated, function (req, res) {
        res.render('parametros', { user: req.user });
    });
    router.route('/parametros/list')
        .post(isAuthenticated, parametroController.list);

    router.route('/parametros/list')
        .post(isAuthenticated, parametroController.list);

    router.route('/parametros/action')
        .post(isAuthenticated, parametroController.action);

    router.route('/iniciativas/list')
        .post(isAuthenticated, iniciativaController.list);

    router.route('/iniciativas/:id')
        .get(isAuthenticated, iniciativaController.get)

    router.route('/iniciativas/action')
        .post(isAuthenticated, iniciativaController.action);

    router.route('/parameters/:param')
        .get(isAuthenticated, paramController.getListParam);

    router.get('/proyectos', isAuthenticated, function (req, res) {
        res.render('proyectos', { user: req.user });
    });

    router.route('/proyectoslist')
        .get(isAuthenticated, proyectoController.getProyectosPaginados);

    router.route('/proyectostareas/:id')
        .get(isAuthenticated, proyectoTareasController.getProyectosTareas);

    router.route('/proyectostareasexcel/:id')
        .get(isAuthenticated, proyectoTareasController.getExcel);

    router.route('/proyectosexcel')
        .get(isAuthenticated, proyectoController.getExcel);

    router.route('/personal')
        .get(isAuthenticated, iniciativaController.getPersonal);

    router.route('/iniciativasexcel')
        .get(isAuthenticated, iniciativaController.getExcel);

    router.route('/iniciativasprograma/codigoart/:id')
        .get(isAuthenticated, iniciativaprogramaController.codigoart);

    router.route('/iniciativaprograma/action')
        .post(isAuthenticated, iniciativaprogramaController.action);

    router.route('/iniciativaprograma/:id')
        .post(isAuthenticated, iniciativaprogramaController.list);

    router.route('/iniciativafecha/action')
        .post(isAuthenticated, iniciativafechaController.action);

    router.route('/iniciativafecha/:id')
        .post(isAuthenticated, iniciativafechaController.list);

    router.route('/actualizaduracion/:id')
        .get(isAuthenticated, iniciativafechaController.actualizaDuracion);

    router.route('/usuarios_por_rol/:rol')
        .get(isAuthenticated, iniciativaController.getUsersByRol);

    router.route('/programa/:id')
        .get(isAuthenticated, programaController.getPrograma);

    router.route('/programas/:id')
        .get(isAuthenticated, programaController.getProgramasId);

    router.route('/programas')
        .get(isAuthenticated, programaController.getProgramas);

    router.route('/tipos')
        .get(isAuthenticated, parametroController.getTipos);

    router.route('/divisiones')
        .get(isAuthenticated, iniciativaController.getDivisiones);

    router.get('/erogaciones', isAuthenticated, function (req, res) {
        res.render('erogaciones');
    });

    router.route('/erogacioneslist/:id')
        .get(isAuthenticated, erogacionesController.getErogacionesPaginados);

    router.route('/erogacionesexcel/:id')
        .get(isAuthenticated, erogacionesController.getExcel);

    router.get('/presupuestocontinuidad', isAuthenticated, function (req, res) {
        res.render('presupuesto', { user: req.user });
    });

    router.route('/presupuestolist')
        .get(isAuthenticated, presupuestoController.getPresupuestoPaginados);

    router.route('/presupuestosexcel')
        .get(isAuthenticated, presupuestoController.getExcel);

    router.route('/CUIs')
        .get(isAuthenticated, presupuestoController.getCUIs);

    router.route('/presupuesto/action')
        .post(isAuthenticated, presupuestoController.action);

    router.route('/ejercicios')
        .get(isAuthenticated, presupuestoController.getEjercicios);

    router.route('/presupuestoservicios/:id')
        .get(isAuthenticated, presupuestoServiciosController.getPresupuestoServicios);

    router.route('/presupuestoserviciosexcel/:id')
        .get(isAuthenticated, presupuestoServiciosController.getExcel);

    router.route('/presupuestoservicios/action/:id')
        .post(isAuthenticated, presupuestoServiciosController.action);

    router.route('/monedas')
        .get(isAuthenticated, presupuestoServiciosController.getMonedas);

    router.route('/serviciospre/:id')
        .get(isAuthenticated, presupuestoServiciosController.getServicios);

    router.route('/proveedorespre/:id')
        .get(isAuthenticated, presupuestoServiciosController.getProveedores);

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

    router.route('/presupuestoperiodoslist/:id')
        .get(isAuthenticated, presupuestoperiodosController.getPresupuestoPeriodos);

    router.route('/presupuestoperiodos/action')
        .post(isAuthenticated, presupuestoperiodosController.action);

    router.get('/serviciosext', isAuthenticated, function (req, res) {
        res.render('servicios', { user: req.user });
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
        res.render('grafico', { user: req.user });
    });

    router.route('/graficodatareal/:idsap')
        .get(isAuthenticated, graficoController.graficoDataReal);

    router.route('/graficodatapres/:idsap')
        .get(isAuthenticated, graficoController.graficoDataPres);

    router.route('/sapgrafico')
        .get(isAuthenticated, graficoController.sapgrafico);

    return router;

}