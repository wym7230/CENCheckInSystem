var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');


// initialize Passport login LocalStrategy
passport.use('login', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function (req, username, password, done) {
        Admin.findOne({username: username.toLowerCase()}, function (err, user) {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, { message: 'Incorrect username.' });
            }
            if(!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    }
));

// initialize Passport signup localStrategy
passport.use('signup', new LocalStrategy({
        passReqToCallback : true
    }, function (req, username, password, done) {
        Admin.findOne({username: username.toLowerCase()}, function (err, user) {
            if(err){
                console.log('Error in SignUp: '+err);
                return done(err);
            }
            if(user){
                console.log('User name already exists');
                return done(null, false, {message: 'This username already exists'})
            }

            var newAdmin = new Admin();
            newAdmin.username = username.toLowerCase();
            newAdmin.name = req.body.name;
            newAdmin.setPassword(password);

            newAdmin.save(function (err) {
                if (err){
                    console.log('Error in Saving user: ' + err);
                    throw err;
                }
                return done(null, newAdmin);
            });

        })
    }
));









