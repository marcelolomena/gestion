var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/art_user');
var models = require('../models');
var bCrypt = require('bcryptjs');

module.exports = function (passport) {

	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
        function (req, username, password, done) {
            // check in database if a user with username exists or not
			models.User.belongsToMany(models.Rol, { foreignKey: 'uid', through: models.UsrRol });
			models.Rol.belongsToMany(models.User, { foreignKey: 'rid', through: models.UsrRol });

			models.User.find({
				where: { 'uname': username },
				include: [{model: models.Rol}]
			}).then(function (user) {
					if (!user) {
						console.log('Usuario no encontrado. ' + username);
						return done(null, false, req.flash('message', 'Usuario no encontrado.'));
					} else if (!isValidPassword(user, password)) {
						console.log('Clave inválida');
						return done(null, false, req.flash('message', 'Clave inválida')); // redirect back to login page
					} else {
						//console.log("----ZZZZZZZZZZZZZZZZ " + user.Rols.glosarol)
						//console.dir("EL ROL: "+resultado.Rols[0].glosarol)
						console.dir(user)
						return done(null, user);
					}
				}).error(function (err) {
					done(err);
				});

        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);

    }

}