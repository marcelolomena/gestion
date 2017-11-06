'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.producto;
entity.belongsTo(models.fabricante, {
    foreignKey: 'idFabricante'
});
entity.belongsTo(models.clasificacion, {
    foreignKey: 'idClasificacion'
});
entity.belongsTo(models.tipoInstalacion, {
    foreignKey: 'idTipoInstalacion'
});
entity.belongsTo(models.tipoLicenciamiento, {
    foreignKey: 'idTipoLicenciamiento'
});
entity.belongsTo(models.parametro, {
    foreignKey: 'alertaRenovacion'
});

var includes = [{
    model: models.fabricante
}, {
    model: models.clasificacion
}, {
    model: models.tipoInstalacion
}, {
    model: models.tipoLicenciamiento
}, {
    model: models.parametro
}];

function map(req) {
    return {
        id: req.body.id || 0,
        idFabricante: req.body.idFabricante,
        nombre: req.body.nombre,
        idTipoInstalacion: req.body.idTipoInstalacion,
        idClasificacion: req.body.idClasificacion,
        idTipoLicenciamiento: req.body.idTipoLicenciamiento,
        licStock: req.body.licStock,
        licOcupadas: req.body.licOcupadas,
        alertaRenovacion: req.body.alertaRenovacion,
        utilidad: req.body.utilidad,
        comentarios: req.body.comentarios,
        licTramite: req.body.licTramite
    }
}

function mapper(data) {
    return _.map(data, function (item) {
        return {
            id: item.id,
            idFabricante: item.idFabricante,
            // idFabricante: item.idFabricante ? item.idFabricante : '',
            nombre: item.nombre,
            idTipoInstalacion: item.idTipoInstalacion,
            idClasificacion: item.idClasificacion,
            idTipoLicenciamiento: item.idTipoLicenciamiento,
            licStock: item.licStock,
            ilimitado: item.ilimitado ? 'Ilimitado' : '',
            licOcupadas: item.licOcupadas,
            snow: item.snow ? item.snow : '',
            comentarios: item.comentarios,
            fabricante: {
                nombre: item.fabricante ? item.fabricante.nombre : ''
            },
            clasificacion: {
                nombre: item.clasificacion ? item.clasificacion.nombre : ''
            },
            tipoInstalacion: {
                nombre: item.tipoInstalacion ? item.tipoInstalacion.nombre : ''
            },
            tipoLicenciamiento: {
                nombre: item.tipoLicenciamiento ? item.tipoLicenciamiento.nombre : ''
            },
            alertaRenovacion: {
                nombre: item.parametro ? item.parametro.nombre : ''
            },
            licTramite: item.licTramite,
        }
    });
}

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}


function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.nombre,
            pId: item.idFabricante,
            idClasificacion: item.idClasificacion,
            idTipoInstalacion: item.idTipoInstalacion,
            idTipoLicenciamiento: item.idTipoLicenciamiento
        };
    });
}



function getFabricante(req, res) {
    var idProducto = parseInt(req.params.idProducto);
    entity.findOne({
            where: {
                id: idProducto
            },
            attributes: ['idfabricante']
        })
        .then(function (result) {
            var idFabric = result.dataValues.idfabricante;
            models.fabricante.findOne({
                    where: {
                        id: idFabric
                    },
                    attributes: ['nombre']
                })
                .then(function (resulta) {
                    return res.json({
                        error: 0,
                        idFabric: idFabric,
                        nombre: resulta.nombre
                    });
                })
                .catch(function (err) {
                    return res.json({
                        error_code: 1
                    });
                });
        })
        .catch(function (err) {
            return res.json({
                error_code: 1
            });
        });
}

function getProducto(req, res) {
    var idFabricante = req.params.idFabricante;
    var sql = 'SELECT id, idfabricante, nombre FROM lic.producto WHERE idfabricante = ' + idFabricante;
    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });

};

function getProductoLicTramite(req, res) {
    var idProducto = parseInt(req.idProducto);
    entity
        .findOne({
            where: {
                id: idProducto
            },
            attributes: ['lictramite']
        })
        .then(function (result) {
            return res.json({
                error: 0,
                glosa: '',
                numero: result.lictramite
            });
        })
        .catch(function (err) {
            return res.json({
                error_code: 1
            });
        });
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

function listcompratramite(req, res) {
    var ntt = models.detalleCompraTramite;
    base.listChilds(req, res, ntt, 'idproducto', [{
        model: models.producto,
        model: models.fabricante,
        model: models.moneda
    }], function (data) {
        var result = [];
        _.each(data, function (item) {

            var row = {
                id: item.id,
                fechaInicio: base.fromDate(item.fechaInicio),
                fechaTermino: base.fromDate(item.fechaTermino),
                fechaControl: base.fromDate(item.fechaControl),
                monto: item.monto,
                idMoneda: item.idMoneda,
                comentario: item.comentario,
                numsolicitud: item.numsolicitud,
                numero: item.numero,
                idMoneda: {
                    nombre: item.moneda.moneda
                },
                estado: item.estado
            };
            result.push(row);
        });
        return result;
    })
}

module.exports = {
    list: list,
    action: action,
    listAll: listAll,
    getFabricante: getFabricante,
    getProducto: getProducto,
    getProductoLicTramite: getProductoLicTramite,
    listcompratramite: listcompratramite
}