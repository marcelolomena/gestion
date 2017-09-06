var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');
module.exports = function (passport) {

    router.route('/lic/grid_inventario')
        .get(isAuthenticated, function (req, res) {
            var data = [{
                id: 1,
                fabricante: 'Tableau Software',
                software: 'Tableau',
                tipoInstalacion: 'PC',
                clasificacion: 'Software de aplicación',
                tipoLicenciamiento: 'Usuario',
                licStock: '16',
                licDisponibles: '0',
                alertaRenovacion: 'Al Día',
                utilidad: 'Compra licencia Tableau Desktop para Alejandro Arriagada',
                comentarios: '02.08.17 corresponde a la compra de una licencia tableau para Alejandro Arriagada Espinoza, autorizado por Javier Largo Gajardo'
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