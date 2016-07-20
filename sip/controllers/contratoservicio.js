var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.action = function (req, res) {
    var action = req.body.oper;
    var valorcuota = req.body.valorcuota
    var impuesto = req.body.impuesto
    var factorimpuesto = req.body.factorimpuesto

/*
    if (action != "del") {
        if (valorcuota != "")
            valorcuota = valorcuota.split(".").join("").replace(",", ".")

        if (impuesto != "")
            impuesto = impuesto.split(".").join("").replace(",", ".")

        if (factorimpuesto != "")
            factorimpuesto = factorimpuesto.split(".").join("").replace(",", ".")
    }
*/
    switch (action) {
        case "add":
            //var factor = req.body.impuesto == 1 ? 1.19 : 1;

            models.servicio.belongsTo(models.cuentascontables, { foreignKey: 'idcuenta' });
            models.servicio.find({
                where: { 'id': req.body.idservicio },
                include: { model: models.cuentascontables }
            }).then(function (servicio) {
                //console.log("idcuenta ------------------> " + servicio.idcuenta);
                //console.log("cuentacontable ------------------> " + servicio.CuentasContable.cuentacontable);
                models.detalleserviciocto.create({
                    idcontrato: req.body.parent_id,
                    anexo: req.body.anexo,
                    idcui: req.body.idcui,
                    idservicio: req.body.idservicio,
                    //servicio: req.body.servicio,
                    idcuenta: servicio.idcuenta,
                    cuentacontable: servicio.cuentascontable.cuentacontable,
                    sap: req.body.sap,
                    tarea: req.body.tarea,
                    codigoart: req.body.codigoart,
                    fechainicio: req.body.fechainicio,
                    fechatermino: req.body.fechatermino,
                    fechacontrol: req.body.fechacontrol,
                    valorcuota: valorcuota,
                    idmoneda: req.body.idmoneda,
                    idfrecuencia: req.body.idfrecuencia,
                    frecuenciafacturacion: req.body.frecuenciafacturacion,
                    idplazocontrato: req.body.idplazocontrato,
                    plazocontrato: req.body.plazocontrato,
                    idcondicion: req.body.idcondicion,
                    condicionnegociacion: req.body.condicionnegociacion,
                    impuesto: impuesto,
                    factorimpuesto: factorimpuesto,
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
            }).error(function (err) {

            });
            break;
        case "edit":
            models.detalleserviciocto.update({
                idcontrato: req.body.idcontrato,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: req.body.idservicio,
                //servicio: req.body.servicio,
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
                impuesto: impuesto,
                factorimpuesto: factorimpuesto,
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
            models.detallecompromiso.destroy({
                where: {
                    iddetalleserviciocto: req.body.id
                }
            }).then(function (rowDeleted) {

                models.detalleserviciocto.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });

            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
    }
}

exports.oper = function (req, res) {
    var action = req.body.oper;
    var valorcuota = req.body.valorcuota
    var impuesto = req.body.impuesto
    var factorimpuesto = req.body.factorimpuesto

    if (action != "del") {
        if (valorcuota != "")
            valorcuota = valorcuota.split(".").join("").replace(",", ".")

        if (impuesto != "")
            impuesto = impuesto.split(".").join("").replace(",", ".")

        if (factorimpuesto != "")
            factorimpuesto = factorimpuesto.split(".").join("").replace(",", ".")
    }

    switch (action) {
        case "add":
            //var factor = req.body.impuesto == 1 ? 1.19 : 1;
            //console.log("idcuenta ------------------> " + servicio.idcuenta);
            //console.log("cuentacontable ------------------> " + servicio.CuentasContable.cuentacontable);
            models.detalleserviciocto.create({
                idcontrato: req.body.parent_id,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: null,
                //servicio: null,
                idcuenta: null,
                cuentacontable: null,
                sap: req.body.sap,
                tarea: req.body.tarea,
                codigoart: req.body.codigoart,
                fechainicio: req.body.fechainicio,
                fechatermino: req.body.fechatermino,
                fechacontrol: req.body.fechacontrol,
                valorcuota: valorcuota,
                idmoneda: req.body.idmoneda,
                idfrecuencia: req.body.idfrecuencia,
                frecuenciafacturacion: req.body.frecuenciafacturacion,
                idplazocontrato: req.body.idplazocontrato,
                plazocontrato: req.body.plazocontrato,
                idcondicion: req.body.idcondicion,
                condicionnegociacion: req.body.condicionnegociacion,
                impuesto: impuesto,
                factorimpuesto: factorimpuesto,
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
            models.detalleserviciocto.update({
                idcontrato: req.body.idcontrato,
                anexo: req.body.anexo,
                idcui: req.body.idcui,
                idservicio: req.body.idservicio,
                //servicio: req.body.servicio,
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
                impuesto: impuesto,
                factorimpuesto: factorimpuesto,
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
            models.detallecompromiso.destroy({
                where: {
                    iddetalleserviciocto: req.body.id
                }
            }).then(function (rowDeleted) {

                models.detalleserviciocto.destroy({
                    where: {
                        id: req.body.id
                    }
                }).then(function (rowDeleted) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ error_code: 1 });
                });

            }).catch(function (err) {
                console.log(err);
                res.json({ error_code: 1 });
            });

            break;
    }
}

exports.sap = function (req, res) {
    models.proyecto.findAll({
        attributes: ['id', 'sap']
    }).then(function (proyecto) {
        //console.dir(proyecto)
        res.json(proyecto);
    }).catch(function (err) {
        //console.log(err);
        res.json({ error_code: 1 });
    });
}

exports.plantillapresupuesto = function (req, res) {

    models.plantillapresupuesto.belongsTo(models.servicio, { foreignKey: 'idservicio' });
    models.plantillapresupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
    models.plantillapresupuesto.findAll({
        where: { idproveedor: req.params.id },
        attributes: ['id'],
        include: [
            {
                model: models.servicio, attributes: ['id', 'nombre']
            },
            {
                model: models.estructuracui, attributes: ['id', 'cui', 'nombre']
            }]
    }).then(function (plantillapresupuesto) {
        res.json(plantillapresupuesto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

}
 
exports.cuiforservice = function (req, res) {

    models.plantillapresupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
    models.plantillapresupuesto.findAll({
        where: [{ idproveedor: req.params.idp }, { idservicio: req.params.ids }],
        attributes: ['id'],
        include: [
            {
                model: models.estructuracui, attributes: ['id', 'cui']
            }]
    }).then(function (plantillapresupuesto) {
        res.json(plantillapresupuesto);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

}

exports.tarea = function (req, res) {
    models.detalleproyecto.findAll({
        attributes: ['id', 'tarea'],
        where: { idproyecto: req.params.id }
    }).then(function (proyecto) {
        res.json(proyecto);
    }).catch(function (err) {
        //console.log(err);
        res.json({ error_code: 1 });
    });
}

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "servicio.nombre";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idcontrato",
        "op": "eq",
        "data": req.params.id
    }];

    //console.log(")))))))))))))))))))))) " + req.user.last_name)

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {

        if (err) {
            console.log("->>> " + err)
        } else {

            models.detalleserviciocto.belongsTo(models.contrato, { foreignKey: 'idcontrato' });
            models.detalleserviciocto.belongsTo(models.estructuracui, { foreignKey: 'idcui' });
            models.detalleserviciocto.belongsTo(models.servicio, { foreignKey: 'idservicio' });
            models.detalleserviciocto.belongsTo(models.cuentascontables, { foreignKey: 'idcuenta' });
            models.detalleserviciocto.belongsTo(models.moneda, { foreignKey: 'idmoneda' });

            models.detalleserviciocto.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.detalleserviciocto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [{
                        model: models.contrato
                    }, {
                            model: models.estructuracui
                        }, {
                            model: models.servicio
                        }]
                }).then(function (contratos) {
                    //console.dir(contratos)
                    res.json({ records: records, total: total, page: page, rows: contratos });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
