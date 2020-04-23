const mongoose = require('mongoose');
const validator = require('validator');
const cryto = require('crypto');
const bcrypt = require('bcryptjs');
const hashPassword = require('../utils/hashPassword')

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
    changedPasswordAt: { type: Date, default: Date.now() },
    role: { 
        type: String,
        enum: [ 'admin', 'guess', 'user' ],
        default: 'guess'
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

usersShemas.pre('save', async function(next) {
    // Verifier si le mot de passe n'as pas été modifié
    // Il permet de ne pas crypter le mot de passe une seconde fois vu qu'il est deja crypté
    // Donc si le mot de passe à deja été modifier alors on passe au suivant
    if (!this.isModified('password') || this.isNew) return next(); 

    this.password = await hashPassword(this.password);
    this.passwordConfirm = undefined;
    next()
});

usersShemas.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.changedPasswordAt) {
        console.log(changedPasswordAt, JWTTimestamp )
    }
    return false;
}

usersShemas.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next(); 
    this.changedPasswordAt = Date.now() - 1000;
    next();
});

usersShemas.methods.createPasswordResetToken = function() {
    const resetToken = cryto.randomBytes(32).toString('hex');

    this.passwordResetToken = cryto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', usersShemas );

module.exports = User;