var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

module.exports = (function (registrar, registrarhijo) {
    var registrar = function (idsolicitudcotizacion, tabla, idregistro, accion, idusuario, fecha, model, callback) {

        if (accion == 'update' || accion == 'delete') {
            model.findAll({
                where: { id: idregistro },
            }).then(function (res) {
                console.dir(res);
                console.log("voy a registrar este  id " + res[0].idsolicitudcotizacion)
                var reg=models.bitacora.create({
                    idsolicitudcotizacion: res[0].idsolicitudcotizacion,
                    tabla: tabla,
                    idregistro: idregistro,
                    accion: accion,
                    dataold: JSON.stringify(res),
                    idusuario: idusuario,
                    fecha: fecha,
                    borrado: 1
                });
                callback(undefined, reg);

            }).catch(function (err) {
                logger.error(err.message);
                return callback(err);
            });
        } else {

            var reg=models.bitacora.create({
                idsolicitudcotizacion: idsolicitudcotizacion,
                tabla: tabla,
                idregistro: idregistro,
                accion: accion,
                idusuario: idusuario,
                fecha: fecha,
                borrado: 1
            });
             callback(undefined, reg);

        }
    }

    var registrarhijo = function (idsolicitudcotizacion, tabla, idregistro, accion, idusuario, fecha, model, callback) {

        if (accion == 'update' || accion == 'delete') {
            model.findAll({
                where: { id: idregistro },
            }).then(function (res) {
                var reg=models.bitacora.create({
                    idsolicitudcotizacion: idsolicitudcotizacion,
                    tabla: tabla,
                    idregistro: idregistro,
                    accion: accion,
                    dataold: JSON.stringify(res),
                    idusuario: idusuario,
                    fecha: fecha,
                    borrado: 1
                });
                callback(undefined, reg);

            }).catch(function (err) {
                logger.error(err.message);
                return callback(err);
            });
        } else {

            var reg=models.bitacora.create({
                idsolicitudcotizacion: idsolicitudcotizacion,
                tabla: tabla,
                idregistro: idregistro,
                accion: accion,
                idusuario: idusuario,
                fecha: fecha,
                borrado: 1
            });
             callback(undefined, reg);

        }
    } 
    return {
        registrar: registrar, registrarhijo: registrarhijo
    };
})();
