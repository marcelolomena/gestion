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

    switch (action) {
        case "add":
            return res.json({ id: req.body.idsolicitudcotizacion, success: true });
            bitacora.registrar(
                req.body.idsolicitudcotizacion,
                'preguntasalproveedor',
                preguntacotizacion.id,
                'insert',
                req.session.passport.user,
                new Date(),
                models.preguntacotizacion,
                function (err, data) {
                    if (!err) {
                        return res.json({ id: preguntacotizacion.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
                    } else {
                        logger.error(err)
                        return res.json({ id: preguntacotizacion.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
                    }
                });
            break;
        case "del":
            models.preguntacotizacion.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function (preguntacotizacion) {
                bitacora.registrar(
                    req.body.idsolicitudcotizacion,
                    'preguntasalproveedor',
                    req.body.id,
                    'delete',
                    req.session.passport.user,
                    new Date(),
                    models.preguntacotizacion,
                    function (err, data) {
                        if (!err) {
                            models.preguntacotizacion.destroy({
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























            models.preguntacotizacion.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                }
                return res.json({ success: true, glosa: 'Deleted successfully' });
            }).catch(function (err) {
                return res.json({ success: false, glosa: err.message });
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

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (data) {
            models.preguntacotizacion.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.preguntacotizacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.preguntacotizacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: data,
                }).then(function (preguntacotizacion) {
                    return res.json({ records: records, total: total, page: page, rows: preguntacotizacion });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });
};

exports.getpreguntasrfp = function (req, res) {

    var idsolicitud = req.params.idsolicitudcotizacion;

    var sql = "select * from sic.preguntacotizacion where idsolicitudcotizacion = " + idsolicitud;

    sequelize.query(sql)
        ;

};

exports.upload = function (req, res) {

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



        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {//manejador upload archivo

            var saveTo = path.join(__dirname, '..' + path.sep + '..', 'temp', filename);//path al archivo
            file.pipe(fs.createWriteStream(saveTo)); //aqui lo guarda

            awaitId.then(function (idsolicitudcotizacion) {

                logger.debug("idsolicitudcotizacion : " + idsolicitudcotizacion)

                var carrusel = [];

                var input = fs.createReadStream(saveTo, 'utf8'); //ahora lo lee

                input.on('error', function (err) {
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
                        item['pregunta'] = line.pregunta;
                        item['borrado'] = 1;

                        console.dir(item);

                        carrusel.push(item);
                    }
                });

                parser.on('error', function (err) {
                    return res.json({ error_code: 1, message: err, success: false });
                });/*error*/

                //parser.on('end', function (count) {
                parser.on('finish', function () {

                    models.preguntacotizacion.bulkCreate(carrusel).then(function (events) {
                        return res.json({ message: 'Las preguntas fueron cargadas', success: true });
                    }).catch(function (err) {
                        return res.json({ message: err.message, success: false });
                    });

                });/*end*/



            }).catch(function (err) {
                return res.json({ error_code: 1, message: err, success: false });
            });

        });


        busboy.on('finish', function () {
        });

        return req.pipe(busboy);
    }


}

exports.descargapreguntas = function (req, res) {

    models.preguntacotizacion.findAll({
        attributes: [['id', 'id'], ['pregunta', 'pregunta']],
        where: { idsolicitudcotizacion: req.params.id },
    }).then(function (preguntacotizacion) {

        var conf = {}
        conf.cols = [
            {
                caption: 'Id',
                type: 'string',
                width: 30
            },
            {
                caption: 'pregunta',
                type: 'string',
                width: 600
            }
        ];

        var arr = []


        for (var p in preguntacotizacion) {

            var pregunta = ''
            if (preguntacotizacion[p].pregunta) {
                pregunta = preguntacotizacion[p].pregunta
            }

            a = [
                preguntacotizacion[p].id.toString(),
                pregunta
            ]
            arr.push(a);


        }

        conf.rows = arr;

        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        res.setHeader("Content-Disposition", "attachment;filename=" + "preguntasolicitud_" + + Math.floor(Date.now()) + ".xlsx");
        return res.end(result, 'binary');

    }).catch(function (err) {
        return res.json({ error_code: 1 });
    });


}
exports.proveedoressugeridostotal = function (req, res) {

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
            models.proveedorsugerido.belongsTo(models.serviciosrequeridos, { foreignKey: 'idserviciorequerido' });

            models.proveedorsugerido.count({
                include: [{
                    model: models.serviciosrequeridos, where: { idsolicitudcotizacion: id }
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.proveedorsugerido.findAll({
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.col('[proveedor].[numrut]')), '[proveedor].[numrut]']
                    ],
                    //offset: parseInt(rows * (page - 1)),
                    //limit: parseInt(rows),
                    //order: orden,
                    include: [{
                        model: models.proveedor
                    }, {
                        model: models.serviciosrequeridos, where: { idsolicitudcotizacion: id }
                    }
                    ]
                }).then(function (proveedorsugerido) {
                    //logger.debug(solicitudcotizacion)
                    return res.json({ records: records, total: total, page: page, rows: proveedorsugerido });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
            })
        }
    });

};