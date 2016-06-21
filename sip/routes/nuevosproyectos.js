// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var nuevosProyectosController = require('../controllers/nuevosproyectos');
var tareasNuevosProyectosController = require('../controllers/tareasnuevosproyectos');
var flujoNuevaTareaController = require('../controllers/flujonuevatarea');

module.exports = function (passport) {

    router.get('/nuevosproyectos', isAuthenticated, function (req, res) {
        res.render('nuevosproyectos', { user: req.user })
    });

    router.route('/nuevosproyectos/list')
        .post(isAuthenticated, nuevosProyectosController.list);

    router.route('/nuevosproyectos/action')
        .post(isAuthenticated, nuevosProyectosController.action);

    //router.route('/nuevosproyectos/excel')
        //.get(isAuthenticated, nuevosProyectosController.excel);

    router.route('/tareasnuevosproyectos/:id')
        .post(isAuthenticated, tareasNuevosProyectosController.list);

    router.route('/tareasnuevosproyectos/action/:idd')
        .post(isAuthenticated, tareasNuevosProyectosController.action);

    //router.route('/flujonuevatarea/:id')
      //  .post(isAuthenticated, flujoNuevaTareaController.list);

    //router.route('/flujonuevatarea/:idd/action')
      //  .post(isAuthenticated, flujoNuevaTareaController.action);

    return router;

}