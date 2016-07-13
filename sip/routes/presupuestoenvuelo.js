// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var presupuestoenvueloController = require('../controllers/presupuestoenvuelo');
var tareaenvueloController = require('../controllers/tareaenvuelo');
var flujopagoenvueloController = require('../controllers/flujopagoenvuelo');

module.exports = function (passport) {

    router.get('/presupuestoenvuelo', isAuthenticated, function (req, res) {
        res.render('presupuestoenvuelo', { user: req.user });
    });
    router.route('/presupuestoenvuelo/list')
        .post(isAuthenticated, presupuestoenvueloController.list);

    router.route('/presupuestoenvuelo/action')
        .post(isAuthenticated, presupuestoenvueloController.action);

    router.route('/tareaenvuelo/:id')
        .post(isAuthenticated, tareaenvueloController.list);

    router.route('/flujopagoenvuelo/:id')
        .post(isAuthenticated, flujopagoenvueloController.list);




    return router;

}
