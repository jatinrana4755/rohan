var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var userModel = require('./../app/models/User.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

module.exports = function(app, passport){
    var token = '';
	app.use(passport.initialize());
	app.use(passport.session());

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
    	token = jwt.sign({ email: user[0].email, fullName: user[0].fullName, _id: user[0]._id}, 'mysecret', {expiresIn : 86400});
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: '807027039789-a3ldchgp1qqv48gg4imu6c0ilnonb9tb.apps.googleusercontent.com',
        clientSecret: 'k792P2k8mrf6uvDlSptmV5bn',
        callbackURL: "http://ec2-18-188-99-165.us-east-2.compute.amazonaws.com/auth/google/callback"

    },
    function(accessToken, refreshToken, profile, done) {
          // try to find the user based on their google id
          setTimeout(function() {
            User.find({ 'email' : profile.emails[0].value }, function(err, user) {
                if (err)
                    return done(err);

                if (user.length>0) {
                    token = jwt.sign({ email: user[0].email, fullName: user[0].fullName, _id: user[0]._id}, 'mysecret', {expiresIn : 86400});
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();
                    // set all of the relevant information
                    newUser.fullName  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err, savedUser) {
                        if (err)
                            throw err;
                        token = jwt.sign({ email: savedUser.email, fullName: savedUser.fullName, _id: savedUser._id}, 'mysecret', {expiresIn : 86400});
                        return done(null, savedUser);
                    });
                }
            });
        }, 1000);
    }
    ));


	app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: 'http://abudquiz.s3-website.us-east-2.amazonaws.com' }), function(req, res){
        res.redirect('http://abudquiz.s3-website.us-east-2.amazonaws.com/#!/google/' + token);
    });
    app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
	
    return passport;
};