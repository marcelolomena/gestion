// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var contratoservicioController = require('../controllers/contratoservicio');
var contratoController = require('../controllers/contrato');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/contratos', isAuthenticated, function (req, res) {
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'contratos' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'contratos',
                title: 'CONTRATOS',
                type: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });
    });

    router.route('/contratos/list')
        .post(isAuthenticated, contratoController.list)
        .get(isAuthenticated, contratoController.listall);

    router.route('/contratos/action')
        .post(isAuthenticated, contratoController.action);

    router.route('/contratos/excel')
        .get(isAuthenticated, contratoController.excel);

    router.route('/sap')
        .get(isAuthenticated, contratoservicioController.sap);

    router.route('/tarea/:id')
        .get(isAuthenticated, contratoservicioController.tarea);

    router.route('/contratoservicio/:id')
        .post(isAuthenticated, contratoservicioController.list);

    router.route('/contratoproveedor/:id')
        .get(isAuthenticated, contratoController.listaporproveedor);

    router.route('/contratoservicio/plantillapresupuesto/:id')
        .get(isAuthenticated, contratoservicioController.plantillapresupuesto);

    router.route('/contratoservicio/cuiforservice/:idp/:ids/:sap')
        .get(isAuthenticated, contratoservicioController.cuiforservice);

    router.route('/contratoservicio/action/:id')
        .post(isAuthenticated, contratoservicioController.action);

    router.route('/contratoproyecto/action/:id')
        .post(isAuthenticated, contratoservicioController.oper);

    router.route('/contratoperiodos')
        .get(isAuthenticated, contratoservicioController.getPeriodos);

    router.route('/contratoservicio/saldopresup/:id/:id2')
        .get(isAuthenticated, contratoservicioController.getSaldoPresup);

    router.route('/contrato/tipodocumento')
        .get(isAuthenticated, contratoController.getTipoDocumentos);

    router.route('/getcodigoart/:id')
        .get(isAuthenticated, contratoController.getCodigoart);

    router.route('/getlistasap/:id/:id2')
        .get(isAuthenticated, contratoservicioController.getListaSAP);

    router.route('/getlistatareas/:id/:id2')
        .get(isAuthenticated, contratoservicioController.getListaTareas);

    return router;

}