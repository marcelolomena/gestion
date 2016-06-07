var login = require('./login');
var models = require('../models');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function (id, done) {
        
        models.User.belongsToMany(models.Rol, { foreignKey: 'uid', through: models.UsrRol });
		models.Rol.belongsToMany(models.User, { foreignKey: 'rid', through: models.UsrRol });
        models.User.find({ where: { 'uid': id },
    include: [{model: models.Rol}]
}).then(function (user) {
            done(null, user);
        }).error(function (err) {
            done(err, null)
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);

}