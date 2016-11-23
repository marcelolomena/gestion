var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var solicitudcotizacionController = require('../controllers/sic/solicitudcotizacion');
var documentosController = require('../controllers/sic/documentos');
var serviciosController = require('../controllers/sic/servicios');

module.exports = function (passport) {
    router.get('/sic/solicitudcotizacion', isAuthenticated, function (req, res) {
        res.render('sic/solicitudcotizacion', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/grid_solicitudcotizacion')
        .post(isAuthenticated, solicitudcotizacionController.action)
        .get(isAuthenticated, solicitudcotizacionController.list);

    router.route('/sic/documentos/:id')
        .get(isAuthenticated, documentosController.list);
    
    router.route('/sic/servicios/:id')
        .get(isAuthenticated, serviciosController.list);

    router.get('/sic/getsession', function (req, res) {
        //console.log(req.session.passport.sidebar[0].rol)
        if (req.session.passport.sidebar[0].rol)
            res.json(req.session.passport.sidebar[0].rol);
        else
            res.send("no session value stored in DB ");
    });

    return router;
}