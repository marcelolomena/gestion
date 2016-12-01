var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');


exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.serviciosrequeridos.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idservicio: req.body.idservicio,
                glosaservicio: req.body.glosaservicio,
                iddoctotecnico: req.body.iddoctotecnico,
                glosareferencia: req.body.glosareferencia,
                idclasecriticidad: req.body.idclasecriticidad,
                notacriticidad: req.body.notacriticidad,
                idsegmento: req.body.idsegmento,
                borrado: 1
            }).then(function (serviciosrequeridos) {
                models.bitacora.create({
                    idsolicitudcotizacion: serviciosrequeridos.idsolicitudcotizacion,
                    tabla: 'serviciosrequeridos',
                    idregistro: serviciosrequeridos.id,
                    accion: 'insert',
                    idusuario: req.session.passport.user,
                    fecha: new Date(),
                    borrado: 1
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ id: 0, message: err.message, success: false });
                });
                res.json({ id: serviciosrequeridos.id, parent: req.body.idsolicitudcotizacion, message: 'Insertando', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });
            break;
        case "edit":

            models.serviciosrequeridos.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (servicioold) {

                models.serviciosrequeridos.update({
                    idservicio: req.body.idservicio,
                    glosaservicio: req.body.glosaservicio,
                    iddoctotecnico: req.body.iddoctotecnico,
                    glosareferencia: req.body.glosareferencia,
                    idclasecriticidad: req.body.idclasecriticidad,
                    notacriticidad: req.body.notacriticidad,
                    idsegmento: req.body.idsegmento
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (serviciosrequeridos) {
                        //console.dir(servicioold);
                        //console.log(JSON.stringify(servicioold));

                        models.bitacora.create({
                            idsolicitudcotizacion: servicioold[0].idsolicitudcotizacion,
                            tabla: 'serviciosrequeridos',
                            idregistro: req.body.id,
                            accion: 'update',
                            idusuario: req.session.passport.user,
                            fecha: new Date(),
                            dataold: JSON.stringify(servicioold),
                            borrado: 1
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        });
                        res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Actualizando', success: true });
                    }).catch(function (err) {
                        logger.error(err)
                        res.json({ id: 0, message: err.message, success: false });
                    });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });
            break;
        case "del":
            models.serviciosrequeridos.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (servicioold) {

                models.serviciosrequeridos.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) {
                // rowDeleted will return number of rows deleted

                    if (rowDeleted === 1) {
                        
                       models.bitacora.create({
                            idsolicitudcotizacion: servicioold[0].idsolicitudcotizacion,
                            tabla: 'serviciosrequeridos',
                            idregistro: req.body.id,
                            accion: 'delete',
                            idusuario: req.session.passport.user,
                            fecha: new Date(),
                            dataold: JSON.stringify(servicioold),
                            borrado: 1
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({ id: 0, message: err.message, success: false });
                        }); 
                        logger.debug('Deleted successfully');
                    }
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ id: 0, message: err.message, success: false });
                });

            }).catch(function (err) {
                    logger.error(err)
                    res.json({ id: 0, message: err.message, success: false });
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

                models.serviciosrequeridos.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
                models.serviciosrequeridos.belongsTo(models.servicio, { foreignKey: 'idservicio' });
                models.serviciosrequeridos.belongsTo(models.documentoscotizacion, { foreignKey: 'iddoctotecnico' });
                models.serviciosrequeridos.belongsTo(models.clasecriticidad, { foreignKey: 'idclasecriticidad' });
                models.serviciosrequeridos.belongsTo(models.segmentoproveedor, { foreignKey: 'idsegmento' });
                models.serviciosrequeridos.count({
                    where: {
                        idsolicitudcotizacion: id
                    }
                }).then(function (records) {
                    var total = Math.ceil(records / rows);
                    models.serviciosrequeridos.findAll({
                        offset: parseInt(rows * (page - 1)),
                        limit: parseInt(rows),
                        //order: orden,
                        where: {
                            idsolicitudcotizacion: id
                        },
                        include: [{
                            model: models.solicitudcotizacion
                        },
                        {
                            model: models.servicio
                        },
                        {
                            model: models.documentoscotizacion
                        },
                        {
                            model: models.clasecriticidad
                        },
                        {
                            model: models.segmentoproveedor
                        }
                        ]
                    }).then(function (serviciosrequeridos) {
                        //logger.debug(solicitudcotizacion)
                        res.json({ records: records, total: total, page: page, rows: serviciosrequeridos });
                    }).catch(function (err) {
                        logger.error(err);
                        res.json({ error_code: 1 });
                    });
                })
            }
        });

    };

    exports.listaservicios = function (req, res) {

        var id = req.params.id;

        sequelize.query(
            'SELECT a.id, a.nombre ' +
            'FROM sip.servicio a ' +
            'join sip.plantillapresupuesto b on b.idservicio=a.id ' +
            'join sic.solicitudcotizacion c on c.idcui=b.idcui ' +
            'where c.id=:id',
            { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
        ).then(function (valores) {
            //logger.debug(valores)
            res.json(valores);
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });
    }

    exports.doctoasociado = function (req, res) {

        var id = req.params.id;

        sequelize.query(
            'SELECT a.id, a.nombrecorto ' +
            'FROM sic.documentoscotizacion a ' +
            'join sic.solicitudcotizacion b on a.idsolicitudcotizacion=b.id ' +
            'where b.id=:id',
            { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
        ).then(function (valores) {
            //logger.debug(valores)
            res.json(valores);
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });
    }

    exports.clasecriticidad = function (req, res) {

        models.clasecriticidad.findAll({

        }).then(function (valores) {
            //logger.debug(valores)
            res.json(valores);
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });
    }

    exports.segmentoproveedor = function (req, res) {

        models.segmentoproveedor.findAll({

        }).then(function (valores) {
            //logger.debug(valores)
            res.json(valores);
        }).catch(function (err) {
            logger.error(err);
            res.json({ error: 1 });
        });
    }

