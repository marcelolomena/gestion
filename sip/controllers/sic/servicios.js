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
            models.solicitudcotizacion.findOne({
                    where: {
                        id: req.body.idsolicitudcotizacion
                    },
                    attributes: ['codigosolicitud']
                })
                .then(function (codigosi) {
                    var codigosic = codigosi.dataValues.codigosolicitud;

                    sequelize.query(
                        'SELECT COUNT (id) as cantidadservicios ' +
                        'FROM sic.serviciosrequeridos ' +
                        'WHERE idsolicitudcotizacion=:id', {
                            replacements: {
                                id: req.body.idsolicitudcotizacion
                            },
                            type: sequelize.QueryTypes.SELECT
                        }
                    ).then(function (cantidadserv) {
                        var cantserv = cantidadserv[0].cantidadservicios;
                        codigosic = codigosic + '.' + (cantserv + 1);

                        models.serviciosrequeridos.create({
                            idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                            idservicio: req.body.idservicio,
                            glosaservicio: req.body.glosaservicio,
                            iddoctotecnico: iddocto,
                            glosareferencia: req.body.glosareferencia,
                            idclasecriticidad: req.body.idclasecriticidad,
                            notacriticidad: req.body.notacriticidad,
                            idsegmento: req.body.idsegmento,
                            borrado: 1,
                            codigosic: codigosic
                        }).then(function (serviciosrequeridos) {

                            sequelize.query(
                                'select b.calculado ' +
                                'from sic.serviciosrequeridos a ' +
                                'join sic.clasecriticidad b on a.idclasecriticidad=b.id ' +
                                'where a.id=:id', {
                                    replacements: {
                                        id: serviciosrequeridos.id
                                    },
                                    type: sequelize.QueryTypes.SELECT
                                }
                            ).then(function (valores) {
                                //logger.debug(valores)
                                if (valores[0].calculado != 0) {

                                    sequelize.query(
                                        'select a.* ' +
                                        'from sic.desglosefactores a ' +
                                        'where a.idclasecriticidad=:id', {
                                            replacements: {
                                                id: req.body.idclasecriticidad
                                            },
                                            type: sequelize.QueryTypes.SELECT
                                        }
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
                                        return res.json({
                                            error: 1
                                        });
                                    });
                                } else {

                                    sequelize.query(
                                        'select a.nombre ' +
                                        'from sic.valores a  ' +
                                        'join sic.clasecriticidad b on a.id=b.idcolor ' +
                                        'join sic.serviciosrequeridos d on d.idclasecriticidad=b.id ' +
                                        'where d.id=:id ', {
                                            replacements: {
                                                id: serviciosrequeridos.id
                                            },
                                            type: sequelize.QueryTypes.SELECT
                                        }
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
                                        return res.json({
                                            error: 1
                                        });
                                    });

                                }
                            }).catch(function (err) {
                                logger.error(err);
                                return res.json({
                                    error: 1
                                });
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
                            return res.json({
                                id: serviciosrequeridos.id,
                                parent: req.body.idsolicitudcotizacion,
                                message: 'Insertando',
                                success: true
                            });
                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({
                                id: 0,
                                message: err.message,
                                success: false
                            });
                        });
                    }).catch(function (err) {
                        logger.error(err);
                        return res.json({
                            error: 1
                        });
                    });
                })
                .catch(function (err) {
                    return res.json({
                        error_code: 1
                    });
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
                models.serviciosrequeridos,
                function (err, data) {
                    if (data) {
                        logger.debug("->>> " + data)

                        models.serviciosrequeridos.update({
                            idservicio: req.body.idservicio,
                            glosaservicio: req.body.glosaservicio,
                            iddoctotecnico: iddocto,
                            glosareferencia: req.body.glosareferencia,
                            idclasecriticidad: req.body.idclasecriticidad,
                            notacriticidad: req.body.notacriticidad,
                            idsegmento: req.body.idsegmento,
                            codigosic: req.body.codigosic
                        }, {
                            where: {
                                id: req.body.id
                            }
                        }).then(function (serviciosrequeridos) {

                            return res.json({
                                id: req.body.id,
                                parent: req.body.idsolicitudcotizacion,
                                message: 'Actualizando',
                                success: true
                            });
                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({
                                id: 0,
                                message: err.message,
                                success: false
                            });
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
                models.serviciosrequeridos,
                function (err, data) {
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
                                return res.json({
                                    error: 0,
                                    glosa: ''
                                });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({
                                    id: 0,
                                    message: err.message,
                                    success: false
                                });
                            });
                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({
                                id: 0,
                                message: err.message,
                                success: false
                            });
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

    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "nombre";

    if (!sord)
        sord = "asc";

    var orden = "[servicio]." + sidx + " " + sord;




    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            //logger.debug(data)

            models.serviciosrequeridos.belongsTo(models.solicitudcotizacion, {
                foreignKey: 'idsolicitudcotizacion'
            });
            models.serviciosrequeridos.belongsTo(models.servicio, {
                foreignKey: 'idservicio'
            });
            models.serviciosrequeridos.belongsTo(models.documentoscotizacion, {
                foreignKey: 'iddoctotecnico'
            });
            models.serviciosrequeridos.belongsTo(models.clasecriticidad, {
                foreignKey: 'idclasecriticidad'
            });
            models.serviciosrequeridos.belongsTo(models.segmentoproveedor, {
                foreignKey: 'idsegmento'
            });
            models.serviciosrequeridos.count({
                where: {
                    idsolicitudcotizacion: id
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.serviciosrequeridos.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
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
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: serviciosrequeridos
                    });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error_code: 1
                    });
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
            models.factorescriticidad.belongsTo(models.desglosefactores, {
                foreignKey: 'iddesglosefactores'
            });

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
                    }]
                }).then(function (factorescriticidad) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: factorescriticidad
                    });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error_code: 1
                    });
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
            models.proveedorsugerido.belongsTo(models.proveedor, {
                foreignKey: 'idproveedor'
            });

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
                    }]
                }).then(function (proveedorsugerido) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: proveedorsugerido
                    });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error_code: 1
                    });
                });
            })
        }
    });

};


