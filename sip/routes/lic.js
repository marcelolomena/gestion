var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');

var clasificacionController = require('../controllers/lic/clasificacion');
var fabricanteController = require('../controllers/lic/fabricante');
var tipoInstalacionController = require('../controllers/lic/tipoInstalacion');
var tipoLicenciamientoController = require('../controllers/lic/tipoLicenciamiento');
var licenciaController = require('../controllers/lic/licencia');
var proveedorController = require('../controllers/lic/proveedor');
var areaController = require('../controllers/lic/area');
var monedaController = require('../controllers/lic/moneda');
var tipoController = require('../controllers/lic/tipo');

module.exports = function (passport) {
    router.get('/lic/getsession', function (req, res) {
        return req.session.passport.sidebar[0].rol ? res.json(req.session.passport.sidebar[0].rol) : res.send("no session value stored in DB ");
    });
    router.get('/lic/clasificacion', clasificacionController.listAll);
    router.get('/lic/fabricante', fabricanteController.listAll);
    router.get('/lic/tipoInstalacion',tipoInstalacionController.listAll);
    router.get('/lic/tipoLicenciamiento', tipoLicenciamientoController.listAll);
    
    router.route('/lic/grid_inventario')
    .get(isAuthenticated, licenciaController.list)
    .post(isAuthenticated, licenciaController.action);
    
    
    router.get('/lic/proveedor', proveedorController.listAll);
    router.get('/lic/area', areaController.listAll);
    router.get('/lic/moneda', monedaController.listAll);
    router.get('/lic/tipo', tipoController.listAll);


  
   

    router.route('/lic/compra')
        .get(isAuthenticated, function (req, res) {
            var data = [{
                id: 1,
                contrato: 111,
                ordenCompra: 222,
                cui: 123,
                sap: 333,
                proveedor: 1,
                area: 1,
                anoCompra: 2017,
                anoExpiracion: 2018,
                licenciasCompradas: 2,
                moneda: 1,
                valorLicencias: 99,
                valorSoporte: 0,
                fechaRenovacionSoporte: null,
                factura: 999
            }];
            return res.json({
                records: 1,
                total: 1,
                page: 1,
                rows: data
            });
        });

    router.route('/lic/instalacion')
        .get(isAuthenticated, function (req, res) {
            var data = [{
                    id: 1,
                    cui: 123,
                    usuario: 'Juan Pérez',
                    cantidad: 3
                },
                {
                    id: 2,
                    cui: 321,
                    usuario: 'José Pérez',
                    cantidad: 3
                }
            ];
            return res.json({
                records: 1,
                total: 1,
                page: 1,
                rows: data
            });
        });

    router.route('/lic/ajuste')
        .get(isAuthenticated, function (req, res) {
            var data = [{
                    id: 1,
                    fecha: '21-11-2017',
                    usuario: 'Juan Pérez',
                    cantidad: 3,
                    observacion: 'Snow'
                },
                {
                    id: 1,
                    fecha: '21-12-2017',
                    usuario: 'Juan Pérez',
                    cantidad: 3,
                    observacion: 'Snow'
                }
            ];
            return res.json({
                records: 1,
                total: 1,
                page: 1,
                rows: data
            });
        });

    router.route('/lic/traduccion')
        .get(isAuthenticated, function (req, res) {
            var data = [{
                id: 1,
                nombre: 'otro',
                tipo: 1
            }];
            return res.json({
                records: 1,
                total: 1,
                page: 1,
                rows: data
            });
        });

    return router;
};