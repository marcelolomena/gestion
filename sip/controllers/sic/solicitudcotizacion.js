var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.solicitudcotizacion.create({
                idcui: req.body.idcui,
                idtecnico: req.body.idtecnico,
                tipocontrato: req.body.tipocontrato,
                program_id: req.body.program_id,
                codigoart: req.body.codigoart,
                sap: req.body.sap,
                descripcion: req.body.descripcion,
                codigosolicitud: req.body.codigosolicitud,
                idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                idnegociador: req.body.idnegociador,
                correonegociador: req.body.correonegociador,
                fononegociador: req.body.fononegociador,
                numerorfp: req.body.numerorfp,
                fechaenviorfp: req.body.fechaenviorfp,
                direccionnegociador: req.body.direccionnegociador,
                //nombreinterlocutor1: req.body.nombreinterlocutor1,
                //correointerlocutor1: req.body.correointerlocutor1,
                //fonointerlocutor1: req.body.fonointerlocutor1,
                //nombreinterlocutor2: req.body.nombreinterlocutor2,
                //correointerlocutor2: req.body.correointerlocutor2,
                //fonointerlocutor2: req.body.fonointerlocutor2,
                borrado: 1,
                idtipo: req.body.idtipo,
                idgrupo: req.body.idgrupo
            }).then(function (solicitudcotizacion) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":

            var roles = req.session.passport.sidebar[0].rol
            var isTec = false

            for (var i in roles) {

                if (roles[i].glosarol === 'Técnico SIC') {
                    isTec = true
                }

            }

            if (isTec) {
                models.solicitudcotizacion.update({
                    idcui: req.body.idcui,
                    idtecnico: req.body.idtecnico,
                    tipocontrato: req.body.tipocontrato,
                    program_id: req.body.program_id,
                    codigoart: req.body.codigoart,
                    sap: req.body.sap,
                    descripcion: req.body.descripcion
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (solicitudcotizacion) {
                        res.json({ error: 0, glosa: '' });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({ error: 1, glosa: err.message });
                    });
            } else {
                models.solicitudcotizacion.update({
                    codigosolicitud: req.body.codigosolicitud,
                    idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                    idnegociador: req.body.idnegociador,
                    correonegociador: req.body.correonegociador,
                    fononegociador: req.body.fononegociador,
                    direccionnegociador: req.body.direccionnegociador,
                    numerorfp: req.body.numerorfp,
                    fechaenviorfp: req.body.fechaenviorfp,
                    //nombreinterlocutor1: req.body.nombreinterlocutor1,
                    //correointerlocutor1: req.body.correointerlocutor1,
                    //fonointerlocutor1: req.body.fonointerlocutor1,
                    //nombreinterlocutor2: req.body.nombreinterlocutor2,
                    //correointerlocutor2: req.body.correointerlocutor2,
                    //fonointerlocutor2: req.body.fonointerlocutor2,
                    idtipo: req.body.idtipo,
                    idgrupo: req.body.idgrupo
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (solicitudcotizacion) {
                        res.json({ error: 0, glosa: '' });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({ error: 1, glosa: err.message });
                    });

            }

            break;
        case "del":
            models.solicitudcotizacion.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
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
        sidx = "descripcion";

    if (!sord)
        sord = "asc";

    var orden = "[solicitudcotizacion]." + sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (data) {
            models.solicitudcotizacion.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
            models.solicitudcotizacion.belongsTo(models.programa, { foreignKey: 'program_id' });
            models.solicitudcotizacion.belongsTo(models.user, { as: 'tecnico', foreignKey: 'idtecnico' });
            models.solicitudcotizacion.belongsTo(models.valores, { as: 'clasificacion', foreignKey: 'idclasificacionsolicitud' });
            models.solicitudcotizacion.belongsTo(models.user, { as: 'negociador', foreignKey: 'idnegociador' });
            models.solicitudcotizacion.belongsTo(models.tipoclausula, { foreignKey: 'idtipo' });
            models.solicitudcotizacion.belongsTo(models.valores, { as: 'grupo', foreignKey: 'idgrupo' });
            models.solicitudcotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.solicitudcotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.estructuracui
                    }, {
                        model: models.programa
                    }, {
                        model: models.user, as: 'tecnico'
                    }, {
                        model: models.valores, as: 'clasificacion'
                    }, {
                        model: models.user, as: 'negociador'
                    }, {
                        model: models.tipoclausula
                    }, {
                        model: models.valores, as: 'grupo'
                    }
                    ]
                }).then(function (solicitudcotizacion) {
                    return res.json({ records: records, total: total, page: page, rows: solicitudcotizacion });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

}

exports.tipoclausula = function (req, res) {

    models.tipoclausula.findAll({
        order: 'id ASC',
        attributes: ['id', 'nombre']
    }).then(function (tipoclausula) {
        return res.json(tipoclausula);
    }).catch(function (err) {
        logger.error(err.message);
        res.json({ error_code: 1 });
    });

}

exports.getcolorservicios = function (req, res) {

    var idsolicitud = req.params.idsolicitud;

    var sql = "select colornota from sic.serviciosrequeridos where idsolicitudcotizacion = " + idsolicitud;

    sequelize.query(sql)
        .spread(function (rows) {
            var colorfinal = 'Verde'

            for (var f in rows) {

                if (rows[f].colornota == 'Rojo') {
                    colorfinal = 'Rojo'
                } else {
                    if (colorfinal != 'Rojo') {
                        if (rows[f].colornota == 'Amarillo') {
                            colorfinal = 'Amarillo'
                        }
                    }
                }
            }
            //logger.debug("el color final= "+colorfinal)

            res.json(colorfinal);
        });

};
exports.tecnicosresponsablescui = function (req, res) {
    var id = req.params.idcui;
    var sql = "select max(periodo) as periodo from RecursosHumanos";

    sequelize.query(sql)
        .spread(function (rows) {
            var periodo = rows[0].periodo
            //console.log("-----------AQUI VIENE")
            //console.dir(periodo)

            var sql = "select distinct g.uid, f.nombre, f.apellido, f.numRut from sip.estructuracui a join dbo.art_user c on a.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.RecursosHumanos e on d.emailTrab = e.emailJefe join dbo.RecursosHumanos f on e.emailTrab = f.emailJefe join dbo.art_user g on f.emailTrab = g.email where a.id = " + id + " and d.periodo = " + periodo + " and e.periodo = " + periodo + " and f.periodo = " + periodo + "  UNION (select distinct g.uid, e.nombre, e.apellido, e.numRut from sip.estructuracui a join dbo.art_user c on a.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.RecursosHumanos e on d.emailTrab = e.emailJefe join dbo.art_user g on e.emailTrab = g.email where a.id = " + id + " and d.periodo = " + periodo + " and e.periodo = " + periodo + ") UNION (select distinct g.uid, d.nombre, d.apellido, d.numRut from sip.estructuracui a join dbo.art_user c on a.uid = c.uid join dbo.RecursosHumanos d on d.emailJefe = c.email join dbo.art_user g on d.emailTrab = g.email where a.id   =" + id + " and d.periodo = " + periodo + ") UNION (select distinct c.uid, c.first_name, c.last_name, '' from sip.estructuracui a join dbo.art_user c on a.uid = c.uid where a.id = " + id + ") order by  f.nombre, f.apellido, g.uid,f.numRut";
            sequelize.query(sql)
                .spread(function (rows) {
                    return res.json(rows);
                });
        });
};

exports.traerdatos = function (req, res) {
    var id = req.params.id;
    var sql = " select email, contact_number from art_user where uid="+id+";";

    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });
};