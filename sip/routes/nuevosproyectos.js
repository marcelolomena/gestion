// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var nuevosProyectosController = require('../controllers/nuevosproyectos');

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

    return router;

}