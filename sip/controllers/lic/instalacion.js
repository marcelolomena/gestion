'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var nodeExcel = require('excel-export');
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var constants = require("../../utils/constants");
var nodemailer = require('nodemailer');

var entity = models.instalacion;

function list(req, res) {
    var id = req.params.id;
    var usuario = req.session.passport.user;
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.params.filters
    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            entity.belongsTo(models.producto, {
                foreignKey: 'idProducto'
            });
            entity.belongsTo(models.user, {
                foreignKey: 'idUsuario'
            });
            entity.belongsTo(models.tipoInstalacion, {
                foreignKey: 'idTipoInstalacion'
            });
            entity.count({
                where: {
                    idUsuario: usuario
                },
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                entity.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: [
                        ['codautorizacion', 'DESC']
                    ],
                    where: {
                        idUsuario: usuario
                    },
                    include: [{
                        model: models.producto
                    }, {
                        model: models.user
                    }]
                }).then(function (instal) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: instal
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
}

// function misAutorizaciones(req, res) {
//     models.sequelize.query("select distinct a.id, a.idproducto, b.nombre, a.numlicencia, b.idtipoinstalacion, a.codautoriza " +
//         "from lic.reserva a " +
//         "join lic.producto b on a.idproducto = b.id " +
//         "join lic.instalacion c on c.idproducto = b.id " +
//         "where a.idusuario = " + req.session.passport.user + " AND a.estado = 'Autorizado' AND b.licReserva <> 0 AND c.estado!= 'Instalado' AND c.estado! = 'Historico'").spread(function (rows) {
//         return res.json(rows);
//     });
// }



function misAutorizaciones(req, res) {
    models.sequelize.query("select distinct a.id, a.idproducto, b.nombre, a.numlicencia, b.idtipoinstalacion, a.codautoriza " +
        "from lic.reserva a " +
        "join lic.producto b on a.idproducto = b.id " +
        "join lic.instalacion c on c.idproducto = b.id " +
        "where a.idusuario = " + req.session.passport.user + " AND a.estado = 'Autorizado' AND b.licReserva <> 0 AND c.estado!= 'Instalado'").spread(function (rows) {
        return res.json(rows);
    });
}

function miscodigos(req, res) {
    var id = req.params.idProducto;
    models.sequelize.query("select a.codautoriza, b.idtipoinstalacion " +
        "from lic.reserva a " +
        "join lic.producto b on a.idproducto = b.id " +
        "where a.id = " + id + " and a.codautoriza is not null").spread(function (rows) {
        return res.json(rows);
    });
}

function upload(req, res) {
    if (req.method === 'POST') {
        var busboy = new Busboy({
            headers: req.headers
        });
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

        var awaitParent = new Promise(function (resolve, reject) {
            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
                if (fieldname === 'parent') {
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

        function copyFile(source, target) {
            return new Promise(function (resolve, reject) {
                var rd = fs.createReadStream(source);
                rd.on('error', rejectCleanup);
                var wr = fs.createWriteStream(target);
                wr.on('error', rejectCleanup);

                function rejectCleanup(err) {
                    rd.destroy();
                    wr.end();
                    reject(err);
                }
                wr.on('finish', resolve);
                rd.pipe(wr);
            });
        }

        function checkDirectorySync(directory) {
            try {
                fs.statSync(directory);
            } catch (e) {
                fs.mkdirSync(directory);
            }
        }

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var numero = Math.floor((Math.random() * 10000) + 1);
            var saveTo = path.join(__dirname, '../../docs/', 'lic', numero + filename);
            file.pipe(fs.createWriteStream(saveTo));
            var dir = path.join(__dirname, '../../', 'public/docs/lic');
            checkDirectorySync(dir);
            var dest = path.join(__dirname, '../../', 'public/docs/lic', numero + filename);
            copyFile(saveTo, dest)
            awaitId.then(function (idDetail) {
                models.instalacion.update({
                    nombrearchivo: numero + filename
                }, {
                    where: {
                        id: idDetail
                    }
                }).then(function (instalacionn) {}).catch(function (err) {
                    logger.error(err)
                    res.json({
                        id: 0,
                        message: err.message,
                        success: false
                    });
                });
            }).catch(function (err) {
                res.json({
                    error_code: 1,
                    message: err.message,
                    success: false
                });
                logger.error(err)
            });

        });

        busboy.on('finish', function () {
            logger.debug("Finalizo la transferencia del archivo")
            res.json({
                error_code: 0,
                message: 'Archivo guardado',
                success: true
            });
        });

        return req.pipe(busboy);
    }
}

function action(req, res) {
    var action = req.body.oper;
    switch (action) {
        case "add":
            var numero = req.body.idTipoInstalacion;
            var codauto = req.body.codAutorizacion;
            var idprod = req.body.idProducto;
            var hoy = "" + new Date().toISOString();
            models.instalacion.create({
                idUsuario: req.session.passport.user,
                fechaSolicitud: hoy,
                idProducto: idprod,
                codAutorizacion: codauto,
                informacion: req.body.informacion,
                estado: 'Pendiente',
                idTipoInstalacion: numero,
                numlicencia: req.body.numlicencia
            }).then(function (instal) {
                var htmltext = '<b>Estimado(a) <br><br> Se ha solicitado la instalaci&oacute;n de ' + req.body.numlicencia + ' licencia(s) de producto "' +
                    req.body.nombreProd + '" . <br>Adicionalmente considerar el siguiente comentario: ' + req.body.informacion + '.';
                var mailtorre = constants.CORREOTO;
                if (numero == constants.TIPO_INST_PC) {
                    mailtorre = constants.MAIL_INST_PC;
                } else {
                    mailtorre = constants.MAIL_INST_SRV;
                }
                let transporter = nodemailer.createTransport({
                    host: constants.CORREOIP,
                    port: 25,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: constants.CORREOUSR,
                        pass: constants.CORREOPWD
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                // setup email data with unicode symbols
                let mailOptions = {
                    from: constants.CORREOFROM, // sender address
                    to: constants.CORREOTO + ',' + mailtorre, // list of receivers
                    subject: 'Visado de instalacion de software', // Subject line
                    text: 'Visado de instalacion', // plain text body
                    html: htmltext
                };

                //console.log('MailOPt'+JSON.stringify(mailOptions));
                console.log("TO:" + constants.CORREOTO + ',' + mailtorre);
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });

                return res.json({
                    id: instal.id,
                    message: 'Inicio carga',
                    success: true
                });
            }).catch(function (err) {
                logger.error(err)
                return res.json({
                    id: instal.id,
                    message: 'Falla',
                    success: false
                });
            });
            break;
        case "edit":
            models.instalacion.update({
                informacion: req.body.informacion
            }, {
                where: {
                    id: req.body.id
                }
            }).then(function (clase) {
                res.json({
                    id: req.body.id,
                    message: 'Inicio carga',
                    success: true
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    message: err.message,
                    success: false
                });
            });
            break;
        case "del":
            models.instalacion.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({
                    error: 0,
                    glosa: ''
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    error: 1,
                    glosa: err.message
                });
            });
            break;
    }
}

