var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
module.exports = (function () {

      var findByPrimaryKey = function (id, callback) {
            models.user.find({ where: { 'uid': id } }).then(function (user) {
                  callback(undefined, user);
            }).catch(function (err) {
                  logger.error(err)
                  callback(err, undefined);
            });
      }
      return {
            //Métodos públicos
            findByPrimaryKey: findByPrimaryKey
      };
})();