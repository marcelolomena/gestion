var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/art_user');
var models = require('../models');
var bCrypt = require('bcryptjs');
var co = require('co');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
module.exports = function (passport) {

	// add other strategies for more authentication flexibility
/*	
	passport.use('daniel', new LocalStrategy({
		usernameField: 'usuario',
		passwordField: 'clave' // this is the virtual field on the model
	},
		function (usuario, clave, done) {
			logger.debug("clave : " + clave)
			models.user.find({
				where: { 'uname': usuario }
			}, function (err, user) {
				if (err) return done(err);

				if (!user) {
					return done(null, false, {
						message: 'Este usuario no existe.'
					});
				}
				if (!user.authenticate(clave)) {
					return done(null, false, {
						message: 'La clave no es correcta.'
					});
				}
				return done(null, user);
			});
		}
	));
*/

	passport.use('local', new LocalStrategy({
		/*usernameField: 'email',*/ passReqToCallback: true
	},
		function (req, username, password, done) {
			//logger.debug('Sistema. ' +req.body.sistema);
			models.user.find({
				where: { 'uname': username }
			}).then(function (user) {
				if (!user) {
					logger.debug('Usuario no encontrado. ' + username);
					return done(null, false, req.flash('message', 'Usuario no encontrado.'));
					//return done(null, false, {message: "Usuario no encontrado."});
				} else {

					co(function* () {
						var rol = yield models.usrrol.findAll({
							attributes: ['id'],
							where: { 'uid': user.uid },
						});
						//logger.debug('Sistema: '+ sistema);
						if (!rol) {
							logger.debug('No tiene rol');
							return done(null, false, req.flash('message', 'Sin rol asignado')); // redirect back to login page
							//return done(null, false, {message: "Sin rol asignado."});
						} else {
							//logger.debug("rol : " + rol.id);
							if (!isValidPassword(user, password)) {
								logger.debug('Clave inválida');
								return done(null, false, req.flash('message', 'Clave inválida')); // redirect back to login page
								//return done(null, false, {message: "Clave inválida."});
							} else {
								registraLogin(user, req);
								return done(null, user);
							}
						}

					}).catch(function (err) {
						logger.error(err)
					});
				}

			}).catch(function (err) {
				logger.error(err)
				done(err)
			});

		})
	);

	var isValidPassword = function (user, password) {
		return bCrypt.compareSync(password, user.password);

	}

	var registraLogin= function (user, req) {
		//console.log('Sistema. ' +req.body.sistema);
		var sql = "INSERT INTO sip.usr_login (uid, hora, dia, idsistema, borrado) "+
		"VALUES ("+user.uid+", getdate(),convert(VARCHAR(8), getdate(), 112),1, 1)";
		console.log("query:" + sql);
		sequelize.query(sql).spread(function (saps) {
			console.log("Login registrado:" + saps);
			//return saps;
		}).catch(function (err) {
			console.log(err);
		});		
	}

}