"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
//var env = process.env.NODE_ENV || "development";//development, home
var env = process.env.NODE_ENV
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var logger = require("../utils/logger");
//console.log("la config: "+config);
config.logging = function(sql){

//logger.debug(sql)

  var sqlchico = sql.toLowerCase();

    console.log("||||||||||||||||: "+sql);
    var fecha = new Date();
  

};
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

var test = sequelize.authenticate()
  .then(function () {
    logger.debug('Connection has been established successfully.');
  })
  .catch(function (err) {
    logger.debug('Unable to connect to the database:', err);
  })
  .done();

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;