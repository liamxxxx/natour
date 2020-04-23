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

module.exports = router;