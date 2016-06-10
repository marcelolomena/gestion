var models = require('../models');
var sequelize = require('../models/index').sequelize;

exports.getuser = function (req, res) {
    console.log('user:'+req.user[0].nombre);
    console.log('user id:'+req.user[0].uid);
    res.json(req.user);
}