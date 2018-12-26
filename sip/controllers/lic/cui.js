'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;

var entity = models.estructuracuibch;


exports.listAll = function (req, res) {

  var sql = "SELECT cui id, convert(VARCHAR(10), cui)+' '+unidad AS nombre FROM lic.estructuracuibch WHERE estado in ('Activado', 'Principal')";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};


exports.listAllRes = function (req, res) {

  var sql = "SELECT cui id, convert(VARCHAR(10), cui)+' '+unidad AS nombre FROM lic.estructuracuibch WHERE estado='Activado'";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};



