var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var nodeExcel = require('excel-export');
var async = require('async');
var csv = require('csv');
var co = require('co');
var bulk = require("../../utils/bulk");
var nodeExcel = require('excel-export');

exports.action = function (req, res) {
    var action = req.body.oper;

    logger.debug("----------->> " + req.body.idsolicitudcotizacion)

    switch (action) {
        case "add":
            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'preguntasdelproveedor',
                req.body.id,
                'insert',
                req.session.passport.user,
                new Date(),
                models.preguntaproveedor,
                function (err, data) {
                    if (!err) {
                        return res.json({ id: req.body.idsolicitudcotizacion, idproveedor: req.body.idproveedor, success: true });
                    } else {
                        logger.error(err)
                        return res.json({ id: preguntaproveedor.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                    }
                });
            break;
        case "del":
            models.preguntaproveedor.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (preguntaproveedor) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'preguntasdelproveedor',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.preguntaproveedor,
                    function (err, data) {
                        if (!err) {
                            models.preguntaproveedor.destroy({
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (rowDeleted) {
                                return res.json({ message: '', success: true });
                            }).catch(function (err) {
                                logger.error(err)
                                return res.json({ message: err.message, success: false });

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

exports.asignar = function (req, res) {
    bitacora.registrar(
        req.body.idsolicitudcotizacion,
        'asignarpreguntas',
        req.body.id,
        'asignar',
        req.session.passport.user,
        new Date(),
        models.preguntaproveedor,
        function (err, data) {
            if (!err) {
                models.preguntaproveedor.update({
                    idresponsable: req.body.idresponsable,
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (preguntaproveedor) {
                        return res.json({ message: 'Exito', success: true });
                    }).catch(function (err) {
                        logger.error(err)
                        return res.json({ message: err.message, success: false });
                    });
            }
        }
    )
}

exports.responder = function (req, res) {
    bitacora.registrar(
        req.body.idsolicitudcotizacion,
        'respuestaspreguntas',
        req.body.id,
        'respuesta',
        req.session.passport.user,
        new Date(),
        models.preguntaproveedor,
        function(err, data){
            if(!err){
                models.preguntaproveedor.update({
                    respuesta: req.body.respuesta,
            },{ where: {
                    id: req.body.id
                }

                }).then(function(preguntaproveedor){
                    return res.json({ message: 'Exito', success: true

                    });
                }).catch(function(err){
                    logger.error(err)
                    return res.json({
                        message: err.message, success: false});
                });
            }
        }
    )
}


exports.proveedorespre = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select c.id, c.razonsocial from sic.proveedorsugerido a ' +
        'join sic.serviciosrequeridos b on a.idserviciorequerido = b.id ' +
        'join sip.proveedor c on a.idproveedor=c.id  ' +
        'where b.idsolicitudcotizacion=:id order by c.razonsocial ',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error: 1 });
    });



}

exports.list = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.preguntaproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntaproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.preguntaproveedor.belongsTo(models.user, { foreignKey: 'idresponsable' });
            models.preguntaproveedor.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntaproveedor.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [
                        {
                            model: models.proveedor
                        },
                        { model: models.user }
                    ]
                }).then(function (preguntaproveedor) {
                    return res.json({ records: records, total: total, page: page, rows: preguntaproveedor });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.listasignar = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "id",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.preguntaproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntaproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.preguntaproveedor.belongsTo(models.user, { foreignKey: 'idresponsable' });
            models.preguntaproveedor.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntaproveedor.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [
                        {
                            model: models.proveedor
                        },
                        { model: models.user }
                    ]
                }).then(function (preguntaproveedor) {
                    return res.json({ records: records, total: total, page: page, rows: preguntaproveedor });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.listresponsables = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }, {
        "field": "idresponsable",
        "op": "eq",
        "data": req.session.passport.user
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.preguntaproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntaproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.preguntaproveedor.belongsTo(models.user, { foreignKey: 'idresponsable' });
            models.preguntaproveedor.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntaproveedor.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [
                        {
                            model: models.proveedor
                        },
                        { model: models.user }
                    ]
                }).then(function (preguntaproveedor) {
                    return res.json({ records: records, total: total, page: page, rows: preguntaproveedor });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};
exports.listresponsablesnew = function (req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var additional = [{
        "field": "id",
        "op": "eq",
        "data": req.params.id
    }, {
        "field": "idresponsable",
        "op": "eq",
        "data": req.session.passport.user
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.preguntaproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntaproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
            models.preguntaproveedor.belongsTo(models.user, { foreignKey: 'idresponsable' });
            models.preguntaproveedor.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntaproveedor.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                    include: [
                        {
                            model: models.proveedor
                        },
                        { model: models.user }
                    ]
                }).then(function (preguntaproveedor) {
                    return res.json({ records: records, total: total, page: page, rows: preguntaproveedor });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};


exports.archivo = function (req, res) {

    if (req.method === 'POST') {

        var busboy = new Busboy({ headers: req.headers });

        var awaitId = new Promise(function (resolve, reject) {

            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'id') {
                    try {
                        resolve(val)
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    return;
                }
            });
        });

        var awaitIdProveedor = new Promise(function (resolve, reject) {

            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'idproveedor') {
                    try {
                        resolve(val)
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    return;
                }
            });
        });

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {//manejador upload archivo

            var saveTo = path.join(__dirname, '..' + path.sep + '..', 'temp', filename);//path al archivo
            //logger.debug(saveTo)
            file.pipe(fs.createWriteStream(saveTo)); //aqui lo guarda

            awaitId.then(function (idsolicitudcotizacion) {

                awaitIdProveedor.then(function (idproveedor) {

                    logger.debug("idsolicitudcotizacion : " + idsolicitudcotizacion)

                    logger.debug("idproveedor : " + idproveedor)

                    var carrusel = [];

                    var input = fs.createReadStream(saveTo, 'utf8'); //ahora lo lee

                    input.on('error', function (err) {
                        logger.error(err);
                        return res.json({ error_code: 1, message: err, success: false });
                    });

                    var parser = csv.parse({
                        delimiter: ';',
                        columns: true,
                        relax: true,
                        relax_column_count: true,
                        skip_empty_lines: true,
                        trim: true
                    }); //parser CSV       

                    input.pipe(parser);

                    parser.on('readable', function () {
                        var line
                        while (line = parser.read()) {
                            var item = {}
                            item['idsolicitudcotizacion'] = idsolicitudcotizacion;
                            item['idproveedor'] = idproveedor;
                            item['idresponsable'] = null;
                            item['tipo'] = line.tipo;
                            item['pregunta'] = line.pregunta;
                            item['respuesta'] = null;
                            item['borrado'] = 1;

                            console.dir(item);

                            carrusel.push(item);
                        }
                    });

                    parser.on('error', function (err) {
                        logger.error(err);
                        return res.json({ error_code: 1, message: err, success: false });
                    });/*error*/

                    //parser.on('end', function (count) {
                    parser.on('finish', function () {
                        logger.debug('finish');

                        models.preguntaproveedor.bulkCreate(carrusel).then(function (events) {
                            return res.json({ message: 'Las preguntas fueron cargadas', success: true });
                        }).catch(function (err) {
                            logger.error(err)
                            return res.json({ message: err.message, success: false });
                        });

                    });/*end*/

                }).catch(function (err) {
                    return res.json({ error_code: 1, message: err, success: false });
                    logger.error(err)
                });

            }).catch(function (err) {
                return res.json({ error_code: 1, message: err, success: false });
                logger.error(err)
            });

        });


        busboy.on('finish', function () {
            logger.debug("Finalizo la transferencia del archivo")
        });

        return req.pipe(busboy);
    }

}

