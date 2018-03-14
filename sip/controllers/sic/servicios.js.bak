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

    if (action == "add" || action == "edit") {
        var iddocto = req.body.iddoctotecnico;
        if (iddocto == 0) {
            iddocto = null;
        }
    }



    switch (action) {
        case "add":
            models.serviciosrequeridos.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idservicio: req.body.idservicio,
                glosaservicio: req.body.glosaservicio,
                iddoctotecnico: iddocto,
                glosareferencia: req.body.glosareferencia,
                idclasecriticidad: req.body.idclasecriticidad,
                notacriticidad: req.body.notacriticidad,
                idsegmento: req.body.idsegmento,
                borrado: 1
            }).then(function (serviciosrequeridos) {

                sequelize.query(
                    'select b.calculado ' +
                    'from sic.serviciosrequeridos a ' +
                    'join sic.clasecriticidad b on a.idclasecriticidad=b.id ' +
                    'where a.id=:id',
                    { replacements: { id: serviciosrequeridos.id }, type: sequelize.QueryTypes.SELECT }
                ).then(function (valores) {
                    //logger.debug(valores)
                    if (valores[0].calculado != 0) {

                        sequelize.query(
                            'select a.* ' +
                            'from sic.desglosefactores a ' +
                            'where a.idclasecriticidad=:id',
                            { replacements: { id: req.body.idclasecriticidad }, type: sequelize.QueryTypes.SELECT }
                        ).then(function (factores) {
                            //logger.debug(valores)
                            //console.dir(factores)

                            for (var f in factores) {
                                //console.log(factores[f].nombrefactor);
                                models.factorescriticidad.create({
                                    idserviciorequerido: serviciosrequeridos.id,
                                    iddesglosefactores: factores[f].id,
                                    porcentaje: factores[f].porcentaje,
                                    nota: 0,
                                    valor: 0,
                                    observacion: "",
                                    borrado: 1
                                })
                            }
                        }).catch(function (err) {
                            logger.error(err);
                            res.json({ error: 1 });
                        });
                    } else {

                        sequelize.query(
                            'select a.nombre ' +
                            'from sic.valores a  ' +
                            'join sic.clasecriticidad b on a.id=b.idcolor ' +
                            'join sic.serviciosrequeridos d on d.idclasecriticidad=b.id ' +
                            'where d.id=:id ',
                            { replacements: { id: serviciosrequeridos.id }, type: sequelize.QueryTypes.SELECT }
                        ).then(function (colores) {
                            //logger.debug(valores)
                            //console.dir(factores)

                            console.dir(colores[0]);

                            var color = 'indefinido'
                            color = colores[0].nombre;

                            console.log("le ponis color: " + color);


                            models.serviciosrequeridos.update({
                                colornota: color,

                            }, {
                                    where: {
                                        id: serviciosrequeridos.id
                                    }
                                })

                        }).catch(function (err) {
                            logger.error(err);
                            res.json({ error: 1 });
                        });

                    }
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error: 1 });
                });

                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'serviciosrequeridos',
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
                res.json({ id: serviciosrequeridos.id, parent: req.body.idsolicitudcotizacion, message: 'Insertando', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });
            break;
        case "edit":

            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'serviciosrequeridos',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.serviciosrequeridos, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.serviciosrequeridos.update({
                            idservicio: req.body.idservicio,
                            glosaservicio: req.body.glosaservicio,
                            iddoctotecnico: iddocto,
                            glosareferencia: req.body.glosareferencia,
                            idclasecriticidad: req.body.idclasecriticidad,
                            notacriticidad: req.body.notacriticidad,
                            idsegmento: req.body.idsegmento
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (serviciosrequeridos) {

                                res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Actualizando', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                res.json({ id: 0, message: err.message, success: false });
                            });
                    } else {
                        logger.error("->>> " + err)
                    }

                });


            break;
        case "del":


            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'serviciosrequeridos',
                req.body.id, 'delete',
                req.session.passport.user,
                new Date(),
                models.serviciosrequeridos, function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.factorescriticidad.destroy({
                            where: {
                                idserviciorequerido: req.body.id
                            }
                        }).then(function (rowDeleted) {

                            models.serviciosrequeridos.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                // rowDeleted will return number of rows deleted

                                if (rowDeleted === 1) {


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
exports.desglosefactoreslist = function (req, res) {

    var id = req.params.id;

    var page = 1
    var rows = 10
    var filters = req.params.filters

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.factorescriticidad.belongsTo(models.desglosefactores, { foreignKey: 'iddesglosefactores' });

            models.factorescriticidad.count({
                where: {
                    idserviciorequerido: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.factorescriticidad.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idserviciorequerido: id
                    },
                    include: [{
                        model: models.desglosefactores
                    }
                    ]
                }).then(function (factorescriticidad) {
                    //logger.debug(solicitudcotizacion)
                    res.json({ records: records, total: total, page: page, rows: factorescriticidad });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
exports.proveedoressugeridoslist = function (req, res) {

    var id = req.params.id;

    var page = 1
    var rows = 10
    var filters = req.params.filters

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)
            models.proveedorsugerido.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

            models.proveedorsugerido.count({
                where: {
                    idserviciorequerido: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.proveedorsugerido.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: {
                        idserviciorequerido: id
                    },
                    include: [{
                        model: models.proveedor
                    }
                    ]
                }).then(function (proveedorsugerido) {
                    //logger.debug(solicitudcotizacion)
                    res.json({ records: records, total: total, page: page, rows: proveedorsugerido });
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
        'SELECT distinct a.id, a.nombre ' +
        'FROM sip.servicio a ' +
        'join sip.plantillapresupuesto b on b.idservicio=a.id ' +
        'join sic.solicitudcotizacion c on c.idcui=b.idcui ' +
        'where c.id=:id ' +
        'group by a.id, a.nombre ',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.proveedoressugeridostriada = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'SELECT distinct a.id, a.razonsocial ' +
        'FROM sip.proveedor a ' +
        'join sip.plantillapresupuesto b on b.idproveedor=a.id ' +
        'join sic.solicitudcotizacion c on c.idcui=b.idcui ' +
        'join sic.serviciosrequeridos d on d.idsolicitudcotizacion=c.id ' +
        'where d.id=:id and b.idservicio=d.idservicio ' +
        'group by a.id, a.razonsocial ',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.getcalculado = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select b.calculado ' +
        'from sic.serviciosrequeridos a ' +
        'join sic.clasecriticidad b on a.idclasecriticidad=b.id ' +
        'where a.id=:id',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.getcalculadoconclase = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select a.* ' +
        'from sic.clasecriticidad a  ' +
        'where a.id=:id',
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

exports.desgloseaction = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":

            break;
        case "edit":

            models.factorescriticidad.update({
                nota: req.body.nota,
                valor: req.body.valor,
                observacion: req.body.observacion
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (factorescriticidad) {

                    res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Actualizando', success: true });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ id: 0, message: err.message, success: false });
                });



            break;
        case "del":


            break;
    }
}

exports.proveedoressugeridosaction = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":

            models.proveedorsugerido.create({
                idserviciorequerido: req.body.parent_id,
                idproveedor: req.body.idproveedor,
                borrado: 1
            }).then(function (serviciosrequeridos) {

                res.json({ id: serviciosrequeridos.id, message: 'Agregado', success: true });

            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });

            break;
        case "edit":



            break;
        case "del":

            models.proveedorsugerido.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {

                res.json({ id: rowDeleted, message: 'Eliminado', success: true, error_code:0 });

            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });


            break;
    }
}


exports.actualizanotafactor = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'SELECT a.* ' +
        'FROM sic.factorescriticidad a ' +
        'join sic.serviciosrequeridos b on a.idserviciorequerido=b.id ' +
        'where b.id=:id',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (factores) {
        //logger.debug(valores)
        var notafinal = 0.0;
        for (var f in factores) {
            //console.log(factores[f].nombrefactor);
            notafinal = notafinal + (factores[f].valor);
        }
        models.serviciosrequeridos.update({
            notacriticidad: notafinal,

        }, {
                where: {
                    id: id
                }
            }).then(function (factorescriticidad) {
                res.json({ message: 'Actualizada la nota', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });

    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}
exports.getnotasdefactor = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select a.* ' +
        'from sic.valores a ' +
        'join sic.desglosenotas b on a.id=b.idnota ' +
        'join sic.factorescriticidad c on b.iddesglosefactores=c.iddesglosefactores ' +
        'where c.id=:id ',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}
exports.actualizacolorfactor = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select b.*, a.nombre, d.notacriticidad ' +
        'from sic.valores a ' +
        'join sic.desglosecolores b on a.id=b.idcolor ' +
        'join sic.serviciosrequeridos d on d.idclasecriticidad=b.idclasecriticidad ' +
        'where d.id=:id ' +
        'order by b.notainicial asc',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (colores) {
        var color = 'indefinido'
        for (var f in colores) {
            //console.log(factores[f].nombrefactor);
            if (colores[f].notacriticidad >= colores[f].notainicial && colores[f].notacriticidad < colores[f].notafinal) {
                color = colores[f].nombre;
            }
        }
        //logger.debug(valores)
        models.serviciosrequeridos.update({
            colornota: color,

        }, {
                where: {
                    id: id
                }
            }).then(function (factorescriticidad) {
                res.json({ message: 'Actualizado el color', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ id: 0, message: err.message, success: false });
            });
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

