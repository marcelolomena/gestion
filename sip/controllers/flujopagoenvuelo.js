var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.action = function (req, res) {
    var action = req.body.oper;
    var montoorigen = req.body.montoorigen
    var costoorigen = req.body.costoorigen
    var porcentaje = 0.00
    var idsubtarea
    var fechainicio;
    var fechafin;
    var tipopago = 84

    if (action != "del") {
        if (costoorigen != "")
            costoorigen = costoorigen.split(".").join("").replace(",", ".")

        var ano = req.body.periodo.substring(0, 4);
        var mes = req.body.periodo.substring(4, 6);
        fechainicio = ano + '-' + mes + '-' + '01';
        if (parseInt(mes) == 02) {
            fechafin = ano + '-' + mes + '-' + '28';
        } else {
            fechafin = ano + '-' + mes + '-' + '30';
        }
        if (req.body.idsubtarea != "0") {
            idsubtarea = req.body.idsubtarea
        } else {
            idsubtarea = null
        }
    }

    console.log("fecha inicio: "+fechainicio)
    console.log("fecha fin: "+fechafin)

    switch (action) {
        case "add":
            models.flujopagoenvuelo.create({
                idtareaenvuelo: req.body.parent_id,
                idsubtarea: idsubtarea,
                periodo: req.body.periodo,
                costoorigen: costoorigen,
                glosaitem: req.body.glosaitem,
                porcentaje: porcentaje,
                idtipopago: tipopago,
                fechainicio: fechainicio,
                fechafin: fechafin,
                cantidad: 1,
                borrado: 1
            }).then(function (detalle) {
                return res.json({ error_code: 0 });
            }).catch(function (err) {
                logger.error(err);
                return res.json({ error_code: 1 });
            });

            break;
        case "edit":
            if (req.body.costoorigen != "") {
                models.flujopagoenvuelo.update({
                    idsubtarea: idsubtarea,
                    periodo: req.body.periodo,
                    costoorigen: costoorigen,
                    glosaitem: req.body.glosaitem,
                    porcentaje: porcentaje,
                    idtipopago: tipopago,
                    fechainicio: fechainicio,
                    fechafin: fechafin,
                    cantidad: 1
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (detalle) {
                        return res.json({ error_code: 0 });
                    }).catch(function (err) {
                        logger.error(err);
                        return res.json({ error_code: 1 });
                    });

            } else {
                models.flujopagoenvuelo.update({
                    periodo: req.body.periodo,
                    fechainicio: fechainicio,
                    fechafin: fechafin,
                }, {
                        where: {
                            id: req.body.id
                        }
                    }).then(function (detalle) {
                        return res.json({ error_code: 0 });
                    }).catch(function (err) {
                        logger.error(err);
                        return res.json({ error_code: 1 });
                    });
            }

            break;
        case "del":
            models.flujopagoenvuelo.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                return res.json({ error_code: 0 });
            }).catch(function (err) {
                logger.error(err);
                return res.json({ error_code: 1 });
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
        sidx = "periodo";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idtareaenvuelo",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.flujopagoenvuelo.belongsTo(models.art_sub_task, { foreignKey: 'idsubtarea' });
            models.art_sub_task.belongsTo(models.art_task, { foreignKey: 'task_id' });
            models.art_task.belongsTo(models.art_project_master, { foreignKey: 'pId' });
            models.flujopagoenvuelo.belongsTo(models.parametro, { foreignKey: 'idtipopago' });
            models.flujopagoenvuelo.count({
                where: data
            }).then(function (records) {
                //if (records > 0) {
                var total = Math.ceil(records / rows);
                models.flujopagoenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data,
                    include: [
                        {
                            model: models.art_sub_task,
                            include: [
                                {
                                    model: models.art_task,
                                    include: [
                                        {
                                            model: models.art_project_master
                                        }]
                                }]
                        },
                        {
                            model: models.parametro
                        }]
                }).then(function (compromisos) {
                    return res.json({ records: records, total: total, page: page, rows: compromisos });
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({ error_code: 1 });
                });
                //} else {
                //  insertaPeriodos(function (compromisos) {
                //    res.json({ records: 12, total: 12, page: 1, rows: compromisos });
                // });
                //}
            })
        }
    });
};
exports.getProyectosPorTareaEnVuelo = function (req, res) {
    sequelize.query('select a.pId, a.project_name from art_project_master a join art_program b on a.program= b.program_id ' +
        ' join sip.presupuestoenvuelo d on d.program_id=b.program_id join sip.tareaenvuelo e on e.idpresupuestoenvuelo=d.id ' +
        ' where e.id = :idtareaenvuelo and a.is_active=1',
        { replacements: { idtareaenvuelo: req.params.idtareaenvuelo }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.getTareasPorProyecto = function (req, res) {
    sequelize.query('select tId, task_title from art_task where pId=:idproyecto and is_active=1',
        { replacements: { idproyecto: req.params.idproyecto }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.getTareasPorTareaNuevoProyecto = function (req, res) {
    sequelize.query('select x.tId, x.task_title from art_task x join art_project_master a on a.pId=x.pId join art_program b on a.program= b.program_id join sip.iniciativaprograma c on c.codigoart= b.program_code join sip.presupuestoiniciativa d on d.idiniciativaprograma=c.id join sip.tareasnuevosproyectos e on e.idpresupuestoiniciativa=d.id where e.id = :idtareanuevoproyecto and x.is_active=1',
        { replacements: { idtareanuevoproyecto: req.params.idtareanuevoproyecto }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.getSubtareasPorTarea = function (req, res) {
    sequelize.query('select sub_task_id, title from art_sub_task where task_id=:idtarea and is_deleted=1',
        { replacements: { idtarea: req.params.idtarea }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};

exports.getSubtareasPorTareaNuevoProyecto = function (req, res) {
    sequelize.query('select z.sub_task_id, z.title from art_sub_task z join art_task x on x.tId= z.task_id join art_project_master a on a.pId=x.pId join art_program b on a.program= b.program_id join sip.iniciativaprograma c on c.codigoart= b.program_code join sip.presupuestoiniciativa d on d.idiniciativaprograma=c.id join sip.tareasnuevosproyectos e on e.idpresupuestoiniciativa=d.id where e.id = :idtareanuevoproyecto and z.is_deleted=1',
        { replacements: { idtareanuevoproyecto: req.params.idtareanuevoproyecto }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};
exports.getsubtareasportareaenvuelo = function (req, res) {
    sequelize.query('select z.sub_task_id, z.title from art_sub_task z join art_task x on x.tId= z.task_id  join art_project_master a on a.pId=x.pId  join art_program b on a.program= b.program_id  join sip.presupuestoenvuelo c on c.program_id=b.program_id join sip.tareaenvuelo d on d.idpresupuestoenvuelo=c.id  where d.id = :idtareaenvuelo and z.is_deleted=1',
        { replacements: { idtareaenvuelo: req.params.idtareaenvuelo }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        logger.error(err)
        res.json({ error_code: 1 });
    });
};