// function listInstalacion(req, res) {
//     var id = req.params.id;
//     var usuario = req.session.passport.user;
//     var idproduc = req.params.pId;
//     var instal = 'Instalado'
//     var histor = 'Historico'
//     var page = req.query.page;
//     var rows = req.query.rows;
//     var filters = req.params.filters
//     // console.log("******** page:" + page + ", row:" + rows);
//     utilSeq.buildCondition(filters, function (err, data) {
//         if (err) {
//             logger.debug("->>> " + err)
//         } else {
//             entity.belongsTo(models.producto, {
//                 foreignKey: 'idProducto'
//             });
//             entity.belongsTo(models.user, {
//                 foreignKey: 'idUsuario'
//             });
//             entity.belongsTo(models.tipoInstalacion, {
//                 foreignKey: 'idTipoInstalacion'
//             });
//             entity.count({
//                 where: {
//                     idProducto: idproduc,
//                     estado: [instal, histor]
//                 }
//             }).then(function (records) {
//                 var total = Math.ceil(records / rows);
//                 entity.findAll({
//                     offset: parseInt(rows * (page - 1)),
//                     limit: parseInt(rows),
//                     // order: ['id'],
//                     where: {
//                         idProducto: idproduc,
//                         estado: [instal, histor]
//                     },
//                     include: [{
//                         model: models.producto
//                     }, {
//                         model: models.user
//                     }]
//                 }).then(function (instal) {
//                     return res.json({
//                         records: records,
//                         total: total,
//                         page: page,
//                         rows: instal
//                     });
//                 }).catch(function (err) {
//                     logger.error(err);
//                     return res.json({
//                         error_code: 1
//                     });
//                 });
//             })
//         }
//     });
// }

