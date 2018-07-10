'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
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
                    order: [['codautorizacion', 'DESC']],
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
				var htmltext = '<b>Estimado(a) <br><br> Se ha solicitado la instalaci&oacute;n de '+req.body.numlicencia+' licencia(s) de producto "' +
					req.body.nombreProd + '" . <br>Adicionalmente considerar el siguiente comentario: '+req.body.informacion+'.';			
				var mailtorre=constants.CORREOTO;
				if (numero == constants.TIPO_INST_PC) {
					mailtorre=constants.MAIL_INST_PC;
				} else {
					mailtorre=constants.MAIL_INST_SRV;
				}
				  let transporter = nodemailer.createTransport({
					host: constants.CORREOIP,
					port: 25,
					secure: false, // true for 465, false for other ports
					auth: {
					  user: constants.CORREOUSR,
					  pass: constants.CORREOPWD
					},
					tls: {rejectUnauthorized: false}
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
				  console.log("TO:"+constants.CORREOTO + ',' + mailtorre);
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

function listInstalacion(req, res) {
    var id = req.params.id;
    var usuario = req.session.passport.user;
    var idproduc = req.params.pId;
    var instal = 'Instalado'
    var histor = 'Historico'
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.params.filters
	console.log("******** page:"+page+", row:"+rows);
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
                    idProducto: idproduc,
                    estado: [instal, histor]
                },
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                entity.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    // order: ['id'],
                    where: {
                        idProducto: idproduc,
                        estado: [instal, histor]
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



module.exports = {
    list: list,
    misAutorizaciones: misAutorizaciones,
    miscodigos: miscodigos,
    upload: upload,
    action: action,
    listInstalacion: listInstalacion
};