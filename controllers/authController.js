const User = require('../models/users');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/apiError');
const hashPassword = require('../utils/hashPassword');
const verifiedPassword = require('../utils/verifPassword');
const bcrypt = require('bcryptjs');
const signToken = require('../utils/signToken');



exports.signup = catchAsync (async(req, res, next) => {
    const { name, email, photo, password, passwordConfirm } = req.body;
    const hashedPassword = await hashPassword(password)
    const newUser = new User({name, email: email, photo, password: hashedPassword, passwordConfirm});
    console.log(newUser._id);
    // Sign token
    const token = jwt.sign({_id: newUser._id}, 'JWTSECRET');
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
        return next (new APIError('Email or Password not provide', 400));
    }

    // Verified if email already exist or if password is correct
    const user = await User.findOne({email});
    const verifPassword =  await bcrypt.compare(password, user.password);

    if (!user || !verifPassword) {
        return next (new APIError('email or password incorrect', 401));
    }
    // Si ok génère un token 
    const token = signToken(user_id);

    res
    .status(200)
    .json({
        status: 'success',
        token: token
    });
});

exports.protect = catchAsync((req, res, next) => {
    let token;
    // verifie si le header contient une authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.header.authorization.split(' ')[1];
    }
    console.log(token);
    return next(new APIError('You are not logged in, Please login to get access !', 401));
});