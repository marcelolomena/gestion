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
    var bulkLoad = function (table, csv, id, temp, deleted, dateLoad, callback) {
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
                            throw new Error(err)
                        });
                    } else if (table === 'RecursosHumanos') {
                        models.recursoshumanos$.bulkCreate(tasks).then(function (events) {
                            inserterCallback();
                        }).catch(function (err) {
                            logger.error(err)
                            throw new Error(err)
                        });
                    } else if (table === 'Proyecto') {
                        models.proyectobase.bulkCreate(tasks).then(function (events) {
                            inserterCallback();
                        }).catch(function (err) {
                            logger.error(err)
                            throw new Error(err)
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
                    } else if (table === 'Proyecto') {
                        models.proyectobase.truncate();
                    }
                }

                logger.debug("maxbuf : " + maxbuf)
                logger.debug("tbuf : " + tbuf)

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
                        control2: 'Fin de la carga de paso',
                        nroregistros: csv.length
                    }, {
                            where: { id: id }
                        }).then(function (detallecargas) {
                            logger.debug("lista la carga de " + table)

                            if (table === 'RecursosHumanos') {
                                
                                var parseDate = dateLoad.toISOString().slice(0, 10).split("-");
                                var period = parseDate[0] + parseDate[1];
                                logger.debug("period : " + period);
                                var query = "EXECUTE sip.cargarrhh :periodo;";
                                sequelize.query(query,
                                    {
                                        replacements: { periodo: period },
                                        type: sequelize.QueryTypes.SELECT
                                    }).then(function (rows) {
                                        logger.debug("error : " + rows[0].ErrorNumber);
                                        if (rows[0].ErrorNumber === 0)
                                            callback(undefined, "lista la carga de " + table);
                                        else if (rows[0].ErrorNumber === 2627)
                                            callback("Ya existe este periodo cargado", undefined);
                                        else
                                            callback("Error al ejecutar Proceso", undefined);
                                    }).catch(function (err) {
                                        logger.error(err)
                                        throw new Error(err)
                                    });
                            }
                            else if (table === 'Proyecto') {
                                
                                var parseDate = dateLoad.toISOString().slice(0, 10).split("-");

                                var query = "EXECUTE sip.CargaProyecto;";
                                sequelize.query(query,
                                    {
                                        type: sequelize.QueryTypes.SELECT
                                    }).then(function (rows) {
                                        logger.debug("error : " + rows[0].ErrorNumber);
                                        if (rows[0].ErrorNumber === 0)
                                            callback(undefined, "lista la carga de " + table);                                      
                                        else  if (rows[0].ErrorNumber === 60000)
                                            callback(rows[0].ErrorMessage,undefined);      
                                    }).catch(function (err) {
                                        logger.error(err)
                                        throw new Error(err)
                                    });
                            }                            

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