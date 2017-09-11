var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');
module.exports = function (passport) {
    router.get('/lic/getsession', function (req, res) {
        return req.session.passport.sidebar[0].rol ? res.json(req.session.passport.sidebar[0].rol) : res.send("no session value stored in DB ");
    });
    router.get('/lic/fabricante', function (req, res) {
        return res.json([{
            id: 1,
            nombre: 'Atlassian'
        }, {
            id: 2,
            nombre: 'Checkpoint'
        }, {
            id: 3,
            nombre: 'Symantec'
        }, {
            id: 4,
            nombre: 'EastNets'
        }, {
            id: 5,
            nombre: 'Oracle'
        }, {
            id: 6,
            nombre: 'Microsoft'
        }, {
            id: 7,
            nombre: 'Tableau Software'
        }, {
            id: 8,
            nombre: 'Adobe'
        }]);
    });
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
    router.get('/lic/moneda', function (req, res) {
        return res.json([{
            id: 1,
            nombre: 'Versión'
        }, {
            id: 2,
            nombre: 'Suite'
        }]);
    });
    router.get('/lic/tipoInstalacion', function (req, res) {
        return res.json([{
                id: 1,
                nombre: 'PC'
            },
            {
                id: 2,
                nombre: 'Servidor'
            },
            {
                id: 3,
                nombre: 'PC/Servidor'
            },
            {
                id: 4,
                nombre: 'Dispositivo'
            },
            {
                id: 5,
                nombre: 'De baja'
            }
        ]);
    });
    router.get('/lic/clasificacion', function (req, res) {
        return res.json([{
            id: 1,
            nombre: 'SW de aplicación'
        }, {
            id: 2,
            nombre: 'SW de desarrollo'
        }]);
    });
    router.get('/lic/tipoLicenciamiento', function (req, res) {
        return res.json([{
            id: 1,
            nombre: 'Usuarios concurrentes'
        }, {
            id: 2,
            nombre: 'Usuarios nombrados'
        }, {
            id: 3,
            nombre: 'Número de cores.'
        }]);
    });
    router.route('/lic/grid_inventario')
        .get(isAuthenticated, function (req, res) {
            var data = [{
                id: '1',
                fabricante: 'Tableau Software',
                software: 'Tableau',
                tipoInstalacion: 'PC',
                clasificacion: 'SW de aplicación',
                tipoLicenciamiento: 'Usuarios concurrentes',
                licStock: '16',
                licDisponibles: '0',
                alertaRenovacion: 'Al Día',
                utilidad: 'Compra licencia Tableau Desktop para Alejandro Arriagada',
                comentarios: '02.08.17 corresponde a la compra de una licencia tableau para Alejandro Arriagada Espinoza, autorizado por Javier Largo Gajardo'
            }, {
                id: 2,
                fabricante: 'Adobe',
                software: 'Adobe LiveCycle',
                tipoInstalacion: 'PC',
                clasificacion: 'SW de aplicación',
                tipoLicenciamiento: 'Usuarios concurrentes',
                licStock: '16',
                licDisponibles: '0',
                alertaRenovacion: 'Al Día',
                utilidad: 'ADEP es una plataforma de generación de documentación, se utiliza principalmente para la generación de documentación de los proceso de venta de Credichile y Banco de Chile.',
                comentarios: '21.06.17 resp Juan Carlos Lara, son 450 licencias proyecto ADEP                 01.05.17 Se compraron 400 licencias users y una base. Servicios de soporte y mantenimiento para licencias ADEP – LiveCycle.'
            }, {
                id: 3,
                fabricante: 'Atlassian',
                software: 'Licencias Jira',
                tipoInstalacion: 'PC',
                clasificacion: 1,
                tipoLicenciamiento: 'Usuarios concurrentes',
                licStock: '16',
                licDisponibles: '0',
                alertaRenovacion: 'Al Día',
                utilidad: 'Software usado por la Nueva Internet para desarrollo agil.',
                comentarios: '21.06.17 no hay información de la compra, conseguir documento                01.05.17 No existe contrato de mantención'
            }];
            return res.json({
                records: 1,
                total: 1,
                page: 1,
                rows: data
            });
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