function listInstalacion(req, res) {

    var page = req.query.page;
    var rowspp = req.query.rows;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var instal = 'Instalado';
    var histor = 'Historico';
    var filters = req.query.filters;
    var condition = "";
    var idproduc = req.params.pId;

    if (filters) {
        var jsonObj = JSON.parse(filters);
        if (JSON.stringify(jsonObj.rules) != '[]') {
            jsonObj.rules.forEach(function (item) {
                if (item.op === 'cn' || item.op === 'eq')
                    if (item.field == 'nombre') {
                        condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
                    } else {
                        condition += 'a.' + item.field + "=" + item.data + " AND ";
                    }
            });
            condition = condition.substring(0, condition.length - 5);
            // logger.debug("***CONDICION:" + condition);
        }
    }
    // var sqlcount = 'SELECT count(*) AS count FROM lic.reserva a JOIN lic.producto b ON a.idproducto=b.id ";
    var sqlcount = "SELECT SUM(count) " +
        "FROM (SELECT count(*) AS [count] " +
        "FROM [lic]. [instalacion] AS[instalacion] " +
        "WHERE [instalacion]. [estado] IN ( '"+ instal + "', '" + histor +"') AND [instalacion]. [idproducto] = " + idproduc +
        "union " +
        "SELECT count( * ) AS [count] " +
        "FROM lic.ubicacioninstalacion " +
        "WHERE idproducto = " + idproduc +
        ') a '
    if (filters && condition != "") {
        sqlcount += " WHERE " + condition + " ";
    }
    var rol = req.session.passport.sidebar[0].rid; //req.user[0].rid;
    var sqlok;
    var sql = "DECLARE @PageSize INT; " +
        "SELECT @PageSize=" + rowspp + "; " +
        "DECLARE @PageNumber INT; " +
        "SELECT @PageNumber=" + page + "; " +
        "SELECT  [instalacion].id, [instalacion].estado, [instalacion].codautorizacion, [instalacion].instalador, fechainstalacion, null as usuario, null as ubicacion, null as codigoInterno " +
        "FROM [lic].[instalacion] AS [instalacion] LEFT OUTER JOIN [lic].[producto] AS [producto] ON [instalacion].[idproducto] = [producto].[id] " +
        "LEFT OUTER JOIN [dbo].[art_user] AS [user] ON [instalacion].[idusuario] = [user].[uid] " +
        "WHERE [instalacion].[estado] IN ( '" + instal + "', '" + histor + "' ) AND [instalacion].[idproducto] = " + idproduc +
        "union all " +
        "SELECT [id], estado, null, null, null, usuario, ubicacion, codigoInterno " +
        "FROM lic.ubicacioninstalacion " +
        "WHERE idproducto = " + idproduc
    // "ORDER BY [id] OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY "

    if (filters && condition != "") {
        sql += "AND " + condition + " ";
        logger.debug("**" + sql + "**");
    }
    var sql2 = sql + "ORDER BY id OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
    var records;
    // logger.debug("query:" + sql2);

    sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        sequelize.query(sql2).spread(function (rows) {
            res.json({
                records: records,
                total: total,
                page: page,
                rows: rows
            });
        }).catch(function (err) {
            logger.error(err)
            res.json({
                error_code: 1
            });
        });
    })
}

function listUbicacion(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx
    var sord = req.query.sord
    // var provee = req.query.provee;
    // var orden = "[solicitudcotizacion]." + sidx + " " + sord;
    var filter_one = []
    var filter_two = []
    var filter_tres = []

    var isrequired = false;
    if (filters != undefined) {
        var item = {}
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.field === "nombreProd") {
                filter_two.push({
                    ['nombre']: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "usuario") {
                filter_one.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            }
        })
    }
    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.ubicacioninstalacion.belongsTo(models.producto, {
                foreignKey: 'idproducto'
            });
            models.ubicacioninstalacion.count({
                where: filter_one,
                include: [{
                    model: models.producto,
                    where: filter_two
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.ubicacioninstalacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    // order: orden,
                    where: filter_one,
                    include: [{
                        model: models.producto,
                        where: filter_two
                    }]
                }).then(function (ubicacioninst) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: ubicacioninst
                    });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({
                        error_code: 1
                    });
                });
            })
        }
    });
}


