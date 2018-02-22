'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.traduccion;
entity.belongsTo(models.producto, {
    foreignKey: 'idProducto'
});

var includes = [{
    model: models.producto
}];

function map(req) {
    return {
        id: req.body.id || 0,
        idProducto: req.body.idProducto || req.params.pId,
        nombre: req.body.nombre
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            nombre: item.nombre,
            idProducto: item.idProducto,
            producto: {
                nombre: item.producto.nombre
            },
            snow: item.snow,
            addm: item.addm
        }
    });
}

// function list(req, res) {
//     base.list(req, res, entity, includes, mapper);
// }

function list(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'idProducto';
    var sord = req.query.sord || 'desc';

    var filter_one = []
    var filter_four = []

    if (filters != undefined) {
        var item = {}
        var jsonObj = JSON.parse(filters);

        jsonObj.rules.forEach(function (item) {
            if (item.field === "idProducto") {
                filter_four.push({
                    ['nombre']: {
                        $like: '%' + item.data + '%'
                    }
                });
            } else if (item.field === "nombre") {
                filter_one.push({
                    [item.field]: {
                        $like: '%' + item.data + '%'
                    }
                });
            }
        })
    }

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.traduccion.belongsTo(models.producto, {
                foreignKey: 'idProducto'
            });
            models.traduccion.count({
                where: filter_one,
                include: [{
                    model: models.producto,
                    where: filter_four
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.traduccion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    // order: orden,
                    where: filter_one,
                    include: [{
                        model: models.producto,
                        where: filter_four
                    }]
                }).then(function (tradc) {
                    return res.json({
                        records: records,
                        total: total,
                        page: page,
                        rows: tradc
                    });
                }).catch(function (err) {
                    logger.error(err.message);
                    res.json({
                        error_code: 1
                    });
                });
            })
        }
    });
}

// exports.list = function (req, res) {
//     var page = req.query.page;
//     var rows = req.query.rows;
//     var filters = req.query.filters;
//     var sidx = req.query.sidx || 'numerorfp';
//     var sord = req.query.sord || 'desc';

//     var orden = "[solicitudcotizacion]." + sidx + " " + sord;

//     var filter_one = []
//     var filter_two = []
//     var filter_three = []
//     var filter_four = []

//     if (filters != undefined) {
//         //logger.debug(filters)
//         var item = {}
//         var jsonObj = JSON.parse(filters);

//         jsonObj.rules.forEach(function (item) {
//             if (item.field === "codigosolicitud") {
//                 filter_one.push({
//                     [item.field]: {
//                         $like: '%' + item.data + '%'
//                     }
//                 });
//             } else if (item.field === "numerorfp") {
//                 filter_one.push({
//                     [item.field]: item.data
//                 });
//             } else if (item.field === "cui") {
//                 filter_two.push({
//                     [item.field]: {
//                         $like: '%' + item.data + '%'
//                     }
//                 });
//             } else if (item.field === "descripcion") {
//                 filter_one.push({
//                     [item.field]: {
//                         $like: '%' + item.data + '%'
//                     }
//                 });
//             } else if (item.field === "first_name") {
//                 filter_three.push({
//                     [item.field]: {
//                         $like: '%' + item.data + '%'
//                     }
//                 });
//             } else if (item.field === "negociador") {
//                 filter_four.push({
//                     ['first_name']: {
//                         $like: '%' + item.data + '%'
//                     }
//                 });
//             }
//         })
//         filter_one.push({
//             borrado: 1
//         })
//     }

//     utilSeq.buildConditionFilter(filters, function (err, data) {
//         if (err) {
//             logger.debug("->>> " + err)
//         } else {
//             models.solicitudcotizacion.belongsTo(models.estructuracui, {
//                 foreignKey: 'idcui'
//             });
//             models.solicitudcotizacion.belongsTo(models.programa, {
//                 foreignKey: 'program_id'
//             });
//             models.solicitudcotizacion.belongsTo(models.user, {
//                 as: 'tecnico',
//                 foreignKey: 'idtecnico'
//             });
//             models.solicitudcotizacion.belongsTo(models.valores, {
//                 as: 'clasificacion',
//                 foreignKey: 'idclasificacionsolicitud'
//             });
//             models.solicitudcotizacion.belongsTo(models.user, {
//                 as: 'negociador',
//                 foreignKey: 'idnegociador'
//             });
//             models.solicitudcotizacion.belongsTo(models.tipoclausula, {
//                 foreignKey: 'idtipo'
//             });
//             models.solicitudcotizacion.belongsTo(models.valores, {
//                 as: 'grupo',
//                 foreignKey: 'idgrupo'
//             });
//             models.solicitudcotizacion.count({
//                 where: filter_one,
//                 include: [{
//                     model: models.estructuracui,
//                     where: filter_two
//                 }, {
//                     model: models.user,
//                     as: 'tecnico',
//                     where: filter_three
//                 }, {
//                     model: models.user,
//                     as: 'negociador',
//                     where: filter_four
//                 }]
//             }).then(function (records) {
//                 var total = Math.ceil(records / rows);
//                 models.solicitudcotizacion.findAll({
//                     offset: parseInt(rows * (page - 1)),
//                     limit: parseInt(rows),
//                     order: orden,
//                     where: filter_one,
//                     include: [{
//                         model: models.estructuracui,
//                         where: filter_two
//                     }, {
//                         model: models.programa
//                     }, {
//                         model: models.user,
//                         as: 'tecnico',
//                         where: filter_three
//                     }, {
//                         model: models.valores,
//                         as: 'clasificacion'
//                     }, {
//                         model: models.user,
//                         as: 'negociador',
//                         where: filter_four
//                     }, {
//                         model: models.tipoclausula
//                     }, {
//                         model: models.valores,
//                         as: 'grupo'
//                     }]
//                 }).then(function (solicitudcotizacion) {
//                     return res.json({
//                         records: records,
//                         total: total,
//                         page: page,
//                         rows: solicitudcotizacion
//                     });
//                 }).catch(function (err) {
//                     logger.error(err.message);
//                     res.json({
//                         error_code: 1
//                     });
//                 });
//             })
//         }
//     });

// }

function listChilds(req, res) {
    base.listChilds(req, res, entity, 'idProducto', includes, mapper);
}

function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return base.create(entity, map(req), res);
        case 'edit':
            return base.update(entity, map(req), res);
        case 'del':
            return base.destroy(entity, req.body.id, res);
    }
}

function actualizarSnow(req, res) {
    sequelize.query('EXECUTE lic.cargaSnow ').then(function (response) {
        res.json(response)
    }).error(function (err) {
        res.json(err);
    });
}

function actualizarAddm(req, res) {
    sequelize.query('EXEC lic.cargaAddm ').then(function (response) {
        res.json(response)
    }).error(function (err) {
        res.json(err);
    });
}

module.exports = {
    list: list,
    listChilds: listChilds,
    action: action,
    actualizarSnow: actualizarSnow,
    actualizarAddm: actualizarAddm
};