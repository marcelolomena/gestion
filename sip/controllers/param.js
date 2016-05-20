var models = require('../models');
var sequelize = require('../models/index').sequelize;
var paramService = require('../service/param');

var log = function (inst) {
    console.dir(inst.get())
}

exports.getListParam = function (req, res) {
    paramService.findParamByType(req.params.param, function (err, data) {
        if (err) {
            log(err)
        } else {
            res.json(data)
        }
    });
};
