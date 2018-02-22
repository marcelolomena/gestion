
'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");
var fs = require('fs');
var nodemailer = require('nodemailer');
var path = require('path');

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "edit":
      //Codigo de update
      if (req.body.torre == '0') {
        var sql = "UPDATE lic.instalacion SET estado='" + req.body.estado + "', comentarioinstalacion='" + req.body.comentarioinstalacion + "' " +
          " WHERE id =" + req.body.id + ";";
      } else {
        var sql = "UPDATE lic.instalacion SET estado='" + req.body.estado + "', comentarioinstalacion='" + req.body.comentarioinstalacion + "', " +
          " idtorre = " + req.body.torre + " WHERE id =" + req.body.id + ";";
      }

      if (req.body.estado == constants.INSTALADO) {
        sql = sql + " UPDATE lic.producto SET licReserva=licReserva-1, licocupadas=licocupadas+1 WHERE id=" + req.body.producto;
      }

      console.log("query:" + sql);
      console.log("archivo:" + req.body.nombrearchivo2);
      var archivo = req.body.nombrearchivo2;
      var filePath = "docs\\lic";
      var fullpath = filePath + '\\' + archivo;
      sequelize.query(sql).then(function (ok) {
        /*
        if (req.body.estado == constants.INSTALADO) {
          fs.readFile(fullpath, function (err, data) {
            let transporter = nodemailer.createTransport({
              host: '200.14.165.153',
              port: 25,
              secure: false, // true for 465, false for other ports
              auth: {
                user: 'pnsilva', // generated ethereal user
                pass: 'Banco01'  // generated ethereal password
              }
            });
            // setup email data with unicode symbols
            let mailOptions = {
              from: 'pnsilva@labchile.cl', // sender address
              to: 'pnsilva@labchile.cl,ntorresg@bancochile.cl', // list of receivers
              subject: 'Autorización de instalación de software', // Subject line
              text: 'Autoriza instalación', // plain text body
              html: '<b>Estimados <br><br> La solicitud de instalación del producto "' + req.body.idProducto + '" ha sido autorizada. <br>Por favor proceder con la instalación. <br> Se adjunta información requerida para instalación.</b>', // html body
              attachments: [{ 'filename': archivo, 'content': data }]
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
          });
        }*/
        res.json({ error_code: 0 });
      }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
      });
      break;
  }
}

exports.list = function (req, res) {
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var cui = req.params.cui
  var periodo = req.params.periodo
  var proveedor = req.params.proveedor
  var filters = req.query.filters;
  var condition = "";

  var rol = req.session.passport.sidebar[0].rid;//req.user[0].rid;
  var roles = req.session.passport.sidebar[0].rol;
  console.log("ROL:" + rol);
  console.log("ROLES:" + JSON.stringify(roles));
  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.data != '0') {
          if (item.op === 'cn' || item.op === 'eq')
            if (item.field == 'nombre') {
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
  if (rol == constants.INSTALADORSERV) {
    sqlcount = "SELECT count(*) as count FROM lic.instalacion a WHERE a.idtipoinstalacion =" + constants.Servidor + " and a.estado IN ('" + constants.APROBADO + "','" + constants.NOINSTALADO + "')";
  } else if (rol == constants.INSTALADORPC) {
    sqlcount = "SELECT count(*) as count FROM lic.instalacion a WHERE a.idtipoinstalacion =" + constants.PC + " and a.estado IN ('" + constants.APROBADO + "','" + constants.NOINSTALADO + "')";
  } else if (rol == constants.PREPRODUCTIVO) {
    sqlcount = "SELECT count(*) as count FROM lic.instalacion a WHERE a.estado='" + constants.DERIVADO + "'";
  }

  if (filters && condition != "") {
    sqlcount += " AND " + condition + " ";
  }

  var sql;
  if (rol == constants.INSTALADORSERV) {
    sql = "DECLARE @PageSize INT; " +
      "SELECT @PageSize=" + rowspp + "; " +
      "DECLARE @PageNumber INT; " +
      "SELECT @PageNumber=" + page + "; " +
      "SELECT a.*, b.nombre, c.first_name+' '+ c.last_name AS usuario, d.nombre torre FROM lic.instalacion a JOIN lic.producto b ON a.idproducto=b.id " +
      "JOIN art_user c ON c.uid = a.idusuario " +
      "LEFT JOIN lic.torre d ON a.idtorre = d.id " +
      "WHERE a.idtipoinstalacion = " + constants.Servidor + " and a.estado IN ('" + constants.APROBADO + "','" + constants.NOINSTALADO + "')";
  } else if (rol == constants.INSTALADORPC) {
    sql = "DECLARE @PageSize INT; " +
      "SELECT @PageSize=" + rowspp + "; " +
      "DECLARE @PageNumber INT; " +
      "SELECT @PageNumber=" + page + "; " +
      "SELECT a.*, b.nombre, c.first_name+' '+ c.last_name AS usuario FROM lic.instalacion a JOIN lic.producto b ON a.idproducto=b.id " +
      "JOIN art_user c ON c.uid = a.idusuario " +
      "WHERE a.idtipoinstalacion = " + constants.PC + " and a.estado IN ('" + constants.APROBADO + "','" + constants.NOINSTALADO + "')";
  } else if (rol == constants.PREPRODUCTIVO) {
    sql = "DECLARE @PageSize INT; " +
      "SELECT @PageSize=" + rowspp + "; " +
      "DECLARE @PageNumber INT; " +
      "SELECT @PageNumber=" + page + "; " +
      "SELECT a.*, b.nombre, c.first_name+' '+ c.last_name AS usuario FROM lic.instalacion a JOIN lic.producto b ON a.idproducto=b.id " +
      "JOIN art_user c ON c.uid = a.idusuario " +
      "WHERE a.estado = '" + constants.DERIVADO + "'";

  } else {
    logger.error("Sin acceso a funcionalidad");
    return res.json({ error_code: 0 });
  }
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

exports.getTorres = function (req, res) {

  var sql = "select id, nombre from lic.torre";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

exports.downFile = function (req, res) {

  var file = "Documento1.docx";
  var filePath = "docs"+path.sep+"lic";
  var sql = "SELECT nombrearchivo FROM lic.instalacion WHERE id=" + req.params.id;
  sequelize.query(sql)
    .spread(function (rows) {
      file = rows[0].nombrearchivo;
      console.log("Archivo:" + filePath+ path.sep +file);
      fs.exists(filePath+ path.sep + file, function (exists) {
        if (exists) {
          res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + file
          });
          fs.createReadStream(filePath + path.sep + file).pipe(res);
        } else {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ERROR Archivo no Existe");
        }
      });
    });

};