exports.descargarespuestas = function (req, res) {

    models.preguntaproveedor.belongsTo(models.user, { foreignKey: 'idresponsable' });
    models.preguntaproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
    models.preguntaproveedor.findAll({
        attributes: [['id', 'id'], ['pregunta', 'pregunta'], ['respuesta', 'respuesta']],
        where: { idsolicitudcotizacion: req.params.id },
        include: [{
            attributes: [['first_name', 'nombre'], ['last_name', 'apellido']],
            model: models.user
        },
        {
            attributes: [['razonsocial', 'proveedor']],
            model: models.proveedor
        }
        ]
    }).then(function (preguntaproveedor) {

        var conf = {}
        conf.cols = [
            {
                caption: 'Id',
                type: 'string',
                width: 30
            },
            /*
            {
                caption: 'Proveedor',
                type: 'string',
                width: 200
            },
            {
                caption: 'Responsable',
                type: 'string',
                width: 200
            },
            */
            {
                caption: 'Pregunta',
                type: 'string',
                beforeCellWrite: function (row, cellData) {
                    return cellData.toUpperCase();
                },
                width: 28.7109375
            },
            {
                caption: 'Respuesta',
                type: 'string',
                width: 600
            }
        ];

        var arr = []
        var noHTML = /(<([^>]+)>)/ig;

        for (var p in preguntaproveedor) {

            var user = preguntaproveedor[p].user
            var provider = preguntaproveedor[p].proveedor
            var responsable = ''
            var proveedor = ''

            for (var x in user) {
                if (user[x].nombre && user[x].apellido) {
                    //logger.debug(user[x].nombre + ' ' + user[x].apellido)
                    responsable = user[x].nombre + ' ' + user[x].apellido
                }
            }

            for (var y in provider) {
                if (provider[y].proveedor) {
                    proveedor = provider[y].proveedor
                }
            }

            var respuesta = ''
            if (preguntaproveedor[p].respuesta) {
                respuesta = preguntaproveedor[p].respuesta.replace(noHTML, '')
                //logger.debug("cvacacv : " + respuesta)
            }
            //logger.debug("el id es: " + preguntaproveedor[p].id)

            a = [
                preguntaproveedor[p].id.toString(),
                //proveedor,
                //responsable,
                preguntaproveedor[p].pregunta,
                respuesta
            ]
            arr.push(a);


        }

        conf.rows = arr;

        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        res.setHeader("Content-Disposition", "attachment;filename=" + "respuestas_" + + Math.floor(Date.now()) + ".xlsx");
        return res.end(result, 'binary');

    }).catch(function (err) {
        logger.error(err);
        return res.json({ error_code: 1 });
    });


}
exports.getresponsablessolicitud = function (req, res) {

    var id = req.params.id;

    sequelize.query(
        'select a.uid, a.first_name, a.last_name from art_user a ' +
        'join sic.responsablesolicitud b on b.idresponsable=a.uid ' +
        'where b.idsolicitudcotizacion = :id ' +
        'order by a.first_name, a.last_name ',
        { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    ).then(function (valores) {
        //logger.debug(valores)
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error: 1 });
    });
}
exports.listinbox = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var idresponsable = req.session.passport.user;
    var filters = req.body.filters;
    var condition = "";

    if (!sidx)
        sidx = "b.id, a.id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sic.preguntaproveedor a 
            where a.idresponsable =  `+ idresponsable + ` and a.respuesta is null ` +
        `  ` + condition

    var sql = `
            SELECT 
                    b.id as idsolicitud, b.descripcion, a.id as idpregunta, a.tipo, a.pregunta, a.respuesta 
                    FROM sic.preguntaproveedor a 
                    join sic.solicitudcotizacion b on a.idsolicitudcotizacion = b.id 
            where a.idresponsable = `+ idresponsable + ` and a.respuesta is null ` +
        `  ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`





    sequelize.query(count,
        {
            replacements: { idresponsable: idresponsable, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), idresponsable: idresponsable, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    return res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.actioninbox = function (req, res) {
    models.preguntaproveedor.update({
        respuesta: req.body.respuesta,
    }, {
            where: {
                id: req.body.id
            }
        }).then(function (preguntaproveedor) {
            return res.json({ message: 'Exito', success: true });
        }).catch(function (err) {
            logger.error(err)
            return res.json({ message: err.message, success: false });
        });

}