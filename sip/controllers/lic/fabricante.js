'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var base = require('./lic-controller');
var _ = require('lodash');

var entity = models.fabricante;

function map(req) {
    return {
        id: req.body.id || 0,
        nombre: req.body.nombre,
        borrado: req.body.borrado || 1
    }
}

function mapper(data) {
    return data;
    // return _.map(data, function (item) {
    //     return {
    //         id: item.id,
    //         nombre: item.nombre
    //     }
    // });
}

var includes = [];

function list(req, res) {
    base.list(req, res, entity, includes, mapper);
}

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            nombre: item.nombre
        };
    });
}

function listAllFabricante(req, res) {
    var sql = 'SELECT DISTINCT b.id, b.nombre FROM lic.producto a ' +
        'JOIN lic.fabricante b ON b.id = a.idfabricante ' +
        'JOIN lic.compra c ON c.idproducto = a.id ';
    sequelize.query(sql)
        .spread(function (rows) {
            return res.json(rows);
        });
};

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

function existeOtroFabricante(req, res) {
    var nombre = req.params.otroFabricante;
    entity.findOne({
            where: {
                nombre: nombre
            },
            attributes: ['nombre']
        })
        .then(function (result) {
            return res.json({
                error_code: 0,
                nombre: result.nombre
            });
        })
        .catch(function (err) {
            return res.json({
                error_code: 1
            });
        });
}


module.exports = {
    list: list,
    action: action,
    listAll: listAll,
    existeOtroFabricante: existeOtroFabricante,
    listAllFabricante: listAllFabricante
};