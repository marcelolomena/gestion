var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/art_user');
var models = require('../models');
var bCrypt = require('bcryptjs');
var co = require('co');

module.exports = function (passport) {

	passport.use('local', new LocalStrategy({
		passReqToCallback: true
	},
        function (req, username, password, done) {
			models.user.find({
				where: { 'uname': username }
			}).then(function (user) {
				if (!user) {
					console.log('Usuario no encontrado. ' + username);
					return done(null, false, req.flash('message', 'Usuario no encontrado.'));
					//return done(null, false, {message: "Usuario no encontrado."});
				} else {
					co(function* () {
						var rol = yield models.usrrol.findAll({
							attributes: ['id'],
							where: { 'uid': user.uid },
						});
						if (!rol) {
							console.log('No tiene rol');
							return done(null, false, req.flash('message', 'Sin rol asignado')); // redirect back to login page
							//return done(null, false, {message: "Sin rol asignado."});
						} else {
							console.log("rol : " + rol.id);
							if (!isValidPassword(user, password)) {
								console.log('Clave inválida');
								return done(null, false, req.flash('message', 'Clave inválida')); // redirect back to login page
								//return done(null, false, {message: "Clave inválida."});
							} else {
								return done(null, user);
							}
						}

					}).catch(function (err) {
						console.log(err);
					});
				}

			}).catch(function (err) {
				done(err)
			});

        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);

    }


}