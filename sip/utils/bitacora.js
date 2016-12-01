var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

module.exports = (function () {
    var registrar = function (idsolicitudcotizacion, tabla, idregistro, accion, dataold, idusuario, fecha) {

        models.bitacora.create({
            idsolicitudcotizacion: idsolicitudcotizacion,
            tabla: tabla,
            idregistro: idregistro,
            accion: accion,
            dataold: dataold,
            idusuario: idusuario,
            fecha: fecha,
            borrado: 1
        });

    }
    return {
        registrar: registrar
    };
})();
