var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var css = require('../../utils/css');

exports.action = function (req, res) {
	var action = req.body.oper;
	if (action != "del") {
		if (req.body.fecha != "")
			fecha = req.body.fecha.split("-").reverse().join("-")
	}

	switch (action) {
		case "add":
			models.estadosolicitud.create({
				idsolicitudcotizacion: req.body.idsolicitudcotizacion,
				idcolor: req.body.idcolor,
				comentario: req.body.comentario,
				fecha: fecha,
				borrado: 1
			}).then(function (estadosolicitud) {

				bitacora.registrar(
					req.body.idsolicitudcotizacion,
					'estadosolicitud',
					estadosolicitud.id,
					'insert',
					req.session.passport.user,
					new Date(),
					models.estadosolicitud,
					function (err, data) {
						if (!err) {
							return res.json({ id: estadosolicitud.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
						} else {
							logger.error(err)
							return res.json({ id: estadosolicitud.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
						}
					});

			}).catch(function (err) {
				logger.error(err.message)
				res.json({ message: err.message, success: false });
			});
			break;
		case "edit":

			bitacora.registrar(
				req.body.idsolicitudcotizacion,
				'estadosolicitud',
				req.body.id,
				'update',
				req.session.passport.user,
				new Date(),
				models.estadosolicitud,
				function (err, data) {
					if (!err) {
						models.estadosolicitud.update({
							idtipodocumento: req.body.idtipodocumento,
							idcolor: req.body.idcolor,
							comentario: req.body.comentario,
							fecha: fecha,
						}, {
								where: {
									id: req.body.id
								}
							}).then(function (estadosolicitud) {
								res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
							}).catch(function (err) {
								logger.error(err)
								res.json({ message: err.message, success: false });
							});
					} else {
						logger.error(err)
						return res.json({ message: err.message, success: false });
					}
				});

			break;
		case "del":

			models.estadosolicitud.findAll({
				where: {
					id: req.body.id
				}
			}).then(function (estadosolicitud) {

				bitacora.registrar(
					req.body.idsolicitudcotizacion,
					'estadosolicitud',
					req.body.id,
					'delete',
					req.session.passport.user,
					new Date(),
					models.estadosolicitud,
					function (err, data) {
						if (!err) {
							models.estadosolicitud.destroy({
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

			}).catch(function (err) {
				logger.error(err);
				res.json({ message: err.message, success: false });
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

	if (!sidx)
		sidx = "fecha";

	if (!sord)
		sord = "desc";

	var orden = "[estadosolicitud]." + sidx + " " + sord;

	utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
		if (data) {
			models.estadosolicitud.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
			models.estadosolicitud.belongsTo(models.valores, { foreignKey: 'idcolor' });
			models.estadosolicitud.count({
				where: data
			}).then(function (records) {
				var total = Math.ceil(records / rows);
				models.estadosolicitud.findAll({
					offset: parseInt(rows * (page - 1)),
					limit: parseInt(rows),
					where: data,
					order: orden,
					include: [{
						model: models.solicitudcotizacion
					}, { model: models.valores }
					]
				}).then(function (estadosolicitud) {
					return res.json({ records: records, total: total, page: page, rows: estadosolicitud });
				}).catch(function (err) {
					logger.error(err);
					res.json({ error_code: 1 });
				});
			})
		}
	});
};
exports.download = function (req, res) {

	var idsolicitud = req.params.id
	return models.solicitudcotizacion.findOne({
		attributes: ['id', 'descripcion', 'numerorfp'],
		where: { id: idsolicitud }
	}).then(function (solicitudcotizacion) {

		var result = `
		<apex:page sidebar="false" contentType="application/msword" cache="true">
		<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='<a target="_blank" href="http://www.w3.org/TR/REC-html40'" rel="nofollow">http://www.w3.org/TR/REC-html40'</a>>
		<head>
			<meta http-equiv=Content-Type content="text/html;">
			<meta charset='utf-8'>
			<meta name=Generator content="Microsoft Word 15 (filtered)">
			<title> </title>
			<link type="text/css" href="http://localhost:3000/stylesheets/word.css">
		`
		console.log(result);
		console.log(css.css)
		result += css.css

		result += `
		</head>
		<body lang=ES link=blue vlink=purple>
		  <div class=WordSection1>
			<p class=MsoNormal align=center style='text-align:center'><b><span lang=ES-MX>&nbsp;</span></b></p>
			  <div align=center>
				<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width="100%" style='width:100.0%;border-collapse:collapse'>
		 		  <tr style='height:144.0pt'>
		  			<td width="100%" valign=top style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt; height:144.0pt'>
		  			  <p class=MsoNoSpacing align=center style='text-align:center'>
					    <span style='font-size:18.0pt'><img width=315 height=86 id="Imagen 9" src="http://localhost:3000/images/bancodechile.jpg"></span></p>
		  			</td>
		 		  </tr>
		 		  <tr style='height:72.0pt'>
		  			<td width="100%" style='width:100.0%;border:none;border-bottom:solid #4F81BD 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:72.0pt'>
		  			  <div style='border:none;border-bottom:solid #4F81BD 1.0pt;padding:0cm 0cm 4.0pt 0cm; margin-left:19.85pt;margin-right:0cm'>
		  				<p class=MsoTitle align=center style='margin-left:0cm;text-align:center'>
						  <span lang=ES-CL>
		  `
		result += solicitudcotizacion.descripcion

		result += `
		  				  </span>
						</p>
		  			  </div>
		  			</td>
		 		  </tr>
		 		  <tr style='height:36.0pt'>
		  			<td width="100%" style='width:100.0%;border:none;padding:0cm 5.4pt 0cm 5.4pt; height:36.0pt'>
		  			  <div style='border:none;border-bottom:solid #4F81BD 1.0pt;padding:0cm 0cm 4.0pt 0cm; margin-left:19.85pt;margin-right:0cm'>
		  				<p class=MsoTitle align=center style='margin-left:0cm;text-align:center'>
						  <span lang=ES-CL><b>RFP N°
						  `
		result += solicitudcotizacion.numerorfp
		result += `
						  </b></span>
						</p>
		  			  </div>
		  			</td>
		 		  </tr>
		 		  <tr style='height:18.0pt'>
		  			<td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:18.0pt'>
		  			  <p class=MsoNormal><span lang=ES-CL>&nbsp;</span></p>
		  			</td>
		 		  </tr>
		 		  <tr style='height:102.45pt'>
		  			<td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:102.45pt'>
		  			  <p class=MsoNormal><span lang=ES-CL style='color:#17365D'>&nbsp;</span></p>
		  			  <h2 style='margin-left:36.0pt;text-indent:0cm'><span lang=ES-MX style='color:#17365D'>&nbsp;</span></h2>
		  			</td>
		 		  </tr>
		 		  <tr style='height:18.0pt'>
		  			<td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:18.0pt'>
		  			  <p class=MsoNormal align=center style='margin-left:0cm;text-align:center'>
						<span class=MsoBookTitle><b>
						  <span style='font-size:16.0pt;line-height:115%; font-family:"Cambria",serif;font-variant:normal !important;color:#17365D; text-transform:uppercase'>
						    <span style='mso-field-code: DATE '></span>
						  </span></b>
						</span>
					  </p>
		  			</td>
		 		  </tr>
				</table>
			  </div>
			  <span lang=ES-CL style='font-size:11.0pt;line-height:115%;font-family:"Calibri",sans-serif'><br clear=all style='page-break-before:always'></span>
			  <p class=MsoNormal align=left style='margin-left:0cm;text-align:left'><b>
			    <span lang=ES-CL style='font-size:14.0pt;line-height:115%;font-family:"Cambria",serif; color:#365F91'>&nbsp;
				</span></b>
			  </p>
		`

		sequelize.query('EXECUTE sic.laviejaconfiable ' + idsolicitud).then(function (imprimir) {
			//console.log(imprimir[0][0].resultado)
			result += imprimir[0][0].resultado
			//logger.debug("ESTE ES EL RESULT " + result)

			result +=
				`
			</div>
		  </body>
		</html>
	  </apex:page>
	`

			var hdr = 'attachment; filename=RTF_' + Math.floor(Date.now()) + '.doc'
			res.setHeader('Content-disposition', hdr);
			res.set('Content-Type', 'application/msword;charset=utf-8');
			return res.status(200).send(result);
		}).catch(function (err) {
			logger.error(err.message);
			console.log("Error al buscar Solicitud:" + err)
			throw new Error(err);
		});

	}).catch(function (err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});



}