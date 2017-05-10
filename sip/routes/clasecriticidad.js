var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var criticidadController = require('../controllers/sic/clasecriticidad');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function(passport) {
/*    
    router.get('/clasecriticidad', isAuthenticated, function(req, res) {
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'clasecriticidad' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home2', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'clasecriticidad',
                title: '',
                type: pagina.contenido.nombre
            });
        }).catch(function (err) {
            logger.error(err);
        });
        
    });
*/
    router.route('/sic/clasecriticidad/list')
        .get(isAuthenticated, criticidadController.list);

    router.route('/sic/clasecriticidad/color')
        .get(isAuthenticated, criticidadController.getColor);

    router.route('/sic/clasecriticidad/notas')
        .get(isAuthenticated, criticidadController.getNotas);

    router.route('/sic/clasecriticidad/action')
        .post(isAuthenticated, criticidadController.action);

    router.route('/sic/desglosefactores/:id')
        .post(isAuthenticated, criticidadController.desglosefactores);

    router.route('/sic/desglosecolores/:id')
        .post(isAuthenticated, criticidadController.desglosecolores);

    router.route('/sic/actiondesglosefactores/action')
        .post(isAuthenticated, criticidadController.actiondesglosefactores);
    
    router.route('/sic/actiondesglosecolores/action')
        .post(isAuthenticated, criticidadController.actiondesglosecolores);

    router.route('/sic/porcentajedesglosefactores/:parentRowKey')
        .get(isAuthenticated, criticidadController.porcentajedesglosefactores);

    router.route('/sic/desglosenotas/:id')
        .post(isAuthenticated, criticidadController.desglosenotas);

    router.route('/sic/actiondesglosenotas/action')
        .post(isAuthenticated, criticidadController.actiondesglosenotas);

    return router;
}