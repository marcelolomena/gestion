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
                model: models.estructuracuibch
            }, {
                model: models.moneda
            }, {
                model: models.proveedor
            }
        ]
    }
];
var childEntity = models.compra;

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
        utilidad: req.body.utilidad,
        comentarios: req.body.comentarios,
        compra: {
            id: req.body.id || 0,
            idProducto: req.body.idProducto,
            contrato: req.body.contrato,
            ordenCompra: req.body.ordenCompra,
            idCui: req.body.idCui || null,
            sap: req.body.sap,
            idProveedor: req.body.idProveedor,
            fechaCompra: base.toDate(req.body.fechaCompra),
            fechaExpiracion: base.toDate(req.body.fechaExpiracion),
            licCompradas: req.body.licCompradas,
            idMoneda: req.body.idMoneda,
            valorLicencia: req.body.valorLicencias,
            valorSoporte: req.body.valorSoporte,
            fechaRenovaSoporte: base.toDate(req.body.fechaRenovaSoporte),
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
                    idProducto: item.id,
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
                    fechaCompra: base.fromDate(sItem.fechaCompra),
                    fechaExpiracion: base.fromDate(sItem.fechaExpiracion),
                    licCompradas: sItem.licCompradas,
                    cantidadSoporte: sItem.cantidadSoporte,
                    idMoneda: sItem.idMoneda,
                    valorLicencia: sItem.valorLicencia,
                    valorSoporte: sItem.valorSoporte,
                    fechaRenovaSoporte: base.fromDate(sItem.fechaRenovaSoporte),
                    factura: sItem.factura,
                    comprador: sItem.comprador,
                    correoComprador: sItem.correoComprador,
                    alertaRenovacion: item.alertaRenovacion ? 'Al día' : 'Vencida',
                    utilidad: item.utilidad,

                    fabricante: { nombre: item.fabricante ? item.fabricante.nombre : '' },
                    clasificacion: { nombre: item.clasificacion ? item.clasificacion.nombre : '' },
                    tipoInstalacion: { nombre: item.tipoInstalacion ? item.tipoInstalacion.nombre : '' },
                    tipoLicenciamiento: { nombre: item.tipoLicenciamiento ? item.tipoLicenciamiento.nombre : '' },
                    moneda: { nombre: sItem.moneda.moneda },
                    estructuracui: { nombre: sItem.estructuracuibch ? sItem.estructuracuibch.cui : '' },
                    proveedor: { nombre: sItem.proveedor.razonsocial }
                });
            });
        }
    });
    return result;
}
function excelMapper(data) {
    var result = [];
    _.each(data, function (item) {
        if (item.compras) {
            _.each(item.compras, function (sItem) {
                result.push([sItem.contrato,
                sItem.ordenCompra || '',
                sItem.estructuracuibch ? sItem.estructuracuibch.cui  : '',
                sItem.sap || '',
                item.fabricante? item.fabricante.nombre:'',
                sItem.proveedor.razonsocial,
                item.nombre,
                item.tipoInstalacion?item.tipoInstalacion.nombre:'',
                item.clasificacion?item.clasificacion.nombre:'',
                item.clasificacion?item.tipoLicenciamiento.nombre:'',
                base.fromDate(sItem.fechaCompra),
                base.fromDate(sItem.fechaExpiracion),
                sItem.licCompradas || '',
                sItem.cantidadSoporte || '',
                sItem.moneda.moneda,
                sItem.valorLicencia || '',
                sItem.valorSoporte || '',
                base.fromDate(sItem.fechaRenovaSoporte),
                sItem.factura || '',
                item.licStock || '',
                item.licOcupadas || '',
                item.alertaRenovacion ? 'Al día' : 'Vencida',
                sItem.comprador || '',
                sItem.correoComprador || '',
                item.utilidad || '',
                item.comentarios || '']
                );
            });
        }
    });
    return result;
}


function listxxx(req, res, entity, includes, transformer) {
    var page = parseInt(req.query.page);
    var rows = parseInt(req.query.rows);
    var orden = [[req.query.sidx || 'id', req.query.sord || 'desc']];
    var whereClause = base.getFilters(req.query.filters);

    return entity.findAll({
        where: whereClause,
        order: orden,
        include: includes
    }).then(function (data) {
        var resultData = transformer(data);
        var records = resultData.length;
        var total = Math.ceil(records / rows);
        var ini = rows * (page - 1);
        var fin = ini + rows;
        var result = _.filter(resultData, function (item, index) {
            return index >= ini && index < fin;
        });
        return res.json({ records: records, total: total, page: page, rows: result });
    }).catch(function (err) {
        logger.error(err.message);
        return res.json({ error_code: 1 });
    });
}
function create(entity, data, res) {
    entity.create(data).then(function (created) {
        data.compra.idProducto = created.id;
        childEntity.create(data.compra).then(function (created) {
            return res.json({ error: 0, glosa: '' });
        }).catch(function (err) {
            logger.error(err);
            return res.json({ error: 1, glosa: err.message });
        });
    }).catch(function (err) {
        logger.error(err);
        return res.json({ error: 1, glosa: err.message });
    });
}
function update(entity, data, res) {
    childEntity.update(data.compra, {
        where: {
            id: data.id
        }
    }).then(function (updated) {
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
            type: 'string',
            width: 80
        }, {
            caption: 'OrdenCompra',
            type: 'string',
            width: 80
        }, {
            caption: 'CUI',
            type: 'string',
            width: 80
        }, {
            caption: 'SAP',
            type: 'string',
            width: 80
        }, {
            caption: 'Fabricante',
            type: 'string',
            width: 180
        }, {
            caption: 'Proveedor',
            type: 'string',
            width: 300
        }, {
            caption: 'Software',
            type: 'string',
            width: 200
        }, {
            caption: 'DondeEstaInstalada',
            type: 'string',
            width: 160
        }, {
            caption: 'Clasificacion',
            type: 'string',
            width: 170
        }, {
            caption: 'TipoLicenciamiento',
            type: 'string',
            width: 200
        }, {
            caption: 'FechaCompra',
            type: 'string',
            width: 125
        }, {
            caption: 'FechaExpiracion',
            type: 'string',
            width: 70
        }, {
            caption: 'LicenciaCompradas',
            type: 'string',
            width: 110
        }, {
            caption: 'Soporte',
            type: 'string',
            width: 110
        }, {
            caption: 'Moneda',
            type: 'string',
            width: 110
        }, {
            caption: 'ValorLicencias',
            type: 'string',
            width: 125
        }, {
            caption: 'ValorSoportes',
            type: 'string',
            width: 80
        }, {
            caption: 'FechaRenovacion',
            type: 'string',
            width: 125
        }, {
            caption: 'Factura',
            type: 'string',
            width: 125
        }, {
            caption: 'NLicenciaCompradas',
            type: 'string',
            width: 100
        }, {
            caption: 'NLicenciaInstaladas',
            type: 'string',
            width: 100
        }, {
            caption: 'AlertaRenovacion',
            type: 'string',
            width: 40
        }, {
            caption: 'Comprador',
            type: 'string',
            width: 200
        }, {
            caption: 'CorreoComprador',
            type: 'string',
            width: 200
        }, {
            caption: 'Utilidad',
            type: 'string',
            width: 200
        }, {
            caption: 'Comentarios',
            type: 'string',
            width: 200
        }
    ];
    base.exportList(req, res, entity, includes, excelMapper, cols, 'InventarioLicencias');
}
module.exports = {
    list: list,
    action: action,
    excel: excel
}