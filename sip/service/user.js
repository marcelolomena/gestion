var models = require('../models');
var sequelize = require('../models/index').sequelize;

module.exports = (function () {

      var findByPrimaryKey = function (id, callback) {
            models.user.find({ where: { 'uid': id } }).then(function (user) {
                  callback(undefined, user);
            }).catch(function (err) {
                  callback(err, undefined);
            });
      }
      return {
            //Métodos públicos
            findByPrimaryKey: findByPrimaryKey
      };
})();