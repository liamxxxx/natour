const { Tour } = require('../models/tours');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/apiError');

// Tour stats
const tourStats = catchAsync (async (req, res) => {
     
    const stats = await Tour.aggregate([
        // First stage
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        // Second stage
        {
            $group: { 
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRating: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
             }
        }
    ]);
    res
    .status(200)
    .json({
        status: 'success',
        data: stats
    });
});

// GET 
const readAllTour = catchAsync(async (req, res) => {    

    // Execute query
    // let tour = await queryResult;
    let features = new APIFeature(Tour.find(), req.query).filter().sort().limitFields().paginate();
    let tour = await features.query;

    res
        .status(200)
        .json({
            status: "succes",
            length: tour.length,
            data: tour
        });
});

const readOneTour = catchAsync (async (req, res, next) => {
    await Tour.findById(req.params.id)
        .exec((err, result) => {
            if (!result) {
                return next(new APIError('Given tour ID not found', 404))
            }
            res
            .status(200)
            .json(result)
            
        });
});

// Check post middleware
const checkPostTour = async (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        res
            .status(400)
            .json({
                "status": "fail",
                "message": "Missing name or price"
            });
    }
    next();
}

// POST
const createOneTour = catchAsync(async (req, res, next) => {    
        const { 
            name,
            duration,
            maxGroupSize,
            difficulty,
            ratingsAverage,
            ratingsQuantity,
            price,
            summary,
            description,
            imageCover,
            images,
            startDates

         } = req.body
        const tour = new Tour({
            name: name,
            duration: duration,
            maxGroupSize: maxGroupSize,
            difficulty: difficulty,
            ratingsAverage: ratingsAverage,
            ratingsQuantity: ratingsQuantity,
            price: price,
            summary: summary,
            description: description,
            imageCover: imageCover,
            images: images,
            startDates: startDates
        });
        await tour.save();
        res 
        .status(200)
        .json(tour)
});
// DELETE
const deleteOneTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id)
        .exec((err, result) => {
            if (!result) {
               return next(new APIError('Tour ID not found', 404))
            }
            res
            .status(200)
            .json(result)
        });
});

// UPDATE
const updateOneTour =  catchAsync(async (req, res, next) => {
    const { 
        name,
        duration,
        maxGroupSize,
        difficulty,
        ratingsAverage,
        ratingsQuantity,
        price,
        summary,
        description,
        imageCover,
        images,
        startDates
     } = req.body;
    await Tour.findByIdAndUpdate(req.params.id, { 
        name,
        duration,
        maxGroupSize,
        difficulty,
        ratingsAverage,
        ratingsQuantity,
        price,
        summary,
        description,
        imageCover,
        images,
        startDates
     })
        .exec((err, result) => {
            if (!result) {
                return next(new APIError('Tour ID not found', 404));
            }
            res
            .status(200)
            .json({"message": "Update done"});
        });

    
});

module.exports = {
    readAllTour,
    readOneTour,
    deleteOneTour,
    updateOneTour,
    createOneTour,
    checkPostTour,
    tourStats
}