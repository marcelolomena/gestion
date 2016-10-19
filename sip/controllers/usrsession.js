var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
exports.getuser = function (req, res) {
    logger.debug('user:'+req.user[0].nombre);
    logger.debug('user id:'+req.user[0].uid);
    res.json(req.user);
}