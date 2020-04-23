const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const APIError = require('../utils/apiError');

exports.getAllUsers = catchAsync (async (req, res, next) => {
    const users = await User.find();
    res
    .status(200)
    .json({
        status: 'success',
        data: { 
            users: users
        }
    });
});


exports.getUser = catchAsync (async (req, res, next) => {
    await User
        .findById(req.params.id)
        .exec((err, result) => {
            if (!result) return next(new APIError('User not found', 404))
            else if (err) return next(new APIError('Something went wrong !', 500));
            res
            .status(200)
            .json({
                status: 'success',
                data: { 
                    users: result
                }
            });
        });
});


exports.deleteUser = catchAsync (async (req, res, next) => {
    await User
        .findByIdAndDelete(req.params.id)
        .exec((err, result) => {
            if (!result) return next(new APIError('User not found', 404))
            else if (err) return next(new APIError('Something went wrong !', 500));
            res
            .status(200)
            .json({
                status: 'success',
                data: { 
                    users: result
                }
            });
        });
    
});


// exports.updateUser = catchAsync (async (req, res, next) => {
//     res
//     .status(200)
//     .json({
//         status: 'success',
//         message: 'Update done !'
//     });
// });
