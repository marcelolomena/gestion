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

    // var horaesperada = req.body.horaesperada;
    // var horareal = req.body.horareal;
    // logger.debug("ESTO ES UNA FECHA ESPERADA: " + req.body.fechaesperada);
    // logger.debug("ESTO ES UNA HORA ESPERADA: " + req.body.horaesperada);
    // logger.debug("ESTO ES UNA FECHA REAL: " + req.body.fechareal);
    // logger.debug("ESTO ES UNA HORA REAL: " + req.body.horareal);

    if (req.body.horaesperada != '') {
        var horaesperada = req.body.horaesperada;
    } else {
        var horaesperada = null;
    }

    if (req.body.horareal != '') {
        var horareal = req.body.horareal;
    } else {
        var horareal = null;
    }

    if (req.body.fechaesperada != '') {
        
        var d1 = new Date(req.body.fechaesperada)
        d1.setUTCHours(3);
        var fechaesperada = d1

    }

    if (req.body.fechareal != '') {
        var d2 = new Date(req.body.fechareal)
        d2.setUTCHours(3);
        var fechareal = d2;
    } else {
        var fechareal = null;
    }
    switch (action) {
        case "add":
            models.calendariosolicitud.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                descripcion: req.body.descripcion,
                fechaesperada: fechaesperada,
                observacion: req.body.observacion,
                idtiporesponsable: req.body.idtiporesponsable,
                borrado: 1,
                fechareal: fechareal,
                horaesperada: horaesperada,
                horareal: horareal
            }).then(function (calendariosolicitud) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'calendariosolicitud',
                    calendariosolicitud.id,
                    'insert',
                    req.session.passport.user,
                    new Date(),
                    models.calendariosolicitud,
                    function (err, data) {
                        if (!err) {
                            return res.json({ id: calendariosolicitud.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        } else {
                            logger.error(err)
                            return res.json({ id: calendariosolicitud.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                        }
                    });
            })

            /*
           
           
           
           var sql = `insert sic.calendariosolicitud values 
       (:idsolicitudcotizacion,:descripcion,:fechaesperada,
       :observacion,:idtiporesponsable,:borrado,:fechareal)
       `

           sequelize.query(sql,
               {
                   replacements: {
                       idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                       descripcion: req.body.descripcion,
                       fechaesperada: fechaesperada,
                       observacion: req.body.observacion,
                       idtiporesponsable: req.body.idtiporesponsable,
                       borrado: 1,
                       fechareal: fechareal
                   },
                   type: sequelize.QueryTypes.SELECT
               }
           ).then(function (serviciosrequeridos) {
              
               logger.debug("LA WEBADA:")
               console.dir(serviciosrequeridos);
               logger.debug("LA WEBADA 2:")
               console.dir(serviciosrequeridos.id);
               logger.debug("LA WEBADA 3:")
               console.dir(serviciosrequeridos[0].id);
               bitacora.registrar(
                   req.body.idsolicitudcotizacion,
                   'calendariosolicitud',
                   serviciosrequeridos.id,
                   'insert',
                   req.session.passport.user,
                   new Date(),
                   models.calendariosolicitud,
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
            */
            break;
        case "edit":

            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'calendariosolicitud',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.calendariosolicitud,
                function (err, data) {
                    if (!err) {
                        models.calendariosolicitud.update({
                            descripcion: req.body.descripcion,
                            fechaesperada: fechaesperada,
                            observacion: req.body.observacion,
                            idtiporesponsable: req.body.idtiporesponsable,
                            fechareal: fechareal,
                            horaesperada: horaesperada,
                            horareal: horareal
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (calendariosolicitud) {
                                return res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: 'Falla', success: false });
                            });

                    } else {
                        logger.error("->" + err)
                        return res.json({ message: err.message, success: false });
                    }
                });



            /*
            
            
            
                        var sql = `update sic.calendariosolicitud set 
                    descripcion = :descripcion,
                    fechaesperada = :fechaesperada,
                    observacion = :observacion,
                    idtiporesponsable = :idtiporesponsable,
                    fechareal = :fechareal 
                    where id = :id
                    `
            
                        sequelize.query(sql,
                            {
                                replacements: {
                                    descripcion: req.body.descripcion,
                                    fechaesperada: fechaesperada,
                                    observacion: req.body.observacion,
                                    idtiporesponsable: req.body.idtiporesponsable,
                                    fechareal: fechareal,
                                    id: req.body.id
                                },
                                type: sequelize.QueryTypes.SELECT
                            }
                        ).then(function (serviciosrequeridos) {
            
                            return res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Actualizando', success: true });
                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({ id: 0, message: err.message, success: false });
                        });
            
            */



            break;
        case "del":


            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'calendariosolicitud',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.calendariosolicitud, function (err, data) {
                    if (data) {

                        models.calendariosolicitud.destroy({
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

            models.calendariosolicitud.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.calendariosolicitud.belongsTo(models.valores, { foreignKey: 'idtiporesponsable' });
            models.calendariosolicitud.count({
                where: {
                    idsolicitudcotizacion: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.calendariosolicitud.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idsolicitudcotizacion: id
                    },
                    order: 'fechareal desc',
                    include: [
                        {
                            model: models.valores
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

exports.gettiporesponsable = function (req, res) {

    var sql = "select * from sic.valores where tipo='tiporesponsable' " +
        "and borrado=1 order by nombre";

    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};


