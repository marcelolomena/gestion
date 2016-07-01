var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var nodeExcel = require('excel-export');


exports.tareasap = function (req, res) {

    models.detalleproyecto.belongsTo(models.proyecto, { foreignKey: 'idproyecto' });
    models.detalleproyecto.findAll({
        attributes: ['idproyecto', 'tarea'],
        include: [{
            model: models.proyecto, where: { sap: req.params.id },
        }]
    }).then(function (proyecto) {
        res.json(proyecto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

}

exports.tareacui = function (req, res) {

    models.plantillapresupuesto.belongsTo(models.servicio, { foreignKey: 'idservicio' });
    models.plantillapresupuesto.belongsTo(models.proveedor, { foreignKey: 'idproveedor' });
    models.plantillapresupuesto.findAll({
        where: { idcui: req.params.id },
        attributes: ['id'],
        include: [
            {
                //model: models.servicio, where: { 'tarea': { $ne: null } }, attributes: ['tarea']
                model: models.servicio, attributes: ['tarea']
            },
            {
                model: models.proveedor, attributes: ['id', 'razonsocial']
            }]
    }).then(function (plantillapresupuesto) {
        res.json(plantillapresupuesto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

}

exports.tareaservicio = function (req, res) {

    models.servicio.belongsTo(models.cuentascontables, { foreignKey: 'idcuenta' });
    models.servicio.findAll({
        where: { tarea: req.params.id },
        include: [{
            model: models.cuentascontables,
        }]
    }).then(function (proyecto) {
        res.json(proyecto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

}

exports.action = function (req, res) {
    var action = req.body.oper;

    switch (action) {
        case "add":
            models.detalleenvuelo.create({
                idproyectoenvuelo: req.body.idproyectoenvuelo,
                tarea: req.body.tarea,
                nombre: req.body.nombre,
                idcui: req.body.idcui,
                uid: req.body.uid,
                idproveedor: req.body.idproveedor,
                nombreproveedor: req.body.nombreproveedor,
                idcuenta: req.body.idcuenta,
                cuentacontable: req.body.cuentacontable,
                presupuesto: req.body.presupuesto,
                presupuestopesos: req.body.presupuestopesos,
                compromiso: req.body.compromiso,
                compromisopesos: req.body.compromisopesos,
                realajustado: req.body.realajustado,
                realajustadopesos: req.body.realajustadopesos,
                saldotarea: req.body.saldotarea,
                saldotareapesos: req.body.saldotareapesos,
                idcontrato: req.body.idcontrato,
                numerocontrato: req.body.numerocontrato,
                solicitudcontrato: req.body.solicitudcontrato,
                borrado: 1
            }).then(function (contrato) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.detalleenvuelo.update({
                idproyectoenvuelo: req.body.idproyectoenvuelo,
                tarea: req.body.tarea,
                nombre: req.body.nombre,
                idcui: req.body.idcui,
                uid: req.body.uid,
                idproveedor: req.body.idproveedor,
                nombreproveedor: req.body.nombreproveedor,
                idcuenta: req.body.idcuenta,
                cuentacontable: req.body.cuentacontable,
                presupuesto: req.body.presupuesto,
                presupuestopesos: req.body.presupuestopesos,
                compromiso: req.body.compromiso,
                compromisopesos: req.body.compromisopesos,
                realajustado: req.body.realajustado,
                realajustadopesos: req.body.realajustadopesos,
                saldotarea: req.body.saldotarea,
                saldotareapesos: req.body.saldotareapesos,
                idcontrato: req.body.idcontrato,
                numerocontrato: req.body.numerocontrato,
                solicitudcontrato: req.body.solicitudcontrato,
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (contrato) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });
            break;
        case "del":
            models.detalleenvuelo.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    console.log('Deleted successfully');
                }
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
    }

}

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "nombre";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idproyectoenvuelo",
        "op": "eq",
        "data": req.params.id
    }];
    models.detalleenvuelo.belongsTo(models.proyectosenvuelo, { foreignKey: 'idproyectoenvuelo' });
    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {
            models.detalleenvuelo.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.detalleenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.proyectosenvuelo
                    }]
                }).then(function (detalleenvuelo) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: detalleenvuelo });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};