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

            res.json({ id: req.body.idsolicitudcotizacion, idproveedor: req.body.idproveedor, success: true });

            break;
        case "del":
            models.preguntaproveedor.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: 'Deleted successfully' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
            });
            break;
    }
}

exports.asignar = function (req, res) {
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

exports.responder = function (req, res) {
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


exports.proveedorespre = function (req, res) {

    models.solicitudproveedor.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitud' });
    models.solicitudproveedor.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });

    models.solicitudproveedor.findAll({

        where: { idsolicitud: req.params.id },
        include: [{
            model: models.solicitudcotizacion
        }, { model: models.proveedor }
        ]
    }).then(function (solicitudproveedor) {
        return res.json(solicitudproveedor);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
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
                    res.json({ error_code: 1 });
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
                    res.json({ error_code: 1 });
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
                        res.json({ error_code: 1, message: err, success: false });
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

                            carrusel.push(item);
                        }
                    });

                    parser.on('error', function (err) {
                        logger.error(err);
                        res.json({ error_code: 1, message: err, success: false });
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
                    res.json({ error_code: 1, message: err, success: false });
                    logger.error(err)
                });

            }).catch(function (err) {
                res.json({ error_code: 1, message: err, success: false });
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
        attributes: [['tipo', 'tipo'], ['pregunta', 'pregunta'], ['respuesta', 'respuesta']],
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
                caption: 'Proveedor',
                type: 'string',
                width: 200
            },
            {
                caption: 'Responsable',
                type: 'string',
                width: 200
            },
            {
                caption: 'Pregunta',
                type: 'string',
                width: 200
            },
            {
                caption: 'Respuesta',
                type: 'string',
                width: 200
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

            a = [
                proveedor,
                responsable,
                preguntaproveedor[p].pregunta,
                respuesta
            ]
            arr.push(a);


        }

        conf.rows = arr;

        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        res.setHeader("Content-Disposition", "attachment;filename=" + "respuestas_" + + Math.floor(Date.now()) + ".xlsx");
        res.end(result, 'binary');

    }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
    });


}

