'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var sequelize = require('../../models/index').sequelize;
var constants = require("../../utils/constants");
var nodemailer = require('nodemailer');

exports.action = function (req, res) {
  var action = req.body.oper;

  switch (action) {
    case "edit":
      //Codigo de update
      var sql = "UPDATE lic.reserva SET estado='" + req.body.estado + "', comentarioaprobacion='" + req.body.comentarioaprobacion + "', " +
        "cui=" + req.body.cui + ", fechaaprobacion=getdate(), idusuariojefe=" + req.session.passport.user + " " +
        "WHERE id =" + req.body.id;

      var sqlmail = "select email from art_user where uid in (select idusuario from lic.reserva where id=" + req.body.id + ")";

      logger.debug("query:" + sql);
      logger.debug("querymail:" + sqlmail);
      sequelize.query(sql).then(function (ok) {
        sequelize.query(sqlmail).then(function (mailto) {
          logger.debug("mailto:" + mailto[0][0].email+ ", "+ JSON.stringify(mailto));
          var htmltext = '<b>Estimado(a) <br><br> La solicitud de reserva del producto "' +
            req.body.idProducto + '" ha sido aprobada. <br>Por favor mantenerse a la espera de la autorizaci&oacute;n del administrador de licencias.';
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
        }).catch(function (err) {
          logger.error(err);
          res.json({ error_code: 1 });
        });
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

  var superCui = function (uid, callback) {
    var rol = req.session.passport.sidebar[0].rid;
    console.log("ROLNEGOCIO:" + rol);
    if (rol == constants.JEFELIC) {
      var idcui = 0;
      var sql1 = "DECLARE @email VARCHAR(255); " +
        "SELECT @email=email FROM art_user WHERE uid=" + uid + ";" +
        "SELECT cui FROM RecursosHumanos WHERE emailJefe=@email AND periodo=(SELECT max(periodo) FROM RecursosHumanos)";
      logger.debug("query:" + sql1);
      sequelize.query(sql1)
        .spread(function (rows) {
          var cuis = "";
          if (rows.length > 0) {
            logger.debug("En cuis:" + JSON.stringify(rows));
            for (var i = 0; i < rows.length; i++) {
              logger.debug("cui:" + rows[i].cui);
              cuis = cuis + rows[i].cui + ",";
            }
            logger.debug("antes call:" + cuis.substring(0, cuis.length - 1));
            callback(cuis.substring(0, cuis.length - 1));
          } else {
            callback(cuis);
          }
        });
    } else {
      callback("*");
    }
  };

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
      logger.debug("***CONDICION:" + condition);
    }
  }
  var sqlcount = "SELECT count(*) AS count FROM lic.reserva a JOIN lic.producto b ON a.idproducto=b.id ";
  if (filters && condition != "") {
    sqlcount += " WHERE " + condition + " ";
  }

  superCui(req.session.passport.user, function (elcui) {//req.user[0].uid
    logger.debug('elcui:' + elcui)
    var rol = req.session.passport.sidebar[0].rid;//req.user[0].rid;
    var sqlok;
    if (rol == constants.JEFELIC) {
      var sql = "DECLARE @PageSize INT; " +
        "SELECT @PageSize=" + rowspp + "; " +
        "DECLARE @PageNumber INT; " +
        "SELECT @PageNumber=" + page + "; " +
        "SELECT a.*, b.nombre, c.first_name+' '+c.last_name AS usuario " +
        "FROM lic.reserva a JOIN lic.producto b ON a.idproducto=b.id " +
        "JOIN art_user c ON a.idusuario = c.uid " +
        "WHERE cui IN (" + elcui + ") ";

      if (filters && condition != "") {
        sql += "AND " + condition + " ";
        logger.debug("**" + sql + "**");
      }
      var sql2 = sql + "ORDER BY a.estado OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY";
      var records;
      logger.debug("query:" + sql2);

      sequelize.query(sqlcount).spread(function (recs) {
        var records = recs[0].count;
        var total = Math.ceil(parseInt(recs[0].count) / rowspp);
        sequelize.query(sql2).spread(function (rows) {
          res.json({ records: records, total: total, page: page, rows: rows });
        }).catch(function (err) {
          logger.error(err)
          res.json({ error_code: 1 });
        });
      })
    } else {
      logger.error("Sin acceso a funcionalidad");
      res.json({ error_code: 0 });
    }
  })
}

exports.getCUIs = function (req, res) {
  var rol = req.session.passport.sidebar[0].rid;
  console.log("ROLNEGOCIO getCUIs:" + rol);
  if (rol == constants.JEFELIC) {
    console.log("entro");
    var idcui = 0;
    var sql1 = "DECLARE @email VARCHAR(255); " +
      "SELECT @email=email FROM art_user WHERE uid=" + req.session.passport.user + ";" +
      "SELECT cui FROM RecursosHumanos WHERE emailTrab=@email AND periodo=(SELECT max(periodo) FROM RecursosHumanos)";
    logger.debug("query:" + sql1);
    sequelize.query(sql1)
      .spread(function (rows) {
        if (rows.length > 0) {
          logger.debug("query:" + rows + ", valor:" + rows[0].cui);
          idcui = rows[0].cui;
        } else {
          idcui = 0; //cui no existente para que no encuentre nada
        }
      }).then(function (servicio) {
        var sql = "DECLARE @idcui INT;" +
          "SET @idcui= sip.obtienecuipadrebch(" + idcui + "); " +
          "select a.cui id, convert(VARCHAR(10), a.cui)+' '+a.unidad AS nombre " +
          "from   lic.estructuracuibch a " +
          "where  a.cui =  @idcui  " +
          "union " +
          "select b.cui id, convert(VARCHAR(10), b.cui)+' '+b.unidad AS nombre " +
          "from   lic.estructuracuibch a,lic.estructuracuibch b " +
          "where  a.cui =  @idcui  " +
          "  and  a.cui = b.cuipadre " +
          "union " +
          "select c.cui id, convert(VARCHAR(10), c.cui)+' '+c.unidad AS nombre " +
          "from   lic.estructuracuibch a,lic.estructuracuibch b,lic.estructuracuibch c " +
          "where  a.cui =  @idcui  " +
          "  and  a.cui = b.cuipadre " +
          "  and  b.cui = c.cuipadre " +
          "union " +
          "select d.cui id, convert(VARCHAR(10), d.cui)+' '+d.unidad AS nombre " +
          "from   lic.estructuracuibch a,lic.estructuracuibch b,lic.estructuracuibch c,lic.estructuracuibch d " +
          "where  a.cui =  @idcui  " +
          "  and  a.cui = b.cuipadre " +
          "  and  b.cui = c.cuipadre " +
          "  and  c.cui = d.cuipadre";
        logger.debug("query2:" + sql);
        sequelize.query(sql)
          .spread(function (rows) {
            res.json(rows);
          });
      });
  } else {
    var sql = "SELECT cui id, convert(VARCHAR(10), cui)+' '+unidad AS nombre FROM lic.estructuracuibch WHERE estado='Activado'";
    logger.debug("query3:" + sql);
    sequelize.query(sql)
      .spread(function (rows) {
        res.json(rows);
      });
  }

};


