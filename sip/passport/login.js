var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/art_user');
var models = require('../models');
var bCrypt = require('bcryptjs');
var co = require('co');

module.exports = function (passport) {

	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
        function (req, username, password, done) {
			models.user.find({
				where: { 'uname': username }
			}).then(function (user) {

				co(function* () {
					var rol = yield models.usrrol.find({
						attributes: ['id'],
						where: { 'uid': user.uid },
					});
					//console.dir(rol);
					//console.log(rol.id);
					if (!user) {
						console.log('Usuario no encontrado. ' + username);
						return done(null, false, req.flash('message', 'Usuario no encontrado.'));
					} else if (!isValidPassword(user, password)) {
						console.log('Clave inválida');
						return done(null, false, req.flash('message', 'Clave inválida')); // redirect back to login page
					} else if (rol == null) {
						console.log('No tiene rol');
						return done(null, false, req.flash('message', 'Sin rol asignado')); // redirect back to login page
					} else {
						return done(null, user);
					}
				}).catch(function (err) {
					console.log(err);
				});

			}).catch(function (err) {
				done(err)
			});

        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);

    }


}