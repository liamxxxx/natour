const express = require('express');
const router = express.Router();
const controller = require('../controllers/tourController');
const authController = require('../controllers/authController');

router
    .route('/')
    .get(authController.protect, controller.readAllTour)
    .post(controller.createOneTour)

router
    .route('/tourStats')
    .get(controller.tourStats)
    
router
    .route('/:id')
    .get(controller.readOneTour)
    .delete(authController.protect, authController.restrictBy('admin'), controller.deleteOneTour)
    .put(controller.updateOneTour)

module.exports = router;