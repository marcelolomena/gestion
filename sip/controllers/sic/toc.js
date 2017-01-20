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
            models.tipoclausula.create({
                nombre: req.body.nombre,
                borrado: 1
            }).then(function (clase) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.tipoclausula.update({
                nombre: req.body.nombre
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (tipoclausula) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });
            break;
        case "del":
            models.tipoclausula.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;

    }
}

exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "nombre";

    if (!sord)
        sord = "asc";

    var orden = "[tipoclausula]." + sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (data) {
            //logger.debug(data)
            models.tipoclausula.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.tipoclausula.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (tipoclausula) {
                    //logger.debug(solicitudcotizacion)
                    res.json({ records: records, total: total, page: page, rows: tipoclausula });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};

exports.list2 = function (req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "secuencia";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idtipoclausula",
        "op": "eq",
        "data": req.params.id
    }, {
        "field": "idplantillaclausula",
        "op": "eq",
        "data": null
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            //logger.debug("->>> " + err)
        } else {
            models.toc.count({
                where: data
            }).then(function (records) {
                logger.debug("records: " + records);
                var total = Math.ceil(records / rows);
                logger.debug("total: " + total);
                models.toc.belongsTo(models.clase, { foreignKey: 'idclase' });
                models.toc.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.clase
                    }
                    ]
                }).then(function (toc) {
                    res.json({ records: records, total: total, page: page, rows: toc });
                }).catch(function (err) {
                    //logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};

exports.action2 = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            sequelize.query(
                "select a.* " +
                "from sic.toc a " +
                "where a.idtipoclausula = " + req.body.parent_id + " and a.idplantillaclausula is null order by a.secuencia ",
                { type: sequelize.QueryTypes.SELECT }
            ).then(function (secuencias) {
                var yaloencontre = false
                for (i in secuencias) {
                    if (!yaloencontre) {
                        if (secuencias[i].secuencia == req.body.secuencia) {
                            yaloencontre = true;
                            models.toc.update({
                                secuencia: secuencias[i].secuencia + 1,
                            }, {
                                    where: {
                                        id: secuencias[i].id
                                    }
                                }).then(function (toc) {
                                    logger.debug('Cambio uno');
                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ error: 1, glosa: err.message });
                                });

                        }
                    } else {
                        models.toc.update({
                            secuencia: secuencias[i].secuencia + 1,
                        }, {
                                where: {
                                    id: secuencias[i].id
                                }
                            }).then(function (toc) {
                                logger.debug('Cambio otro');
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ error: 1, glosa: err.message });
                            });

                    }
                }
            }).catch(function (err) {
                logger.error(err)
                return res.json({ error: 1, glosa: err.message });
            });


            models.toc.create({
                idtipoclausula: req.body.parent_id,
                idclase: req.body.idclase,
                secuencia: req.body.secuencia,
                borrado: 1
            }).then(function (toc) {
                return res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ error: 1, glosa: err.message });
            });
            break;
        case "edit":
            sequelize.query(
                "select a.* " +
                "from sic.toc a " +
                "where a.id= " + req.body.id + " ",
                { type: sequelize.QueryTypes.SELECT }
            ).then(function (secuenciainicial) {

                sequelize.query(
                    "select a.* " +
                    "from sic.toc a " +
                    "where a.idtipoclausula = " + secuenciainicial[0].idtipoclausula + " and a.idplantillaclausula is null and id <> " + secuenciainicial[0].id + " order by a.secuencia",
                    { type: sequelize.QueryTypes.SELECT }
                ).then(function (secuencias) {
                    var yaloencontre = false
                    for (i in secuencias) {
                        if (!yaloencontre) {
                            if (secuencias[i].secuencia == req.body.secuencia) {
                                yaloencontre = true;
                                models.toc.update({
                                    secuencia: secuencias[i].secuencia + 1,
                                }, {
                                        where: {
                                            id: secuencias[i].id
                                        }
                                    }).then(function (toc) {
                                        logger.debug('Cambio uno');
                                    }).catch(function (err) {
                                        logger.error(err)
                                        return res.json({ error: 1, glosa: err.message });
                                    });

                            }
                        } else {
                            models.toc.update({
                                secuencia: secuencias[i].secuencia + 1,
                            }, {
                                    where: {
                                        id: secuencias[i].id
                                    }
                                }).then(function (toc) {
                                    logger.debug('Cambio otro');
                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ error: 1, glosa: err.message });
                                });

                        }
                    }
                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ error: 1, glosa: err.message });
                });

                models.toc.update({
                    secuencia: req.body.secuencia,
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (toc) {
                        return res.json({ error: 0, glosa: '' });
                    }).catch(function (err) {
                        logger.error(err)
                        return res.json({ error: 1, glosa: err.message });
                    });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ error: 1, glosa: err.message });
            });
            break;
        case "del":
            sequelize.query(
                "select count(*) as hijos " +
                "from sic.toc a " +
                "where a.idclase = (select b.idclase from sic.toc b where id=" + req.body.id + ") and a.idtipoclausula=(select b.idtipoclausula from sic.toc b where id=" + req.body.id + ")  and a.idplantillaclausula is not null",
                { type: sequelize.QueryTypes.SELECT }
            ).then(function (plantillas) {
                logger.debug("resultado: " + plantillas[0].hijos)
                if (plantillas[0].hijos > 0) {
                    return res.json({ error_code: 1, glosa: "Existen plantillas asociadas a esta clase" });
                }
                models.toc.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                    if (rowDeleted === 1) {
                        logger.debug('Deleted successfully');
                    }
                    return res.json({ error_code: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ error_code: 1, glosa: err.message });
                });

            }).catch(function (err) {
                logger.error(err)
                return res.json({ error_code: 1, glosa: err.message });
            });

            break;

    }
}

