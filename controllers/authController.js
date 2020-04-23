const User = require('../models/users');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/apiError');
const hashPassword = require('../utils/hashPassword');
const verifiedPassword = require('../utils/verifPassword');
const bcrypt = require('bcryptjs');
const signToken = require('../utils/signToken');
const {promisify} = require('util');


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

    if (freshUser.changedPasswordAfter(decoded.iat))

    next()
});