const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();


router
    .route('/signup')
    .post(authController.signup)

router
    .route('/login')
    .post(authController.signin)


router
    .route('/forgotPassword')
    .post(authController.forgotPassword)

router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword)

router  
    .route('/')
    .get(usersController.getAllUsers);

router
    .route('/:id')
    .get(usersController.getUser)
    .delete(usersController.deleteUser)

module.exports = router;