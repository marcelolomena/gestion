var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

module.exports = (function () {
    var registrar = function (idsolicitudcotizacion, tabla, idregistro, accion, idusuario, fecha, model) {

        if (accion == 'update' || accion == 'delete') {
            model.findAll({
                where: { id: idregistro },
            }).then(function (res) {
                models.bitacora.create({
                    idsolicitudcotizacion: idsolicitudcotizacion,
                    tabla: tabla,
                    idregistro: idregistro,
                    accion: accion,
                    dataold: res,
                    idusuario: idusuario,
                    fecha: fecha,
                    borrado: 1
                });


            }).catch(function (err) {
                logger.error(err.message);
            });
        } else {

            models.bitacora.create({
                idsolicitudcotizacion: idsolicitudcotizacion,
                tabla: tabla,
                idregistro: idregistro,
                accion: accion,
                idusuario: idusuario,
                fecha: fecha,
                borrado: 1
            });
        }
    }
    return {
        registrar: registrar
    };
})();
