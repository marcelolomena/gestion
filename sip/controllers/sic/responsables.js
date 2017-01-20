var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var bitacora = require("../../utils/bitacora");
var co = require('co');

exports.action = function (req, res) {
    var action = req.body.oper;
    var fechamastardia;

    if (action != "del") {
        if (req.body.fechamastardia != "")
            fechamastardia = req.body.fechamastardia.split("-").reverse().join("-")
    }

    logger.debug("la fecha ql:: " + fechamastardia);

    switch (action) {
        case "add":
            models.responsablesolicitud.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idrol: req.body.idrol,
                idresponsable: req.body.idresponsable,
                fechamastardia: fechamastardia,
                descripciondeberesproceso: req.body.descripciondeberesproceso,
                borrado: 1
            }).then(function (serviciosrequeridos) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'responsablesolicitud',
                    serviciosrequeridos.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.serviciosrequeridos,
                    function (err, data) {
                        if (data) {
                            logger.debug("->>> " + data)

                        } else {
                            logger.error("->>> " + err)
                        }
                    });
                return res.json({ id: serviciosrequeridos.id, parent: req.body.idsolicitudcotizacion, message: 'Insertando', success: true });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ id: 0, message: err.message, success: false });
            });
            break;
        case "edit":


            break;
        case "del":


            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'responsablesolicitud',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.responsablesolicitud, function (err, data) {
                    if (data) {

                        models.responsablesolicitud.destroy({
                            where: {
                                id: req.body.id
                            }
                        }).then(function (rowDeleted) {
                            // rowDeleted will return number of rows deleted

                            if (rowDeleted === 1) {


                                logger.debug('Deleted successfully');
                            }
                            return res.json({ error: 0, glosa: '' });

                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({ id: 0, message: err.message, success: false });
                        });
                    } else {
                        logger.error("->>> " + err)
                    }

                });




            break;
    }
}


exports.list = function (req, res) {

    var id = req.params.id;
    logger.debug("ID SERV : " + id)
    //documentoscotizacion

    var page = 1
    var rows = 10
    var filters = req.params.filters
    /*
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
  
    if (!sidx)
      sidx = "descripcion";
  
    if (!sord)
      sord = "asc";
  
    var orden = "[solicitudcotizacion]." + sidx + " " + sord;
    */

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)

            models.responsablesolicitud.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.responsablesolicitud.belongsTo(models.user, { foreignKey: 'idresponsable' });
            models.responsablesolicitud.belongsTo(models.rol, { foreignKey: 'idrol' });
            models.responsablesolicitud.count({
                where: {
                    idsolicitudcotizacion: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.responsablesolicitud.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idsolicitudcotizacion: id
                    },
                    include: [{
                        model: models.user
                    },
                    {
                        model: models.rol
                    }
                    ]
                }).then(function (serviciosrequeridos) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({ records: records, total: total, page: page, rows: serviciosrequeridos });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });

};

exports.getUsersByRolId = function (req, res) {
    models.user.belongsToMany(models.rol, { foreignKey: 'uid', through: models.usrrol });
    models.rol.belongsToMany(models.user, { foreignKey: 'rid', through: models.usrrol });

    models.user.findAll({
        attributes: ['uid', 'first_name', 'last_name'],
        order: ['[user].first_name', '[user].last_name'],
        include: [{
            model: models.rol,
            where: { 'id': req.params.id }, attributes: ['id', 'glosarol']
        }]
    }).then(function (gerentes) {
        return res.json(gerentes);
    }).catch(function (err) {
        logger.error(err)
        return res.json({ error_code: 1 });
    });
}

exports.getRoles = function (req, res) {

    var sql = "select * from sip.rol " +
        "where borrado=1 order by glosarol";

    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};


