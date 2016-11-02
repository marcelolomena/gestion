var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
exports.getuser = function (req, res) {
    logger.debug('user:'+req.session.passport.sidebar[0].nombre);
    logger.debug('user id:'+req.session.passport.user);
    res.json(req.user);
}