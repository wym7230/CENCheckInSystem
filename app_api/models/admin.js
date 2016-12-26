var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    hash: String,
    salt: String
});

// Set the hash of password
adminSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

// Checking the password
// Encrypt the salt and the password and see if the out put match the stored hash
adminSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

// Generate JWT & set expire date
adminSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 3);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "CEN_CheckIn"); // Store the SECRET to environment variable
};


mongoose.model('Admin', adminSchema);