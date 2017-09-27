'use strict';
var models = require('../../models');
var base = require('./lic-controller');
var logger = require('../../utils/logger');
var nodeExcel = require('excel-export');
var _ = require('lodash');

var entity = models.producto;
entity.belongsTo(models.fabricante, { foreignKey: 'idFabricante' });
entity.belongsTo(models.clasificacion, { foreignKey: 'idClasificacion' });
entity.belongsTo(models.tipoInstalacion, { foreignKey: 'idTipoInstalacion' });
entity.belongsTo(models.tipoLicenciamiento, { foreignKey: 'idTipoLicenciamiento' });
entity.hasMany(models.compra, { sourceKey: 'id', foreignKey: 'idProducto' });

var childEntity = models.compra;

function date2ma(fecha) {
    return fecha ? fecha.getMonth() + 1 + '-' + fecha.getFullYear() : '';
}
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
        compra: {
            id: req.body.id || 0,
            idProducto: req.body.idProducto || req.params.pId,
            contrato: req.body.contrato,
            ordenCompra: req.body.ordenCompra,
            idCui: req.body.idCui,
            sap: req.body.sap,
            idProveedor: req.body.idProveedor,
            fechaCompra: req.body.fechaCompra,
            fechaExpiracion: req.body.fechaExpiracion,
            licCompradas: req.body.licCompradas,
            canSoporte: req.body.canSoporte,
            idMoneda: req.body.idMoneda,
            valorLicencia: req.body.valorLicencia,
            valorSoporte: req.body.valorSoporte,
            fechaRenovaSoporte: req.body.fechaRenovaSoporte,
            factura: req.body.factura,
            comprador: req.body.comprador,
            correoComprador: req.body.correoComprador
        }
    };

}
function mapper(data) {
    var result = [];
    _.each(data, function (item) {
        if (item.compras) {
            _.each(item.compras, function (sItem) {
                result.push({
                    id: sItem.id,
                    contrato: sItem.contrato,
                    ordenCompra: sItem.ordenCompra,
                    idCui: sItem.idCui,
                    sap: sItem.sap,
                    idFabricante: item.idFabricante,
                    idProveedor: sItem.idProveedor,
                    nombre: item.nombre,
                    idTipoInstalacion: item.idTipoInstalacion,
                    idClasificacion: item.idClasificacion,
                    idTipoLicenciamiento: item.idTipoLicenciamiento,
                    licStock: item.licStock,
                    licOcupadas: item.licOcupadas,
                    fechaCompra: date2ma(sItem.fechaCompra),
                    fechaExpiracion: date2ma(sItem.fechaExpiracion),
                    licCompradas: sItem.licCompradas,
                    cantidadSoporte: sItem.cantidadSoporte,
                    idMoneda: sItem.idMoneda,
                    valorLicencia: sItem.valorLicencia,
                    valorSoporte: sItem.valorSoporte,
                    fechaRenovaSoporte: date2ma(sItem.fechaRenovaSoporte),
                    factura: sItem.factura,
                    comprador: sItem.comprador,
                    correoComprador: sItem.correoComprador,
                    alertaRenovacion: item.alertaRenovacion ? 'Al día' : 'Vencida',
                    utilidad: item.utilidad,
                    
                    fabricante: { nombre: item.fabricante.nombre },
                    clasificacion: { nombre: item.clasificacion.nombre },
                    tipoInstalacion: { nombre: item.tipoInstalacion.nombre },
                    tipoLicenciamiento: { nombre: item.tipoLicenciamiento.nombre },
                    moneda: { nombre: sItem.moneda.moneda },
                    estructuracui: { nombre: sItem.estructuracui ? sItem.estructuracui.cui + ' - ' + sItem.estructuracui.nombre : '' },
                    proveedor: { nombre: sItem.proveedor.razonsocial }
                });
            });
        }
    });
    return result;
}
var includes = [
    {
        model: models.fabricante
    }, {
        model: models.clasificacion
    }, {
        model: models.tipoInstalacion
    }, {
        model: models.tipoLicenciamiento
    }, {
        model: models.compra,
        include: [
            {
                model: models.estructuracui
            }, {
                model: models.moneda
            }, {
                model: models.proveedor
            }
        ]
    }
];
function listxxx(req, res, entity, includes, transformer) {
    var page = req.query.page;
    var rows = req.query.rows;

    var filters = req.query.filters;
    var sidx = req.query.sidx || 'id';
    var sord = req.query.sord || 'desc';
    var orden = entity.name + '.' + sidx + ' ' + sord;
    var whereClause = base.getFilters(filters);

    entity.count({
        where: whereClause
    })
    .then(function (records) {
        var total = Math.ceil(records / rows);
        return entity.findAll({
            offset: parseInt(rows * (page - 1)),
            limit: parseInt(rows),
            // order: orden,
            where: whereClause,
            include: includes
        })
            .then(function (data) {
                var resultData = transformer(data);
                return res.json({ records: records, total: total, page: page, rows: resultData });
            })
            .catch(function (err) {
                logger.error(err.message);
                return res.json({ error_code: 1 });
            })
    })
    .catch(function (err) {
        logger.error(err.message);
        return res.json({ error_code: 1 });
    });
}
function exportList(req, res, entity, includes, transformer, cols) {
    var filters = req.query.filters;
    var whereClause = base.getFilters(filters);
    return entity.findAll({
        where: whereClause,
        include: includes
    })
    .then(function (data) {
        var conf = {}
        conf.cols = cols;
        conf.rows = transformer(data);
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        res.setHeader("Content-Disposition", "attachment;filename=" + "preguntasolicitud_" + Math.floor(Date.now()) + ".xlsx");
        return res.end(result, 'binary');
    })
    .catch(function (err) {
        logger.error(err.message);
        return res.json({ error_code: 1 });
    })
}
function create(entity, data, res) {
    entity.create(data)
        .then(function (created) {
            return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1, glosa: err.message });
        });
}
function update(entity, data, res) {
    entity.update(data, {
        where: {
            id: data.id
        }
    })
        .then(function (updated) {
            return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1, glosa: err.message });
        });
}
function destroy(entity, id, res) {
    entity.destroy({
        where: {
            id: id
        }
    }).then(function (rowDeleted) {
        if (rowDeleted === 1) {
            logger.debug('Deleted successfully');
        }
        return res.json({ success: true, glosa: '' });
    }).catch(function (err) {
        logger.error(err);
        return res.json({ success: false, glosa: err.message });
    });
}
function list(req, res) {
    listxxx(req, res, entity, includes, mapper);
}
function action(req, res) {
    switch (req.body.oper) {
        case 'add':
            return create(entity, map(req), res);
        case 'edit':
            return update(entity, map(req), res);
        case 'del':
            return destroy(entity, req.body.id, res);
    }
}
function excel(req, res) {
    var cols = [
        {
            caption: 'Contrato',
            type: 'int',
            width: 80
        },
        {
            caption: 'OrdenCompra',
            type: 'int',
            width: 80
        },
        {
            caption: 'CUI',
            type: 'int',
            width: 80
        },
        {
            caption: 'SAP',
            type: 'int',
            width: 80
        },
        {
            caption: 'Fabricante',
            type: 'string',
            width: 180
        },
        {
            caption: 'Proveedor',
            type: 'string',
            width: 300
        },
        {
            caption: 'Software',
            type: 'string',
            width: 200
        },
        {
            caption: 'DondeestaInstalada',
            type: 'string',
            width: 160
        },
        {
            caption: 'Clasificacion',
            type: 'string',
            width: 170
        },
        {
            caption: 'TipodeLicenciamiento',
            type: 'string',
            width: 200
        },
        {
            caption: 'Mes/AñoCompra',
            type: 'string',
            width: 125
        },
        {
            caption: 'Mes/AñoExpiracion',
            type: 'string',
            width: 70
        },
        {
            caption: 'NLicenciaCompradas',
            type: 'int',
            width: 110
        },
        {
            caption: 'Moneda',
            type: 'string',
            width: 110
        },
        {
            caption: 'ValorLicencias',
            type: 'string',
            width: 125
        },
        {
            caption: 'ValorSoportes',
            type: 'string',
            width: 80
        },
        {
            caption: 'FechaRenovacion',
            type: 'string',
            width: 125
        },
        {
            caption: 'Factura',
            type: 'string',
            width: 125
        },
        {
            caption: 'NLicenciaCompradas',
            type: 'int',
            width: 100
        },
        {
            caption: 'NLicenciaInstaladas',
            type: 'int',
            width: 100
        },
        {
            caption: 'AlertaRenovacion',
            type: 'string',
            width: 40
        },
        {
            caption: 'Comprador',
            type: 'string',
            width: 200
        },
        {
            caption: 'CorreoComprador',
            type: 'string',
            width: 200
        },
    ];
    exportList(req, res, entity, includes, mapper, cols);
};
module.exports = {
    list: list,
    action: action,
    excel: excel
}