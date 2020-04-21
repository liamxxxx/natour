const express = require('express');
const router = express.Router();
const controller = require('../controllers/tourController');

router
    .route('/')
    .get(controller.readAllTour)
    .post(controller.createOneTour)

router
    .route('/tourStats')
    .get(controller.tourStats)
    
router
    .route('/:id')
    .get(controller.readOneTour)
    .delete(controller.deleteOneTour)
    .put(controller.updateOneTour)

module.exports = router;