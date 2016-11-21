// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var iniciativaController = require('../controllers/iniciativa');
var iniciativaprogramaController = require('../controllers/iniciativaprograma');
var iniciativafechaController = require('../controllers/iniciativafecha');
var presupuestoiniciativaController = require('../controllers/presupuestoiniciativa');
var tareasnuevosproyectosController = require('../controllers/tareasnuevosproyectos');
var flujonuevatareaController = require('../controllers/flujonuevatarea');
var compromisosporcuiController = require('../controllers/compromisosporcui');
var planiniciativasController = require('../controllers/planiniciativas');

module.exports = function (passport) {

    router.get('/iniciativas', isAuthenticated, function (req, res) {
        res.render('iniciativas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/compromisosporcui', isAuthenticated, function (req, res) {
        res.render('compromisosporcui', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/compromisosporcui/list')
        .post(isAuthenticated, compromisosporcuiController.list);

    router.get('/planiniciativas', isAuthenticated, function (req, res) {
        res.render('planiniciativas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/planiniciativas/list')
        .post(isAuthenticated, planiniciativasController.list);

    router.route('/compromisosporcuiservicios/list/:id')
        .post(isAuthenticated, compromisosporcuiController.list2);

    router.route('/compromisosporcuiflujos/list/:id')
        .post(isAuthenticated, compromisosporcuiController.list3);

    router.route('/iniciativas/list')
        .post(isAuthenticated, iniciativaController.list);

    //router.route('/troyacompleto/list')
    //    .get(isAuthenticated, iniciativaController.listpivot);

    router.route('/iniciativas/:id')
        .get(isAuthenticated, iniciativaController.get)

    router.route('/iniciativas/action')
        .post(isAuthenticated, iniciativaController.action);

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

    router.route('/divisiones')
        .get(isAuthenticated, iniciativaController.getDivisiones);

    router.route('/personal')
        .get(isAuthenticated, iniciativaController.getPersonal);

    router.route('/actualizaduracion/:id')
        .get(isAuthenticated, iniciativafechaController.actualizaDuracion);

    router.route('/actualizamontos/:idiniciativa')
        .get(isAuthenticated, iniciativaprogramaController.actualizaMontos);

    router.route('/iniciativa/combobox')
        .get(isAuthenticated, iniciativaController.combobox);

    router.route('/iniciativaprograma/comboboxtotal/')
        .get(isAuthenticated, iniciativaprogramaController.comboboxtotal);

    router.route('/iniciativaprograma/combobox/:id')
        .get(isAuthenticated, iniciativaprogramaController.combobox);

    router.route('/presupuestoiniciativa/action')
        .post(isAuthenticated, presupuestoiniciativaController.action);

    router.route('/presupuestoiniciativa/actualiSAP')
        .post(isAuthenticated, presupuestoiniciativaController.actualiSAP);

    router.route('/presupuestoiniciativa/:id')
        .get(isAuthenticated, presupuestoiniciativaController.list);

    router.route('/inscripcionsap/listSAP')
        .post(isAuthenticated, presupuestoiniciativaController.listSAP);

    router.route('/tareasnuevosproyectos/action')
        .post(isAuthenticated, tareasnuevosproyectosController.action);

    router.route('/tareasnuevosproyectos/:id')
        .post(isAuthenticated, tareasnuevosproyectosController.list);

    router.route('/flujonuevatarea/action')
        .post(isAuthenticated, flujonuevatareaController.action);

    router.route('/flujonuevatarea/:id')
        .post(isAuthenticated, flujonuevatareaController.list);

    router.route('/serviciosdesarrollo')
        .get(isAuthenticated, tareasnuevosproyectosController.getServiciosDesarrollo);

    router.route('/proveedordesarrollo')
        .get(isAuthenticated, tareasnuevosproyectosController.getProveedoresDesarrollo);

    router.route('/tipopago')
        .get(isAuthenticated, tareasnuevosproyectosController.getTipoPago);

    router.route('/proyectosporiniciativa/:idtareanuevoproyecto')
        .get(isAuthenticated, flujonuevatareaController.getProyectosPorTareaNuevoProyecto);

    router.route('/tareasporproyecto/:idproyecto')
        .get(isAuthenticated, flujonuevatareaController.getTareasPorProyecto);

    router.route('/tareasporiniciativa/:idtareanuevoproyecto')
        .get(isAuthenticated, flujonuevatareaController.getTareasPorTareaNuevoProyecto);

    router.route('/subtareasportarea/:idtarea')
        .get(isAuthenticated, flujonuevatareaController.getSubtareasPorTarea);

    router.route('/subtareasporiniciativa/:idtareanuevoproyecto')
        .get(isAuthenticated, flujonuevatareaController.getSubtareasPorTareaNuevoProyecto);

    router.route('/cuiporservicio/:idservicio')
        .get(isAuthenticated, tareasnuevosproyectosController.getCUIServicio);

    router.route('/proveedorporcui/:idcui/:idservicio')
        .get(isAuthenticated, tareasnuevosproyectosController.getProveedorCUI);

    router.route('/getjefe/:id')
        .get(isAuthenticated, presupuestoiniciativaController.getJefe);

    router.route('/iniciativagetfechas')
        .get(isAuthenticated, iniciativafechaController.getFechas);
        
    return router;

}