// function listUbicacion(req, res) {
//     var id = req.params.id;
//     var page = req.query.page;
//     var rows = req.query.rows;
//     var filters = req.params.filters
//     utilSeq.buildCondition(filters, function (err, data) {
//         if (err) {
//             logger.debug("->>> " + err)
//         } else {
//             models.ubicacioninstalacion.belongsTo(models.producto, {
//                 foreignKey: 'idproducto'
//             });
//             models.ubicacioninstalacion.count({}).then(function (records) {
//                 var total = Math.ceil(records / rows);
//                 models.ubicacioninstalacion.findAll({
//                     offset: parseInt(rows * (page - 1)),
//                     limit: parseInt(rows),
//                     // order: [['codautorizacion', 'DESC']],
//                     include: [{
//                         model: models.producto
//                     }]
//                 }).then(function (ubicacion) {
//                     return res.json({
//                         records: records,
//                         total: total,
//                         page: page,
//                         rows: ubicacion
//                     });
//                 }).catch(function (err) {
//                     logger.error(err);
//                     return res.json({
//                         error_code: 1
//                     });
//                 });
//             })
//         }
//     });
// }

function actionUbicacion(req, res) {
    var action = req.body.oper;
    switch (action) {
        case "add":
            models.ubicacioninstalacion.create({
                idproducto: req.body.idproducto,
                usuario: req.body.usuario,
                ubicacion: req.body.ubicacion,
                codigoInterno: req.body.codigoInterno
            }).then(function (instal) {
                return res.json({
                    id: instal.id,
                    message: 'CREADO',
                    success: true,
                    error: 0
                });
            }).catch(function (err) {
                logger.error(err)
                return res.json({
                    id: instal.id,
                    message: 'FALLA',
                    success: false,

                });
            });
            break;
        case "edit":
            models.ubicacioninstalacion.update({
                idproducto: req.body.idproducto,
                usuario: req.body.usuario,
                ubicacion: req.body.ubicacion,
                codigoInterno: req.body.codigoInterno
            }, {
                where: {
                    id: req.body.id
                }
            }).then(function (clase) {
                res.json({
                    id: req.body.id,
                    message: 'EDITADO',
                    success: true,
                    error: 0
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    message: 'FALLA',
                    success: false
                });
            });
            break;
        case "del":
            models.ubicacioninstalacion.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
                res.json({
                    error: 0,
                    glosa: 'BORRADO'
                });
            }).catch(function (err) {
                logger.error(err)
                res.json({
                    error: 1,
                    glosa: 'FALLA'
                });
            });
            break;
    }
}

function getExcel(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var condition = "";
    var gris = "WHERE a.alertarenovacion <> 'aGris'"
    // logger.debug("En getExcel");
    var conf = {}
    conf.cols = [{
            caption: 'id',
            type: 'number',
            width: 3
        },
        {
            caption: 'Producto',
            type: 'string',
            width: 200
        },
        {
            caption: 'Usuario',
            type: 'string',
            width: 200
        },
        {
            caption: 'Ubicación',
            type: 'string',
            width: 200
        },
        {
            caption: 'CódigoInterno',
            type: 'string',
            width: 200
        }
    ];
    var sql = "SELECT b.nombre, a.usuario, a.ubicacion, a.codigoInterno FROM lic.ubicacioninstalacion a " +
        "JOIN lic.producto b ON b.id = a.idproducto " +
        "ORDER BY a.idproducto ASC";

    // console.log("query:" + sql);
    sequelize.query(sql)
        .spread(function (ubicacion) {
            var arr = [];
            var nombreprod = '';
            for (var i = 0; i < ubicacion.length; i++) {

                if (nombreprod != ubicacion[i].nombre) {
                    var a = [i + 1,
                        ubicacion[i].nombre,
                        ubicacion[i].usuario,
                        ubicacion[i].ubicacion,
                        ubicacion[i].codigoInterno
                    ];
                    nombreprod = ubicacion[i].nombre
                } else {
                    var a = [i + 1,
                        null,
                        ubicacion[i].usuario,
                        ubicacion[i].ubicacion,
                        ubicacion[i].codigoInterno
                    ];
                    nombreprod = ubicacion[i].nombre
                }

                arr.push(a);
            }
            conf.rows = arr;

            var result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformates');
            res.setHeader("Content-Disposition", "attachment;filename=" + "ReporteComparativo.xlsx");
            res.end(result, 'binary');

        }).catch(function (err) {
            logger.debug(err);
            res.json({
                error_code: 100
            });
        });

};

module.exports = {
    list: list,
    misAutorizaciones: misAutorizaciones,
    miscodigos: miscodigos,
    upload: upload,
    action: action,
    listInstalacion: listInstalacion,
    listUbicacion: listUbicacion,
    actionUbicacion: actionUbicacion,
    getExcel: getExcel


};