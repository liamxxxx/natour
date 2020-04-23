const User = require('../models/users');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/apiError');
const hashPassword = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const {promisify} = require('util');
const sendMail = require('../utils/email');
const crypto = require('crypto');

exports.signup = catchAsync (async(req, res, next) => {
    const { name, email, photo, password, passwordConfirm } = req.body;
    const hashedPassword = await hashPassword(password)
    const newUser = new User({name, email: email, photo, password: hashedPassword, passwordConfirm});
    console.log(newUser._id);
    // Sign token
    const token = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });
    console.log(token);
    await newUser.save();
    res
    .status(201)
    .json({
        status: 'success',
        token: token,
        data: newUser
    });
});

exports.signin = catchAsync( async (req, res, next) => {
    // Get email and password
    const { email, password } = req.body;

    // Password and email validation
    if (!email || !password) {
        return next (new APIError('Email or Password not provide', 400)); // pass
    }

    // Verified if email already exist or if password is correct
    const user = await User
                .findOne({email})
                .select('+password');

    if (!user || null) {
        return next(new APIError('User not exist, Please register', 404));
    }

    const verifPassword =  await bcrypt.compare(password, user.password);

    console.log('Password verified: ', verifPassword);

    if (!user || !verifPassword) {
        return next (new APIError('email or password incorrect', 401));
    }
    // Si ok génère un token 
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });

    res
    .status(200)
    .json({
        status: 'success',
        token: token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // verifie si le header contient une authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new APIError('You are not logged in, Please login to get access !', 401));
    }

    const decoded = await promisify (jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exist in token
    const freshUser = await User.findById(decoded._id);

    if (!freshUser) return next(new APIError('User belonging not available on given token, Please login'));

    req.user = freshUser;

    next();
});

exports.restrictBy = (...roles) => {
    return (req, res, next) => {
        // if list roles contain req.role
        if (!roles.includes(req.user.role)) return next(new APIError('Do not have permission to access at this ressources', 401));
        next();
    }
}

exports.forgotPassword = catchAsync(async(req, res, next) => {
    // Get user by email
    const user = await User.findOne({email: req.body.email});
    if (!user) return next(new APIError('This email no exist', 404));

    // Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    console.log(resetToken);

    // Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password ? Submit a patch request with your new password 
                    and confirm password to ${resetURL}. \nIf you didn't forget your password ignore this email!`;
    
    try {
        await sendMail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
        res
        .status(200)
        .json({
            status: 'success',
            message: 'Reset password email send successfully, Please check your mailbox !'
        })
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new APIError('There was an error sending the email. Try again later', 500))
    }
    
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    // Get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    // Search user
    const user = await User.findOne({
        passwordResetToken: hashedToken
        // passwordResetExpires: { $gte: Date.now() }
    });

    // Check if user is available or token was expired
    if(!user){
        return next(new APIError('Token is invalid or has expired', 400));
    }  
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.log('User: ',user);
    await user.save();

    // Log in user send, send jwt
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });

    res
    .status(200)
    .json({
        status: 'success',
        token: token
    })
});