'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');
var logger = require('../../utils/logger');
var secuencia = require("../../utils/secuencia");
var nodemailer = require('nodemailer');
var constants = require("../../utils/constants");

var entity = models.reserva;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});
entity.belongsTo(models.user, {
    as: 'solicitante_A',
    foreignKey: 'idUsuario'
});
entity.belongsTo(models.user, {
    as: 'aprobador_A',
    foreignKey: 'idUsuarioJefe'
});
entity.belongsTo(models.user, {
    foreignKey: 'idUsuarioAutoriza'
});

var includes = [{
    model: models.producto
},
{
    model: models.user
}
];

function map(req) {
    return {
        id: req.body.id,
        idProducto: req.body.idProducto,
        estado: req.body.estadoAutorizacion,
        fechaAutorizacion: req.body.fechaAutorizacion,
        comentarioAutorizacion: req.body.comentarioAutorizacion,
        codAutoriza: req.body.codAutoriza,
        idUsuarioAutoriza: req.body.idUsuarioAutoriza
    }
}


function listAuto(req, res) {
    var page = req.query.page;
    var rowspp = req.query.rows;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var cui = req.params.cui
    var periodo = req.params.periodo
    var proveedor = req.params.proveedor
    var filters = req.query.filters;
    var condition = "";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        if (JSON.stringify(jsonObj.rules) != '[]') {
            jsonObj.rules.forEach(function (item) {
                if (item.data != '0') {
                    if (item.op === 'cn' || item.op === 'eq')
                        if (item.field == 'codautorizacion') {//Excepciones en filtros
                            condition += 'a.' + item.field + " like '%" + item.data + "%' AND ";
                        } else {
                            condition += 'a.' + item.field + "=" + item.data + " AND ";
                        }
                }
            });
            condition = condition.substring(0, condition.length - 5);
            logger.debug("***CONDICION:" + condition);
        }
    }
    var sqlcount;
    sqlcount = "SELECT count(*)  FROM lic.reserva a " +
        "LEFT JOIN lic.producto b ON b.id = a.idproducto  " +
        "LEFT JOIN art_user c ON c.uid=a.idusuario  " +
        "LEFT JOIN art_user d ON d.uid=a.idusuariojefe " +
        "WHERE a.estado IN ('Aprobado', 'Autorizado', 'Denegado') ";

    if (filters && condition != "") {
        sqlcount += " and " + condition + " ";
    }

    var sql;
    sql = "DECLARE @PageSize INT; " +
        "SELECT @PageSize=" + rowspp + "; " +
        "DECLARE @PageNumber INT; " +
        "SELECT @PageNumber=" + page + "; " +
        "SELECT a.*, a.comentarioautorizacion AS comentarioAutorizacion, b.nombre, c.first_name+' '+c.last_name AS solicitante_A, d.first_name+' '+d.last_name AS aprobador_A  " +
        "FROM lic.reserva a " +
        "LEFT JOIN lic.producto b ON b.id = a.idproducto " +
        "LEFT JOIN art_user c ON c.uid=a.idusuario " +
        "LEFT JOIN art_user d ON d.uid=a.idusuariojefe " +
        "WHERE a.estado IN ('Aprobado', 'Denegado') ";
    if (filters && condition != "") {
        sql += " AND " + condition + " ";
        logger.debug("**" + sql + "**");
    }
    var sql2 = sql + " ORDER BY a.estado OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
    var records;
    logger.debug("query:" + sql2);

    sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        sequelize.query(sql2).spread(function (rows) {
            return res.json({ records: records, total: total, page: page, rows: rows });
        }).catch(function (err) {
            logger.error(err)
            return res.json({ error_code: 1 });
        });
    })
}


function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

function action(req, res) {


    switch (req.body.oper) {
        case 'add':
            secuencia.getSecuencia(0, function (err, sec) {
                req.body.codAutoriza = sec;
                return base.create(entity, map(req), res);
            });
        case 'edit':
            var usr = req.session.passport.user;
            var estado = req.body.estadoAutorizacion;
            var comen = req.body.comentarioAutorizacion;
			secuencia.getSecuencia(0, function (err, sec) {
				var sql = "UPDATE lic.producto SET licReserva= ISNULL(licReserva,0)+" + req.body.numlicencia + " WHERE id IN (SELECT idproducto FROM lic.reserva WHERE id=" + req.body.id + ");" +
					"UPDATE lic.reserva SET fechaautorizacion=getdate(), idusuarioautoriza=" + usr + ", estado='" + estado + "', comentarioautorizacion='" + comen + "', codautoriza='"+sec+"' WHERE id=" + req.body.id;
				sequelize.query(sql).then(function (ok) {
					var sqlmail = "select email from art_user where uid in (select idusuario from lic.reserva where id=" + req.body.id + ")";
					sequelize.query(sqlmail).then(function (mailto) {
						logger.debug("mailto:" + mailto[0][0].email + ", " + JSON.stringify(mailto));
						var htmltext = '<b>Estimado(a) <br><br> La solicitud de reserva del producto "' +
							req.body.nombreprod + '" ha sido aprobada. <br>Por favor proceder con la instalación.';
						let transporter = nodemailer.createTransport({
							host: constants.CORREOIP,
							port: 25,
							secure: false, // true for 465, false for other ports
							auth: {
								user: constants.CORREOUSR,
								pass: constants.CORREOPWD
							},
							tls: { rejectUnauthorized: false }
						});
						// setup email data with unicode symbols
						let mailOptions = {
							from: constants.CORREOFROM, // sender address
							to: constants.CORREOTO + ',' + mailto[0][0].email, // list of receivers
							subject: 'Reserva de licencia de software APROBADA', // Subject line
							text: 'Aprueba reserva', // plain text body
							html: htmltext
						};

						//console.log('MailOPt'+JSON.stringify(mailOptions));
						console.log("TO:" + constants.CORREOTO + ',' + mailto[0][0].email);
						// send mail with defined transport object
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								return console.log(error);
							}
							console.log('Msg Reserva-Aprob Enviado: %s', info.messageId);
							// Preview only available when sending through an Ethereal account
							console.log('URL: %s', nodemailer.getTestMessageUrl(info));
						});
						return res.json({ error_code: 0 });
					});
				});
			});
            break;
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function usuariocui(req, res) {

    models.sequelize.query("select b.cui from dbo.art_user a " +
        "join dbo.RecursosHumanos b on a.email = b.emailTrab " +
        "where a.uid = " + req.session.passport.user + " and periodo = (select max(periodo) from dbo.RecursosHumanos)").spread(function (rows) {
            return res.json(rows);
        });
}

module.exports = {
    list: list,
    action: action,
    usuariocui: usuariocui,
    listAuto: listAuto,
    getProductoReserva: getProductoReserva
};

function getProductoReserva(req, res) {
    var idFabricante = req.params.idFabricante;
    var sql = 'select distinct a.id, a.nombre from lic.producto a ' +
        'join lic.reserva b on a.id = b.idproducto';
    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};