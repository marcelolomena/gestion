var login = require('./login');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var co = require('co');
var logger = require("../utils/logger");
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    login(passport);

}