exports.list3 = function (req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "secuencia";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idtipoclausula",
        "op": "eq",
        "data": req.params.idtipoclausula
    }, {
        "field": "idclase",
        "op": "eq",
        "data": req.params.idclase
    }, {
        "field": "idplantillaclausula",
        "op": "ne",
        "data": null
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            //logger.debug("->>> " + err)
        } else {
            models.toc.count({
                where: data
            }).then(function (records) {
                logger.debug("records: " + records);
                var total = Math.ceil(records / rows);
                logger.debug("total: " + total);

                models.toc.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
                models.toc.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.plantillaclausula
                    }
                    ]
                }).then(function (toc) {
                    return res.json({ records: records, total: total, page: page, rows: toc });
                }).catch(function (err) {
                    //logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });

};

exports.action3 = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":

            models.toc.findAll({
                where: {
                    id: req.body.parent_id
                }
            }).then(function (toc) {

                sequelize.query(
                    "select a.* " +
                    "from sic.toc a " +
                    "where a.idtipoclausula = " + toc[0].idtipoclausula + " and a.idclase = " + toc[0].idclase + " and a.idplantillaclausula is not null order by a.secuencia ",
                    { type: sequelize.QueryTypes.SELECT }
                ).then(function (secuencias) {
                    var yaloencontre = false
                    for (i in secuencias) {
                        if (!yaloencontre) {
                            if (secuencias[i].secuencia == req.body.secuencia) {
                                yaloencontre = true;
                                models.toc.update({
                                    secuencia: secuencias[i].secuencia + 1,
                                }, {
                                        where: {
                                            id: secuencias[i].id
                                        }
                                    }).then(function (toc) {
                                        logger.debug('Cambio uno');
                                    }).catch(function (err) {
                                        logger.error(err)
                                        return res.json({ error: 1, glosa: err.message });
                                    });

                            }
                        } else {
                            models.toc.update({
                                secuencia: secuencias[i].secuencia + 1,
                            }, {
                                    where: {
                                        id: secuencias[i].id
                                    }
                                }).then(function (toc) {
                                    logger.debug('Cambio otro');
                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ error: 1, glosa: err.message });
                                });

                        }
                    }
                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ error: 1, glosa: err.message });
                });

                models.toc.create({
                    idtipoclausula: toc[0].idtipoclausula,
                    idclase: toc[0].idclase,
                    idplantillaclausula: req.body.idplantillaclausula,
                    secuencia: req.body.secuencia,
                    borrado: 1
                }).then(function (tocfinal) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });

            }).catch(function (err) {
                //logger.error(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":

            sequelize.query(
                "select a.* " +
                "from sic.toc a " +
                "where a.id= " + req.body.id + " ",
                { type: sequelize.QueryTypes.SELECT }
            ).then(function (secuenciainicial) {

                sequelize.query(
                    "select a.* " +
                    "from sic.toc a " +
                    "where a.idtipoclausula = " + secuenciainicial[0].idtipoclausula + " and a.idclase = " + secuenciainicial[0].idclase + " and a.idplantillaclausula is not null and id <> " + secuenciainicial[0].id + " order by a.secuencia",
                    { type: sequelize.QueryTypes.SELECT }
                ).then(function (secuencias) {
                    var yaloencontre = false
                    for (i in secuencias) {
                        if (!yaloencontre) {
                            if (secuencias[i].secuencia == req.body.secuencia) {
                                yaloencontre = true;
                                models.toc.update({
                                    secuencia: secuencias[i].secuencia + 1,
                                }, {
                                        where: {
                                            id: secuencias[i].id
                                        }
                                    }).then(function (toc) {
                                        logger.debug('Cambio uno');
                                    }).catch(function (err) {
                                        logger.error(err)
                                        return res.json({ error: 1, glosa: err.message });
                                    });

                            }
                        } else {
                            models.toc.update({
                                secuencia: secuencias[i].secuencia + 1,
                            }, {
                                    where: {
                                        id: secuencias[i].id
                                    }
                                }).then(function (toc) {
                                    logger.debug('Cambio otro');
                                }).catch(function (err) {
                                    logger.error(err)
                                    return res.json({ error: 1, glosa: err.message });
                                });

                        }
                    }
                }).catch(function (err) {
                    logger.error(err)
                    return res.json({ error: 1, glosa: err.message });
                });

                models.toc.update({
                    secuencia: req.body.secuencia,
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (toc) {
                        return res.json({ error: 0, glosa: '' });
                    }).catch(function (err) {
                        logger.error(err)
                        return res.json({ error: 1, glosa: err.message });
                    });
            }).catch(function (err) {
                logger.error(err)
                return res.json({ error: 1, glosa: err.message });
            });

            break;
        case "del":
            models.toc.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;

    }
}

exports.getclasestoc = function (req, res) {

    var idtipo = req.params.id;

    sequelize.query(
        'select a.* ' +
        'from sic.clase a ' +
        "where a.id not in (select b.idclase from sic.toc b where idtipoclausula= " + idtipo + " and idplantillaclausula is null )",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.getclausulastoc = function (req, res) {

    var id = req.params.id;


    sequelize.query(
        'select a.* ' +
        'from sic.plantillaclausula a ' +
        "where a.id not in (select b.idplantillaclausula from sic.toc b where idclase= (select idclase from sic.toc where id=" + id + ") and idplantillaclausula is not null and idtipoclausula= (select idtipoclausula from sic.toc where id=" + id + ")) and idclase = (select idclase from sic.toc where id=" + id + ") ",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.gettipoclausula = function (req, res) {

    sequelize.query(
        'select a.* ' +
        'from sic.valores a ' +
        "where a.tipo='tipoclausula' ",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.download = function (req, res) {

    models.plantillaclausula.findAll({
        order: 'codigo ASC',
        //attributes: ['texto'],
        where: { idgrupo: req.params.id },
        /*
        include: [{
            model: models.plantillaclausula
        }]
        */
    }).then(function (clausulas) {

        //console.dir(clausulas);

        var result = '<html><body>'

        for (var f in clausulas) {

            var code = clausulas[f].codigo
            if (!code) {
                throw new Error("No es posible generar el documento.")
            }

            var level = code.split(".");
            var nombrecorto = clausulas[f].nombrecorto;

            //console.dir("los niveles oe: "+level)

            if (parseInt(level[0]) > 0 && parseInt(level[1]) == 0)
                result += '<h1>' + nombrecorto + '</h1>'
            else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0)
                result += '<h2>' + nombrecorto + '</h2>'



            result += clausulas[f].glosaclausula
        }

        result += '</html></body>'

        var hdr = 'attachment; filename=RTF_' + Math.floor(Date.now()) + '.doc'
        res.setHeader('Content-disposition', hdr);
        res.set('Content-Type', 'application/msword;charset=utf-8');
        res.status(200).send(result);

    }).catch(function (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
    });

}

exports.buscarsecuenciatoc = function (req, res) {

    var idtipo = req.params.idtipo;

    sequelize.query(
        "select a.secuencia " +
        "from sic.toc a " +
        "where a.idtipoclausula = " + idtipo + " and a.idplantillaclausula is null order by a.secuencia ",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.buscarsecuenciatocplantilla = function (req, res) {

    var idtipo = req.params.idtipo;
    var idclase = req.params.idclase;

    sequelize.query(
        "select a.secuencia " +
        "from sic.toc a " +
        "where a.idtipoclausula = " + idtipo + " and idclase = " + idclase + "and a.idplantillaclausula is not null order by a.secuencia ",
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}