exports.listaservicios = function (req, res) {

    var id = req.params.id;
    sequelize.query(
        'select tipocontrato from sic.solicitudcotizacion ' +
        'where id =:id ', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (tipocontrato) {

        console.dir(tipocontrato[0]);
        var tipocontra = ''
        var tcontrato1 = 'Proyecto'
        var tcontrato2 = 'Continuidad'
        tipocontra = tipocontrato[0].tipocontrato;
        console.dir("ESTO ES UN TIPO DE CONTRATO: " + tipocontra)
        if (tipocontra == 1) {
            console.dir("ESTOY ES CONTINUIDAD")
            sequelize.query(
                "SELECT distinct a.id, a.nombre " +
                "FROM sip.servicio a " +
                "join sip.plantillapresupuesto b on b.idservicio=a.id " +
                "join sic.solicitudcotizacion c on c.idcui=b.idcui " +
                "where c.id=:id and a.tiposervicio = 'Continuidad' " +
                "group by a.id, a.nombre ", {
                    replacements: {
                        id: id
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            ).then(function (valores) {
                logger.debug(valores)
                return res.json(valores);
            }).catch(function (err) {
                logger.error(err);
                return res.json({
                    error: 1
                });
            });
        } else {
            console.dir("ESTOY EN PROYECTO")
            sequelize.query(
                "SELECT distinct a.id, a.nombre " +
                "FROM sip.servicio a " +
                "join sip.plantillapresupuesto b on b.idservicio=a.id " +
                "join sic.solicitudcotizacion c on c.idcui=b.idcui " +
                "where c.id=:id and a.tiposervicio = 'Proyecto' " +
                "group by a.id, a.nombre ", {
                    replacements: {
                        id: id
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            ).then(function (valores) {
                logger.debug(valores)
                return res.json(valores);
            }).catch(function (err) {
                logger.error(err);
                return res.json({
                    error: 1
                });
            });
        }
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });


    /*
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
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error: 1 });
    });
    */
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
        'group by a.id, a.razonsocial ', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}

exports.getcalculado = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select b.calculado ' +
        'from sic.serviciosrequeridos a ' +
        'join sic.clasecriticidad b on a.idclasecriticidad=b.id ' +
        'where a.id=:id', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}

exports.getcalculadoconclase = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select a.* ' +
        'from sic.clasecriticidad a  ' +
        'where a.id=:id', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}

exports.doctoasociado = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'SELECT a.id, a.nombrecorto ' +
        'FROM sic.documentoscotizacion a ' +
        'join sic.solicitudcotizacion b on a.idsolicitudcotizacion=b.id ' +
        'where b.id=:id', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}

exports.clasecriticidad = function (req, res) {

    models.clasecriticidad.findAll({

    }).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}


exports.desglosefactoraction = function (req, res) {
    var action = req.body.oper;
    var idproveedor = req.params.id;
    var idsolicitudcotizacion = req.params.idpadre;

    switch (action) {
        case "add":

            break;
        case "edit":
            bitacora.registrarhijo(
                idsolicitudcotizacion,
                'factorescriticidad',
                req.body.id,
                'update',
                req.session.passport.user,
                new Date(),
                models.factorescriticidad,
                function (err, data) {
                    if (!err) {
                        models.factorescriticidad.update({
                            nota: req.body.nota,
                            valor: req.body.valor,
                            observacion: req.body.observacion
                        }, {
                            where: {
                                id: req.body.id
                            }
                        }).then(function (factorescriticidad) {
                            return res.json({
                                id: req.body.id,
                                parent: idsolicitudcotizacion,
                                message: 'Inicio carga',
                                success: true
                            });
                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({
                                message: err.message,
                                success: false
                            });
                        });
                    } else {
                        logger.error(err)
                        return res.json({
                            message: err.message,
                            success: false
                        });
                    }
                });
            break;
        case "del":


            break;
    }
}

exports.proveedoressugeridosaction = function (req, res) {
    var action = req.body.oper;
    var idproveedor = req.params.id;
    var idsolicitudcotizacion = req.params.idpadre;
    // var idclaseevaluaciontecnica = req.body.idclaseevalutec;
    switch (action) {
        case "add":
            models.proveedorsugerido.findOne({
                    where: {
                        idproveedor: req.body.idproveedor,
                        idserviciorequerido: req.body.parent_id
                    },
                    attributes: ['id']
                })
                .then(function (exist) {
                    if (!exist) {
                        models.proveedorsugerido.create({
                            idserviciorequerido: req.body.parent_id,
                            idproveedor: req.body.idproveedor,
                            borrado: 1
                        }).then(function (proveedorsugerido) {
                            bitacora.registrarhijo(
                                idsolicitudcotizacion,
                                'proveedorsugerido',
                                proveedorsugerido.id,
                                'insert',
                                req.session.passport.user,
                                new Date(),
                                models.proveedorsugerido,
                                function (err, data) {
                                    if (!err) {
                                        return res.json({
                                            id: proveedorsugerido.id,
                                            parent: idsolicitudcotizacion,
                                            message: 'Inicio carga',
                                            success: true
                                        });
                                    } else {
                                        logger.error(err)
                                        return res.json({
                                            id: proveedorsugerido.id,
                                            parent: idsolicitudcotizacion,
                                            message: 'Falla',
                                            success: false
                                        });
                                    }
                                });
                            //console.log('ESTO ES EL ID DE CLASE DE EVALUACION TECNICA: ' + req.body.claseevaluaciontecnica);
                            sequelize.query('select niveles ' +
                                'from sic.claseevaluaciontecnica ' +
                                'where id=:id ', {
                                    replacements: {
                                        id: req.body.idclaseevalutec
                                    },
                                    type: sequelize.QueryTypes.SELECT
                                }
                            ).then(function (lv) {
                                if (lv[0].niveles != 0) {
                                    // console.log("ESTAMOS POR BORRAR TODO!")
                                    //console.log("ESTO ES UNA IDSOLICITUD!: " + idsolicitudcotiza)
                                    //console.log("ESTO ES UN ISERVICIOREQUERIDO:! " + req.body.id)
                                    // sequelize.query('EXECUTE sic.EliminaNotaEvaluacionTecnica ' + idsolicitudcotiza + ',' + req.body.id)
                                    // console.log("YA TE BORRE TODO!")
                                    if (lv[0].niveles == 1) {
                                        sequelize.query('select b.id as idservicio, c.id as idcrite, a.idproveedor, c.comentario ' +
                                            'from sic.proveedorsugerido a ' +
                                            'join sic.serviciosrequeridos b on a.idserviciorequerido = b.id ' +
                                            'join sic.criterioevaluacion c on c.idclaseevaluaciontecnica = b.claseevaluaciontecnica ' +
                                            'join sic.solicitudcotizacion d on d.id = b.idsolicitudcotizacion ' +
                                            'where d.id=:id and a.idproveedor=:idproveedor ', {
                                                replacements: {
                                                    id: idsolicitudcotizacion,
                                                    idproveedor: req.body.idproveedor
                                                },
                                                type: sequelize.QueryTypes.SELECT
                                            }
                                        ).then(function (criterioevaluacion) {
                                            insertanotaevaluaciontecnica(criterioevaluacion).then(function (algo) {
                                                logger.debug(algo)
                                            })
                                        }).catch(function (err) {
                                            logger.error(err);
                                            return res.json({
                                                error: 1
                                            });
                                        });
                                    } else {
                                        if (lv[0].niveles == 2) {
                                            sequelize.query('select b.id as idservicio, c.id as idcrite, a.idproveedor, c.comentario ' +
                                                'from sic.proveedorsugerido a ' +
                                                'join sic.serviciosrequeridos b on a.idserviciorequerido = b.id ' +
                                                'join sic.criterioevaluacion c on c.idclaseevaluaciontecnica = b.claseevaluaciontecnica ' +
                                                'join sic.solicitudcotizacion d on d.id = b.idsolicitudcotizacion ' +
                                                'where d.id=:id and a.idproveedor=:idproveedor ', {
                                                    replacements: {
                                                        id: idsolicitudcotizacion,
                                                        idproveedor: req.body.idproveedor
                                                    },
                                                    type: sequelize.QueryTypes.SELECT
                                                }
                                            ).then(function (criterioevaluacion) {
                                                insertanotaevaluaciontecnica(criterioevaluacion).then(function (algo) {
                                                    logger.debug(algo)
                                                    insertanotaevaluaciontecnica2(idsolicitudcotiza).then(function (algomas) {
                                                        logger.debug(algomas)

                                                    })
                                                })
                                            }).catch(function (err) {
                                                logger.error(err);
                                                return res.json({
                                                    error: 1
                                                });
                                            });
                                        } else {
                                            console.log('ESTOY DENTRO SI ES NIVEL 3: ' + lv[0].niveles)
                                            sequelize.query('select b.id as idservicio, c.id as idcrite, a.idproveedor, c.comentario ' +
                                                'from sic.proveedorsugerido a ' +
                                                'join sic.serviciosrequeridos b on a.idserviciorequerido = b.id ' +
                                                'join sic.criterioevaluacion c on c.idclaseevaluaciontecnica = b.claseevaluaciontecnica ' +
                                                'join sic.solicitudcotizacion d on d.id = b.idsolicitudcotizacion ' +
                                                'where d.id=:id and a.idproveedor=:idproveedor ', {
                                                    replacements: {
                                                        id: idsolicitudcotizacion,
                                                        idproveedor: req.body.idproveedor
                                                    },
                                                    type: sequelize.QueryTypes.SELECT
                                                }
                                            ).then(function (criterioevaluacion) {
                                                insertanotaevaluaciontecnica(criterioevaluacion).then(function (algo) {
                                                    logger.debug(algo)
                                                    insertanotaevaluaciontecnica2(idsolicitudcotiza).then(function (algomas) {
                                                        logger.debug(algomas)

                                                    })
                                                })
                                            }).catch(function (err) {
                                                logger.error(err);
                                                return res.json({
                                                    error: 1
                                                });
                                            });
                                        }
                                    }
                                } else {
                                    logger.error(err)
                                    return res.json({
                                        message: err.message,
                                        success: false
                                    });
                                }
                            }).catch(function (err) {
                                logger.error(err);
                                return res.json({
                                    error: 1
                                });
                            });
                            // res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                        }).catch(function (err) {
                            logger.error(err)
                            res.json({
                                error: 1,
                                glosa: err.message
                            });
                        });
                    }
                })
                .catch(function (err) {
                    return res.json({
                        error_code: 1
                    });
                });
            break;
        case "edit":
            break;
        case "del":
            models.proveedorsugerido.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (proveedorsugerido) {
                bitacora.registrarhijo(
                    idsolicitudcotizacion,
                    'proveedorsugerido',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.proveedorsugerido,
                    function (err, data) {
                        if (!err) {
                            models.proveedorsugerido.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {

                                sequelize.query(`DELETE e FROM sic.notaevaluaciontecnica a
                                JOIN sic.serviciosrequeridos b on a.idserviciorequerido = b.id
                                JOIN sic.solicitudcotizacion c on c.id = b.idsolicitudcotizacion
                                JOIN sic.notaevaluaciontecnica2 d on d.idnotaevaluaciontecnica = a.id
                                JOIN sic.notaevaluaciontecnica3 e on e.idnotaevaluaciontecnica2 = d.id
                                WHERE b.id=:idserv and c.id=:idcoti and a.idproveedor=:idproveed
                                
                                DELETE d FROM sic.notaevaluaciontecnica a
                                JOIN sic.serviciosrequeridos b on a.idserviciorequerido = b.id
                                JOIN sic.solicitudcotizacion c on c.id = b.idsolicitudcotizacion
                                JOIN sic.notaevaluaciontecnica2 d on d.idnotaevaluaciontecnica = a.id
                                WHERE b.id=:idserv and c.id=:idcoti and a.idproveedor=:idproveed
                            
                                DELETE a FROM sic.notaevaluaciontecnica a
                                JOIN sic.serviciosrequeridos b on a.idserviciorequerido = b.id
                                JOIN sic.solicitudcotizacion c on c.id = b.idsolicitudcotizacion
                                WHERE b.id=:idserv and c.id=:idcoti and a.idproveedor=:idproveed `, {
                                    replacements: {
                                        idcoti: idsolicitudcotizacion,
                                        idserv: proveedorsugerido[0].idserviciorequerido,
                                        idproveed: proveedorsugerido[0].idproveedor
                                    },
                                    type: sequelize.QueryTypes.SELECT
                                })
                                return res.json({
                                    message: '',
                                    sucess: true
                                });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({
                                    message: err.message,
                                    success: false
                                });
                            });
                        } else {
                            logger.error(err)
                            return res.json({
                                message: err.message,
                                success: false
                            });
                        }
                    });
            }).catch(function (err) {
                logger.error(err);
                res.json({
                    message: err.message,
                    success: false
                });
            });
            break;
    }
}

