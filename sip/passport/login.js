var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var models  = require('../models');
var bCrypt = require('bcryptjs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in database if a user with username exists or not
			models.User.find({ where: { 'uname': username }}).then(function(user) {
			  if (!user) {
				console.log('User Not Found with username '+username);
                return done(null, false, req.flash('message', 'User Not found.'));       
			  } else if (!isValidPassword(user, password)) {
				console.log('Invalid Password');
                return done(null, false, req.flash('message', 'Clave inválida')); // redirect back to login page
			  } else {
				return done(null, user);
			  }
			}).error(function(err){
			  done(err);
			});

        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);

    }
    
}