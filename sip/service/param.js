var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
module.exports = (function () {

      var findParamByType = function (label, callback) {
            models.parametro.findAll({ where: { 'tipo': label } }).then(function (user) {
                  callback(undefined, user);
            }).catch(function (err) {
                  logger.error(err)
                  callback(err, undefined);
            });
      }
      return {
            //Métodos públicos
            findParamByType: findParamByType
      };
})();