var insertanotaevaluaciontecnica = function (criterioevaluacion) {
    logger.debug("ENTRAMOS AL INSERTANOTA")
    return new Promise(function (resolve, reject) {
        try {
            var promesas = []

            logger.debug("LARGOOOOOOOOOOOOOOOO " + criterioevaluacion.length)
            //models.sequelize.transaction({ autocommit: true }, function (t) {
            for (var c in criterioevaluacion) {
                var newPromise = models.notaevaluaciontecnica.create({
                    idserviciorequerido: criterioevaluacion[c].idservicio,
                    idcriterioevaluacion: criterioevaluacion[c].idcrite,
                    idproveedor: criterioevaluacion[c].idproveedor,
                    nota: 0,
                    comentario: criterioevaluacion[c].comentario,
                    borrado: 1
                }) //, { transaction: t });

                promesas.push(newPromise);

            }

            //logger.debug("ESTO ES UNA SOLICITUD DE COTIZACION PARA EL SEGUNDO CICLO" + idsolicitudcotiza)


            logger.debug("ejecutando promesas")
            Promise.all(promesas);

            resolve("ESTO ES UN OK FINAL");
        } catch (err) {
            logger.debug("cago altiro 1")
            reject(err);
        }
    })
}

var insertanotaevaluaciontecnica2 = function (idsolicitudcotiza) {
    logger.debug("ENTRAMOS AL INSERTANOTA CON ID " + idsolicitudcotiza)
    return new Promise(function (resolve, reject) {
        try {
            var promesas = []
            var querynota2 =
                `
            SELECT f.id as idnota, e.id as idcriterio2, a.idproveedor, e.comentario 
                FROM sic.proveedorsugerido a 
                JOIN sic.serviciosrequeridos b on a.idserviciorequerido = b.id 
                JOIN sic.criterioevaluacion c on c.idclaseevaluaciontecnica = b.claseevaluaciontecnica 
                JOIN sic.solicitudcotizacion d on d.id = b.idsolicitudcotizacion 
                JOIN sic.criterioevaluacion2 e on e.idcriterioevaluacion = c.id 
                JOIN sic.notaevaluaciontecnica f on b.id = f.idserviciorequerido and c.id= f.idcriterioevaluacion and a.idproveedor = f.idproveedor 
                WHERE d.id=:idsolicitudcotiza
                `


            sequelize.query(querynota2, {
                replacements: {
                    idsolicitudcotiza: idsolicitudcotiza
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (resultado) {
                logger.debug("estamos en la nota 2")
                //logger.debug("querynota2:" + querynota2);
                logger.debug("LARGOOOOOOOOOOOOOOOO DEL CICLO 2 " + resultado.length)
                console.dir(resultado)

                for (var d in resultado) {
                    logger.debug("ESTO ES UN IDNOTAEVA: " + resultado[d].idnota)
                    logger.debug("ESTO ES UN IDCRITERIO2: " + resultado[d].idcriterio2)
                    logger.debug("ESTO ES UN IDPROVEEDOR: " + resultado[d].idproveedor)
                    var newPromise = models.notaevaluaciontecnica2.create({
                        idnotaevaluaciontecnica: resultado[d].idnota,
                        idcriterioevaluacion2: resultado[d].idcriterio2,
                        idproveedor: resultado[d].idproveedor,
                        nota: 0,
                        comentario: resultado[d].comentario,
                        borrado: 1
                    }) //, { transaction: t });
                    promesas.push(newPromise);
                }
                Promise.all(promesas);
            })
            resolve("ESTO ES UN OK FINAL");

        } catch (err) {
            logger.debug("cago altiro 2")
            reject(err);
        }
    })
}

exports.actualizanotafactor = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'SELECT a.* ' +
        'FROM sic.factorescriticidad a ' +
        'join sic.serviciosrequeridos b on a.idserviciorequerido=b.id ' +
        'where b.id=:id', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
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
            return res.json({
                message: 'Actualizada la nota',
                success: true
            });
        }).catch(function (err) {
            logger.error(err)
            return res.json({
                id: 0,
                message: err.message,
                success: false
            });
        });

    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}
