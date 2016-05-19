var models = require('../models');
var sequelize = require('../models/index').sequelize;

module.exports = (function () {

      var findParamByType = function (label, callback) {
            models.Parametro.findAll({ where: { 'tipo': label } }).then(function (user) {
                  callback(undefined, user);
            }).catch(function (err) {
                  callback(err, undefined);
            });
      }
      return {
            //Métodos públicos
            findParamByType: findParamByType
      };
})();