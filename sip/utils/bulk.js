var logger = require("./logger");
var sequelize = require('../models/index').sequelize;
var models = require('../models');
var async = require('async');
var fs = require('fs');

/*
Este algoritmo inserta en la BD pedazos de 1000 registros.
Si la cantidad de registros leidos desde el CSV supera las 1000 filas
el arreglo que se inserta en la BD se divide en pedazos de 1000
esta limitacion es propia de MSSQL 2012
*/

module.exports = (function () {
    var bulkLoad = function (table, csv, id, temp, deleted, callback) {
        try {

            if (csv) {
                var tbuf = 1000;
                var j = 0;
                var chunk = [];
                var maxbuf = tbuf * Math.floor(csv.length / tbuf)
                var inserter = async.cargo(function (tasks, inserterCallback) {

                    if (table === 'Troya') {
                        models.troya.bulkCreate(tasks).then(function (events) {
                            inserterCallback();
                        }).catch(function (err) {
                            logger.error(err)
                        });
                    } else if (table === 'RecursosHumanos') {
                        models.recursoshumanos$.bulkCreate(tasks).then(function (events) {
                            inserterCallback();
                        }).catch(function (err) {
                            logger.error(err)
                        });
                    }
                },
                    tbuf
                );

                if (deleted === 'Reemplaza') {
                    logger.debug("borrando tabla : " + table);
                    if (table === 'Troya') {
                        models.troya.truncate();
                    } else if (table === 'RecursosHumanos') {
                        models.recursoshumanos$.truncate();
                    }
                }



                if (maxbuf > tbuf) {
                    logger.debug("iterando hasta : " + maxbuf)
                    for (var i = 0; i < maxbuf; i++) {
                        chunk[j] = csv[i];
                        inserter.push(chunk[j]);
                        j = j + 1;
                        if ((i + 1) % tbuf == 0) {
                            chunk.length = 0;
                            j = 0;
                        }
                    }

                    chunk.length = 0;
                    logger.debug("tam cola : " + csv.length)
                    for (var i = maxbuf; i < csv.length; i++) {
                        inserter.push(csv[i]);
                    }

                } else {

                    for (var i = 0; i < csv.length; i++) {
                        inserter.push(csv[i]);
                    }

                }

                inserter.drain = function () {

                    models.detallecargas.update({
                        fechaproceso: new Date(),
                        control2: 'Fin de la carga',
                        nroregistros: csv.length
                    }, {
                            where: { id: id }
                        }).then(function (detallecargas) {


                            logger.debug("lista la carga de " + table)

                            if (table === 'RecursosHumanos') {
                                logger.debug("ejecuta proc")
                            }

                            callback(undefined, 'LISTO!!')
                        }).catch(function (err) {
                            throw new Error(err)
                        });


                    fs.unlink(temp);
                }

            } else {
                throw new Error("CSV null");
            }



        } catch (err) {
            logger.error(err)
            return callback(err, undefined);
        }

    }
    return {
        bulkLoad: bulkLoad
    };
})();