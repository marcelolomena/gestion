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


exports.action = function (req, res) {
    var action = req.body.oper;

    logger.debug("----------->> " + req.body.idsolicitudcotizacion)

    switch (action) {
        case "add":

            res.json({ id: req.body.idsolicitudcotizacio, success: true });

            break;
        case "del":
            models.solicitudproveedor.destroy({
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
            models.preguntaproveedor.belongsTo(models.valores, { foreignKey: 'idtipo' });
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
                        { model: models.user },
                        { model: models.valores }
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

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {//manejador upload archivo

            var saveTo = path.join(__dirname, '..', 'temp', filename);//path al archivo

            file.pipe(fs.createWriteStream(saveTo)); //aqui lo guarda

            awaitId.then(function (idDetail) {

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
                        carrusel.push(line);
                        /*
                        var length = carrusel.push(line);
                        if (length % 1000 == 0) {
                          logger.debug(length);
                        }*/
                    }
                });

                parser.on('error', function (err) {
                    logger.error(err);
                    res.json({ error_code: 1, message: err, success: false });
                });/*error*/

                //parser.on('end', function (count) {
                parser.on('finish', function () {
                    logger.debug('finish');
                    /*         
                             co(function* () {
                                 models.detallecargas.belongsTo(models.logcargas, { foreignKey: 'idlogcargas' });
                                 var carga = yield models.detallecargas.findAll({
                                     limit: 1,
                                     where: { id: idDetail },
                                     include: [{
                                         model: models.logcargas
                                     }]
                                 }).catch(function (err) {
                                     logger.error(err);
                                 });
         
                                 //logger.debug(carga[0].dataValues.logcarga.dataValues.archivo)
         
                                 var table = carga[0].dataValues.logcarga.dataValues.archivo//Troya
                                 var deleted = carga[0].dataValues.logcarga.dataValues.tipocarga//Reemplaza o Incremental
                                 var dateLoad = carga[0].dataValues.logcarga.dataValues.fechaarchivo//Reemplaza o Incremental
         
                                 bulk.bulkLoad(table.split(" ").join(""), carrusel, idDetail, saveTo, deleted, dateLoad, function (err, data) {
                                     if (err) {
                                         logger.error("->>> " + err)
                                         res.json({ error_code: 1, message: err, success: false });
                                     } else {
                                         logger.debug("->>> " + data)
                                         res.json({ error_code: 0, message: data, success: true });
                                     }
                                 })
         
                             }).catch(function (err) {//co(*)
                                 res.json({ error_code: 1, message: err, success: false });
                                 logger.error(err)
                             })
                             */

                });/*end*/

                //parser.end();

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


