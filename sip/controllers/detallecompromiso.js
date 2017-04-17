var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var logtransaccion = require("../utils/logtransaccion");
var constants = require("../utils/constants");

exports.action = function (req, res) {
    var action = req.body.oper;
    var montoorigen = req.body.montoorigen
    var costoorigen = req.body.costoorigen
    var parentRowKey = req.body.parentRowKey
    var valorcuota = req.body.valorcuota
    var impuesto = req.body.impuesto
    var factorimpuesto = req.body.factorimpuesto

    if (action != "del") {
        //if (montoorigen != "")
        //    montoorigen = montoorigen.split(".").join("").replace(",", ".")
        //if (costoorigen != "")
        //    costoorigen = costoorigen.split(".").join("").replace(",", ".")
        if (valorcuota != "")
            valorcuota = valorcuota.split(".").join("").replace(",", ".")
    }

    logger.debug("montoorigen : " + montoorigen)
    logger.debug("costoorigen : " + costoorigen)
    switch (action) {
        case "add":
            sequelize.query("EXECUTE sip.InsertaPeriodoContrato " + req.params.idd + "," +
                req.body.periodo + "," + valorcuota)
                .then(function (rows) {
                    logger.debug("****Creo Periodo contrato:" + rows[0][0].id + ',' + JSON.stringify(rows));
                    models.detallecompromiso.findAll({
                        where: { id: rows[0][0].id },
                    }).then(function (registro) {
                        logtransaccion.registrar(
                            constants.CreaFlujo,
                            rows[0][0].id,
                            'insert',
                            req.session.passport.user,
                            'detallecompromiso',
                            registro,
                            function (err, data) {
                                if (!err) {
                                    res.json({ error_code: 0 });
                                } else {
                                    logger.error(err)
                                    return res.json({ error_code: 1 });
                                }
                            });
                    });
                    //res.json({ error_code: 0 });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });

            break;
        case "edit":
            logtransaccion.registrar(
                constants.ActualizaFlujo,
                req.body.id,
                'update',
                req.session.passport.user,
                models.detallecompromiso,
                req.body,
                function (err, idlog) {
                    if (!err) {
                        sequelize.query("EXECUTE sip.UpdatePeriodoContrato " + req.body.id + "," +
                            valorcuota)
                            .then(function (rows) {
                                logger.debug("****Actualizo Periodo contrato");
                                logtransaccion.actualizar(idlog, req.body.id, models.detallecompromiso,
                                    function (err, idlog) {
                                        if (!err) {
                                            res.json({ error_code: 0 });
                                        } else {
                                            logger.error(err)
                                            return res.json({ error_code: 1 });
                                        }
                                    });
                            }).catch(function (err) {
                                logger.error(err);
                                res.json({ error_code: 1 });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });
            break;
        case "del":
            logtransaccion.registrar(
                constants.BorraFlujo,
                req.body.id,
                'delete',
                req.session.passport.user,
                models.detallecompromiso,
                req.body,
                function (err, data) {
                    if (!err) {
                        var sql0 = 'SELECT count(*) AS total FROM sip.solicitudaprobacion WHERE iddetallecompromiso=' + req.body.id;
                        sequelize.query(sql0).spread(function (results) {
                            if (results[0].total == 0) {
                                models.detallecompromiso.destroy({
                                    where: {
                                        id: req.body.id
                                    }
                                }).then(function (rowDeleted) {
                                    if (rowDeleted === 1) {
                                        logger.debug('Deleted successfully');
                                    }
                                    res.json({ error_code: 0 });
                                }).catch(function (err) {
                                    logger.error(err);
                                    res.json({ error_code: 1 });
                                });
                            } else {
                                logger.debug("**ERROR al borrar flujo**:");
                                res.json({ error_code: 1 });
                            }
                        });
                    } else {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });

            break;
    }
}

exports.list = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "periodo";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    sequelize.query("select * from sip.detallecompromiso where iddetalleserviciocto=" +
        req.params.id + " ORDER BY periodo")
        .spread(function (rows) {
            res.json({ records: 1, total: 1, page: 1, rows: rows });
        });

};
