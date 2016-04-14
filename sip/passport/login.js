var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var models  = require('../models');

//var bCrypt = require('bcrypt-nodejs');
var bCrypt = require('bcryptjs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
		console.log("username:" + username);
		console.log("password:"+ password);
		
            // check in database if a user with username exists or not
			models.User.find({ where: { 'uname': username }}).then(function(user) {
			//User.find({ where: { 'uname': username }}).success(function(user) {
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
			/*
            User.find({ 'uname' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );
			*/

        })
    );


    var isValidPassword = function(user, password){
		var salt1 = bCrypt.genSaltSync(10);
		var hash1 = bCrypt.hashSync(password, salt1);
		var salt2 = bCrypt.genSaltSync(10);
		var hash2 = bCrypt.hashSync(password, salt2);
		console.log("hash1 [" + hash1 + "]");
		console.log("hash2 [" + hash2 + "]");
		console.log("password [" + password + "]");
		console.log("user.password [" + user.password + "]");
		//var hash = bCrypt.hashSync(usersPassword);
        return bCrypt.compareSync(password, user.password.trim());
    }
    
}