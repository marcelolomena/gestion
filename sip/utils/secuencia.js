var logger = require("./logger");
var sequelize = require('../models/index').sequelize;

module.exports = (function () {
    var getSecuencia = function (pin, callback) {
        try {
            sequelize.query("execute lic.obtienecodigoautorizacion").spread(function (numero) {
                return callback(undefined,numero[0].secuencia);
            });
        } catch (e) {
            logger.error(e)
            return callback(e);
        }
    }
    
    return {
        getSecuencia: getSecuencia
    };
})();