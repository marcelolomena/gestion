var models = require('../models');
var sequelize = require('../models/index').sequelize;
var paramService = require('../service/param');
var logger = require("../utils/logger");

exports.getListParam = function (req, res) {
    paramService.findParamByType(req.params.param, function (err, data) {
        if (err) {
            logger.error(err)
        } else {
            res.json(data)
        }
    });
};
