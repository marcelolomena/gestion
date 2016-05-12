var models = require('../models');
var sequelize = require('../models/index').sequelize;

module.exports.findByPrimaryKey = function (id,callback){

      models.User.find({ where: { 'uid': id } }).then(function (user) {
                  callback(user);
        });
} 