var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
    var action = req.body.oper;
    if (action != "del") {
        if (req.body.fechaenviorfp != "")
            fechaenviorfp = req.body.fechaenviorfp.split("-").reverse().join("-")
    }

    switch (action) {
        case "add":
            models.solicitudcotizacion.create({
                idcui: req.body.idcui,
                idtecnico: req.body.idtecnico,
                tipocontrato: req.body.tipocontrato,
                program_id: req.body.program_id,
                codigoart: req.body.codigoart,
                sap: req.body.sap,
                descripcion: req.body.descripcion,
                codigosolicitud: req.body.codigosolicitud,
                idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                idnegociador: req.body.idnegociador,
                correonegociador: req.body.correonegociador,
                fononegociador: req.body.fononegociador,
                numerorfp: req.body.numerorfp,
                fechaenviorfp: fechaenviorfp,
                direccionnegociador: req.body.direccionnegociador,
                colorestado: 'Rojo',
                borrado: 1,
                idtipo: req.body.idtipo,
                idgrupo: req.body.idgrupo
            }).then(function (solicitudcotizacion) {
                res.json({ error: 0, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.solicitudcotizacion.update({
                idcui: req.body.idcui,
                idtecnico: req.body.idtecnico,
                tipocontrato: req.body.tipocontrato,
                program_id: req.body.program_id,
                codigoart: req.body.codigoart,
                sap: req.body.sap,
                descripcion: req.body.descripcion,
                codigosolicitud: req.body.codigosolicitud,
                idclasificacionsolicitud: req.body.idclasificacionsolicitud,
                idnegociador: req.body.idnegociador,
                correonegociador: req.body.correonegociador,
                fononegociador: req.body.fononegociador,
                direccionnegociador: req.body.direccionnegociador,
                numerorfp: req.body.numerorfp,
                fechaenviorfp: fechaenviorfp,
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (solicitudcotizacion) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function (err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });



            break;
        case "del":
            models.solicitudcotizacion.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ success: true, glosa: '' });
            }).catch(function (err) {
                logger.error(err)
                res.json({ success: false, glosa: err.message });
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

    if (!sidx)
        sidx = "rut";

    if (!sord)
        sord = "asc";

    var orden = "[grupo]." + sidx + " " + sord;

    var filter_one = []
    var filter_two = []
    var filter_three = []
    var filter_four = []

    if (filters != undefined) {
        //logger.debug(filters)
        var item = {}
        var jsonObj = JSON.parse(filters);

        jsonObj.rules.forEach(function (item) {
            if (item.field) {
                filter_one.push({ [item.field]: { $like: '%' + item.data + '%' } });
            } 
        })
    }

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.grupo.count({
                where: filter_one
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.grupo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: filter_one
                }).then(function (mac) {
                    return res.json({ records: records, total: total, page: page, rows: mac });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

}

exports.actiondesglose = function (req, res) {
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
				models.estadosolicitud.belongsTo(models.valores, { foreignKey: 'idcolor' });
				models.estadosolicitud.findAll({
					order: 'fecha DESC',
					where: {
						idsolicitudcotizacion: req.body.idsolicitudcotizacion
					},
					include: [
						{ model: models.valores }
					]
				}).then(function (estadosolicitud) {

					//logger.debug('--------------> EL COLOR ES: ' + estadosolicitud[0].valore.nombre)
					models.solicitudcotizacion.update({
						colorestado: estadosolicitud[0].valore.nombre,
					}, {
							where: {
								id: req.body.idsolicitudcotizacion
							}
						})


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
							//fecha: fecha,
						}, {
								where: {
									id: req.body.id
								}
							}).then(function (estadosolicitud) {
								models.estadosolicitud.belongsTo(models.valores, { foreignKey: 'idcolor' });
								models.estadosolicitud.findAll({
									order: 'fecha DESC',
									where: {
										idsolicitudcotizacion: req.body.idsolicitudcotizacion
									},
									include: [
										{ model: models.valores }
									]
								}).then(function (estadosolicitud) {

									logger.debug('--------------> EL COLOR ES: ' + estadosolicitud[0].valore.nombre)
									models.solicitudcotizacion.update({
										colorestado: estadosolicitud[0].valore.nombre,
									}, {
											where: {
												id: req.body.idsolicitudcotizacion
											}
										})


								});


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

								models.estadosolicitud.belongsTo(models.valores, { foreignKey: 'idcolor' });
								models.estadosolicitud.findAll({
									order: 'fecha DESC',
									where: {
										idsolicitudcotizacion: req.body.idsolicitudcotizacion
									},
									include: [
										{ model: models.valores }
									]
								}).then(function (estadosolicitud) {

									var nuevocolor = "Rojo"
									if (estadosolicitud[0] != undefined) {
										logger.debug('--------------> EL COLOR ES: ' + estadosolicitud[0].valore.nombre)
										nuevocolor = estadosolicitud[0].valore.nombre
									}
									models.solicitudcotizacion.update({
										colorestado: nuevocolor
									}, {
											where: {
												id: req.body.idsolicitudcotizacion
											}
										})


								});
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

exports.listdesglose = function (req, res) {

	var page = req.query.page;
	var rows = req.query.rows;
	var filters = req.query.filters;
	var sidx = req.query.sidx;
	var sord = req.query.sord;

	var additional = [{
		"field": "idgrupo",
		"op": "eq",
		"data": req.params.id
	}];

	if (!sidx)
		sidx = "rut";

	if (!sord)
		sord = "asc";

	var orden = "[grupodesglose]." + sidx + " " + sord;

	utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
		if (data) {
			models.grupodesglose.belongsTo(models.grupo, { foreignKey: 'idgrupo' });
			models.grupodesglose.count({
				where: data
			}).then(function (records) {
				var total = Math.ceil(records / rows);
				models.grupodesglose.findAll({
					offset: parseInt(rows * (page - 1)),
					limit: parseInt(rows),
					where: data,
					order: orden,
					include: [{
						model: models.grupo
					}]
				}).then(function (grupodesglose) {
					return res.json({ records: records, total: total, page: page, rows: grupodesglose });
				}).catch(function (err) {
					logger.error(err);
					res.json({ error_code: 1 });
				});
			})
		}
	});
};
