var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');

exports.agregarBitacora = function (req, res) {

    models.bitacora.create({
        idsolicitudcotizacion: req.body.idsolicitudcotizacion,
        tabla: req.body.tabla,
        idregistro: req.body.idregistro,
        accion: req.body.accion,
        dataold: req.body.dataold,
        idusuario: req.body.idusuario,
        fecha: req.body.fecha,
        borrado: 1
    }).then(function (bitacora) {
        res.json({ error_code: 0 });
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });

}
module.exports = (function () {
    var bitacora = function (idsolicitudcotizacion, tabla, idregistro, accion, dataold, idusuario, fecha) {

        models.bitacora.create({
            idsolicitudcotizacion: idsolicitudcotizacion,
            tabla: tabla,
            idregistro: idregistro,
            accion: accion,
            dataold: dataold,
            idusuario: idusuario,
            fecha: fecha,
            borrado: 1
        }).then(function (bitacora) {
            res.json({ error_code: 0 });
        }).catch(function (err) {
            logger.error(err)
            res.json({ error_code: 1 });
        });

    }
    return {
        bitacora: bitacora
    };
})();
