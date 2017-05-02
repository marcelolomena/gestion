// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logController = require('../controllers/consultalog');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/consultalog', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'consultalog' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'consultalog',
                title: 'Consulta Log Transacciones',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });         
    });

    router.route('/funciones')
        .get(isAuthenticated, logController.funciones);
    
    router.route('/transaccioneslog/:id')
        .get(isAuthenticated, logController.transacciones);
        
    router.route('/consultalog/usuarios')
        .get(isAuthenticated, logController.usuarios);        
          
    router.route('/consultalog/list')
        .get(isAuthenticated, logController.list);
        
    router.route('/consultalog/detalle/:id')
        .get(isAuthenticated, logController.getDetalle);        
        
    router.route('/consultalog/excel')
        .get(isAuthenticated, logController.getExcel);              
        
    return router;    

}