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

    switch (action) {
        case "add":
            models.responsablesolicitud.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idrol: req.body.idrol,
                idresponsable: req.body.idresponsable,
                borrado: 1
            }).then(function (responsables) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'responsables',
                    responsables.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.responsables,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: responsables.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: responsables.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false });
            });
            break;
        case "edit":


            break;
        case "del":
            models.responsablesolicitud.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (responsables) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'responsables',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.responsablesolicitud,
                    function (err, data) {
                        if (!err) {
                            models.responsablesolicitud.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ message: err.message, success: false });
                            });
                        } else {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        }
                    });
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
        "where idsistema = 2 and borrado=1 order by glosarol";

    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};

exports.tecnicosresponsables = function (req, res) {
    var id = req.params.idsolicitud;
    var sql = "select max(periodo) as periodo from RecursosHumanos";

    sequelize.query(sql)
        .spread(function (rows) {
            var periodo = rows[0].periodo
            console.log("-----------AQUI VIENE")
            console.dir(periodo)

            var sql = "select distinct g.uid, f.nombre, f.apellido, f.numRut from sic.solicitudcotizacion a join sip.estructuracui b on a.idcui = b.id join dbo.art_user c on b.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.RecursosHumanos e on d.emailTrab = e.emailJefe join dbo.RecursosHumanos f on e.emailTrab = f.emailJefe join dbo.art_user g on f.emailTrab = g.email where a.id = " + id + " and d.periodo = " + periodo + " and e.periodo = " + periodo + " and f.periodo = " + periodo + "  UNION (select distinct g.uid, e.nombre, e.apellido, e.numRut from sic.solicitudcotizacion a  join  sip.estructuracui b on a.idcui = b.id join dbo.art_user c on b.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.RecursosHumanos e on d.emailTrab = e.emailJefe join dbo.art_user g on e.emailTrab = g.email where a.id = " + id + " and d.periodo = " + periodo + " and e.periodo = " + periodo + ") UNION (select distinct g.uid, d.nombre, d.apellido, d.numRut from sic.solicitudcotizacion a  join sip.estructuracui b on a.idcui = b.id join dbo.art_user c on b.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.art_user g on d.emailTrab = g.email where a.id   =" + id + " and d.periodo = " + periodo + ") UNION (select distinct c.uid, c.first_name, c.last_name, '' from sic.solicitudcotizacion a  join sip.estructuracui b on a.idcui = b.id join dbo.art_user c on b.uid = c.uid where a.id = " + id + ") order by  f.nombre, f.apellido, g.uid,f.numRut";
            sequelize.query(sql)
                .spread(function (rows) {
                    return res.json(rows);
                });
        });
};




