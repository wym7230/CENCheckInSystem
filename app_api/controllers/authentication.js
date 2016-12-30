var passport = require('passport');
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');

module.exports.login = function (req, res) {
    if(!req.body.username || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    // Call login strategy to authenticate given user
    // return an access token
    passport.authenticate('login', function (err, user, info) {
        var token;

        if(err){
            res.status(404).json(err);
        }

        if(user){
            token = user.generateJwt();
            res.json({
                "token": token
            });
        } else {
            res.status(401).json(info);
        }
    })(req, res);
};

module.exports.signup = function (req, res) {
    if(!req.body.username || !req.body.password || !req.body.name){
        sendJSONresponse(res, 401, {
            "message": "All fields required"
        });
        return;
    }

    // Call signup strategy to sign up and authenticate given user
    // return an access token
    passport.authenticate('signup', function (err, user, info) {
        var token;
        if(err){
            res.status(404).json(err);
        }

        if(user){
            token = user.generateJwt();
            res.json({
                "token": token
            });
        } else {
            res.status(401).json(info);
        }
    })(req, res);
};

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

