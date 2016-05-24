var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {

    var action = req.body.oper;

    switch (action) {
        case "add":
            models.DetalleServicioCto.create({
                idcontrato: req.body.parent_id,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: req.body.idservicio,
                servicio: req.body.servicio,
                idcuenta: req.body.idcuenta,
                cuentacontable: req.body.cuentacontable,
                sap: req.body.sap,
                tarea: req.body.tarea,
                codigoart: req.body.codigoart,
                fechainicio: req.body.fechainicio,
                fechatermino: req.body.fechatermino,
                fechacontrol: req.body.fechacontrol,
                valorcuota: req.body.valorcuota,
                idmoneda: req.body.idmoneda,
                idfrecuencia: req.body.idfrecuencia,
                frecuenciafacturacion: req.body.frecuenciafacturacion,
                idplazocontrato: req.body.idplazocontrato,
                plazocontrato: req.body.plazocontrato,
                idcondicion: req.body.idcondicion,
                condicionnegociacion: req.body.condicionnegociacion,
                impuesto: req.body.impuesto,
                factorimpuesto: req.body.factorimpuesto,
                idcontactoproveedor: req.body.idcontactoproveedor,
                idestadocto: req.body.idestadocto,
                estadocontrato: req.body.estadocontrato,
                glosaservicio: req.body.glosaservicio,
                borrado: 1
            }).then(function (contrato) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
        case "edit":
            models.DetalleServicioCto.update({
                idcontrato: req.body.idcontrato,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: req.body.idservicio,
                servicio: req.body.servicio,
                idcuenta: req.body.idcuenta,
                cuentacontable: req.body.cuentacontable,
                sap: req.body.sap,
                tarea: req.body.tarea,
                codigoart: req.body.codigoart,
                fechainicio: req.body.fechainicio,
                fechatermino: req.body.fechatermino,
                fechacontrol: req.body.fechacontrol,
                valorcuota: req.body.valorcuota,
                idmoneda: req.body.idmoneda,
                idfrecuencia: req.body.idfrecuencia,
                frecuenciafacturacion: req.body.frecuenciafacturacion,
                idplazocontrato: req.body.idplazocontrato,
                plazocontrato: req.body.plazocontrato,
                idcondicion: req.body.idcondicion,
                condicionnegociacion: req.body.condicionnegociacion,
                impuesto: req.body.impuesto,
                factorimpuesto: req.body.factorimpuesto,
                idcontactoproveedor: req.body.idcontactoproveedor,
                idestadocto: req.body.idestadocto,
                estadocontrato: req.body.estadocontrato,
                glosaservicio: req.body.glosaservicio
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
            models.DetalleServicioCto.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
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
        sidx = "servicio";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idcontrato",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {

        if (err) {
            console.log("->>> " + err)
        } else {
            models.DetalleServicioCto.belongsTo(models.Contrato, { foreignKey: 'idcontrato' });
            models.DetalleServicioCto.belongsTo(models.EstructuraCui, { foreignKey: 'id' });
            models.DetalleServicioCto.belongsTo(models.Servicio, { foreignKey: 'id' });
            models.DetalleServicioCto.belongsTo(models.CuentasContables, { foreignKey: 'id' });
            models.DetalleServicioCto.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.DetalleServicioCto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.Contrato
                    }, {
                            model: models.EstructuraCui
                        }, {
                            model: models.Servicio
                        }]
                }).then(function (contratos) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: contratos });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
