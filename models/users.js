const mongoose = require('mongoose');
const validator = require('validator');


const usersShemas = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Tell your name'] 
    },
    email: { 
        type: String, 
        required: [true, 'Please provide your email'], 
        unique: true ,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: { 
        type: String, 
    },
    password:  {
         type: String, 
         required: [true, 'Please you must provide a password'],
         minLength: 8,
         select: false
        },
    passwordConfirm: {
        type: String, 
        required: [true, 'Please confirm your password'] 
    },
    changedPasswordAt: { type: Date, default: Date.now() }
});

usersShemas.pre('save', function(next) {
    this.passwordConfirm = undefined;
    next()
});

usersShemas.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.changedPasswordAt) {
        console.log(changedPasswordAt, JWTTimestamp )
    }
    return false;
}

const User = mongoose.model('User', usersShemas );

module.exports = User;