exports.getnotasdefactor = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select a.* ' +
        'from sic.valores a ' +
        'join sic.desglosenotas b on a.id=b.idnota ' +
        'join sic.factorescriticidad c on b.iddesglosefactores=c.iddesglosefactores ' +
        'where c.id=:id ' +
        'order by nombre asc', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
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
        'order by b.notainicial asc', {
            replacements: {
                id: id
            },
            type: sequelize.QueryTypes.SELECT
        }
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
            return res.json({
                message: 'Actualizado el color',
                success: true
            });
        }).catch(function (err) {
            logger.error(err)
            return res.json({
                id: 0,
                message: err.message,
                success: false
            });
        });
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}

exports.getjustificacion = function (req, res) {

    var nombrefactor = req.params.nombrefactor;
    var nota = req.params.nota;
    sequelize.query(
        'select e.nombrenota ' +
        'from sic.factorescriticidad a ' +
        'join sic.serviciosrequeridos b on a.idserviciorequerido = b.id ' +
        'join sic.desglosefactores c on a.iddesglosefactores = c.id ' +
        'join sic.clasecriticidad d on c.idclasecriticidad = d.id ' +
        'join sic.desglosenotas e on e.iddesglosefactores = c.id ' +
        'join sic.valores f on f.id = e.idnota ' +
        'where c.nombrefactor=:nombrefactor and f.nombre=:nota', {
            replacements: {
                nombrefactor: nombrefactor,
                nota: nota
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({
            error: 1
        });
    });
}

exports.existeClase = function (req, res) {

    models.serviciosrequeridos.findAll({
        // order: 'id ASC',
        attributes: ['id', 'claseevaluaciontecnica'],
        where: {
            idsolicitudcotizacion: req.params.id
        },
    }).then(function (existe) {
        return res.json(existe);
    }).catch(function (err) {
        logger.error(err);
        res.json({
            error: 1
        });
    });
}