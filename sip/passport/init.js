var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');
		console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
		User.find({where: {id: user.id}}).success(function(user){
                done(null, user);
        }).error(function(err){
                done(err, null)
        });		
    });
	
    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}