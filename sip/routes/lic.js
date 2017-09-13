var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');

var clasificacionController = require('../controllers/lic/clasificacion');
var fabricanteController = require('../controllers/lic/fabricante');
var tipoInstalacionController = require('../controllers/lic/tipoInstalacion');
var tipoLicenciamientoController = require('../controllers/lic/tipoLicenciamiento');
var licenciaController = require('../controllers/lic/licencia');


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
    
    
    router.get('/lic/proveedor', function (req, res) {
        return res.json([{
                id: 1,
                nombre: 'NOVARED CHILE S.A.'
            }, {
                id: 2,
                nombre: 'E-SIGN S.A.'
            }, {
                id: 3,
                nombre: 'Experian'
            }, {
                id: 4,
                nombre: 'HEWLETT PACKARD CHILE COMERCIAL LTDA.'
            }, {
                id: 5,
                nombre: 'Sistemas Oracle de Chile S.A'
            }

        ]);
    });
    router.get('/lic/area', function (req, res) {
        return res.json([{
            id: 1,
            nombre: 'Infraestructura'
        }, {
            id: 2,
            nombre: 'Operaciones'
        }, {
            id: 3,
            nombre: 'Seguridad'
        }, {
            id: 4,
            nombre: 'Gestión'
        }, {
            id: 5,
            nombre: 'Mobile'
        }, {
            id: 6,
            nombre: 'Cumplimiento'
        }]);
    });
    router.get('/lic/moneda', function (req, res) {
        return res.json([{
                id: 1,
                nombre: 'CLP'
            }, {
                id: 2,
                nombre: 'USD'
            }, {
                id: 3,
                nombre: 'UF'
            }, {
                id: 4,
                nombre: 'EUR'
            }

        ]);
    });
    router.get('/lic/tipo', function (req, res) {
        return res.json([{
            id: 1,
            nombre: 'Versión'
        }, {
            id: 2,
            nombre: 'Suite'
        }]);
    });


  
   

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