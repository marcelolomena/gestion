'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var base = require('./lic-controller');
var logger = require("../../utils/logger");
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

function listProductoPendiente(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'idProducto';
    var sord = req.query.sord || 'desc';

    var wherebusqueda = 'SELECT [nombre] FROM [lic].[traduccion]'

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.producto.hasMany(models.compra, {
                constraints: false,
                foreignKey: 'idProducto'
            });
            models.producto.count({
                where: {
                    nombre: {
                        $notIn: sequelize.literal('(' + wherebusqueda + ')'),
                    }
                },
                include: [{
                    model: models.compra,
                    attributes: [
                        ['idProducto', 'idProducto']
                    ]
                }]
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.producto.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    // order: orden,
                    where: {
                        nombre: {
                            $notIn: sequelize.literal('(' + wherebusqueda + ')'),
                        }
                    },
                    include: [{
                        model: models.compra,
                        attributes: [
                            ['idProducto', 'idProducto']
                        ]
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

function listVersionPendiente(req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx || 'idProducto';
    var sord = req.query.sord || 'desc';

    var wherebusqueda = 'SELECT [nombre] FROM [lic].[traduccion]'

    var filter_one = []
    var filter_four = []

    utilSeq.buildConditionFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.snow$.count({
                where: {
                    aplicacion: {
                        $notIn: sequelize.literal('(' + wherebusqueda + ')')
                    },
                    Licencia: 'Yes'
                }
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.snow$.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    where: {
                        aplicacion: {
                            $notIn: sequelize.literal('(' + wherebusqueda + ')')
                        },
                        Licencia: 'Yes'
                    }
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

function getLikeVersiones(req, res) {
    var nombreProducto = '%' + req.params.pId.split(" ", 1) + '%';

    models.snow$.findAll({
        where: {
            aplicacion: {
                $like: nombreProducto
            }
        }
    }).then(function (valores) {
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({
            error: 1
        });
    });
}

function getVersiones(req, res) {
    models.snow$.findAll({
        where: {
            Licencia: 'Yes'
        }
    }).then(function (versiones) {
        return res.json(versiones);
    }).catch(function (err) {
        logger.error(err);
        res.json({
            error: 1
        });
    });
}

function actionProductoPendiente(req, res) {
    var action = req.body.oper;
    var nombreproducto = req.body.nombre;
    var versionaplicacion = req.body.aplicacion;

    switch (action) {
        case 'edit':
            models.producto.findOne({
                where: {
                    nombre: nombreproducto
                }
            }).then(function (idprodd) {
                models.snow$.findOne({
                    where: {
                        aplicacion: versionaplicacion
                    }
                }).then(function (sno) {
                    models.traduccion.create({
                        idProducto: idprodd.id,
                        nombre: req.body.aplicacion,
                        snow: sno.instalaciones,
                        addm: null
                    }).then(function (traducc) {
                        return res.json({
                            id: traducc.id,
                            message: 'EDITADO',
                            success: true
                        });
                    }).catch(function (err) {
                        logger.error(err.message)
                        res.json({
                            message: err.message,
                            success: false
                        });
                    })
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
            }).catch(function (err) {
                logger.error(err);
                return res.json({
                    error: 1,
                    glosa: err.message
                });
            });
            break;
    }
}

function getLikeProductos(req, res) {
    var nombreVersion = '%' + req.params.pId.split(" ", 1) + '%';
    models.producto.findAll({
        where: {
            nombre: {
                $like: nombreVersion
            }
        },
        attributes: ['id', 'nombre']
    }).then(function (likeprod) {
        return res.json(likeprod);
    }).catch(function (err) {
        logger.error(err);
        res.json({
            error: 1
        });
    });
}

function actionVersionesPendiente(req, res) {
    var action = req.body.oper;
    var nombreproducto = req.body.nombre;
    var versionaplicacion = req.body.aplicacion;

    switch (action) {
        case 'edit':
            models.producto.findOne({
                where: {
                    nombre: nombreproducto
                }
            }).then(function (idprodd) {
                models.snow$.findOne({
                    where: {
                        aplicacion: versionaplicacion
                    }
                }).then(function (sno) {
                    models.traduccion.create({
                        idProducto: idprodd.id,
                        nombre: req.body.aplicacion,
                        snow: sno.instalaciones,
                        addm: null
                    }).then(function (traducc) {
                        return res.json({
                            id: traducc.id,
                            message: 'EDITADO',
                            success: true
                        });
                    }).catch(function (err) {
                        logger.error(err.message)
                        res.json({
                            message: err.message,
                            success: false
                        });
                    })
                }).catch(function (err) {
                    logger.error(err);
                    return res.json({
                        error: 1,
                        glosa: err.message
                    });
                });
            }).catch(function (err) {
                logger.error(err);
                return res.json({
                    error: 1,
                    glosa: err.message
                });
            });
            break;
    }
}


module.exports = {
    list: list,
    listChilds: listChilds,
    action: action,
    actualizarSnow: actualizarSnow,
    actualizarAddm: actualizarAddm,
    listProductoPendiente: listProductoPendiente,
    listVersionPendiente: listVersionPendiente,
    getLikeVersiones: getLikeVersiones,
    getVersiones: getVersiones,
    actionProductoPendiente: actionProductoPendiente,
    getLikeProductos: getLikeProductos,
    actionVersionesPendiente: actionVersionesPendiente
};