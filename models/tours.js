const mongoose = require('mongoose');

const tourShemas = mongoose.Schema({
    name : { 
        type: String,
        unique: true, 
        required: [true, 'Tour must be have name'] 
    },
    duration: {
        type: Number, 
        required: [true, 'A tour must have duration']
        },
    maxGroupSize: {
        type: Number,
        required: [ true, 'A tour must have max group size' ]
     },
    difficulty: { 
        type: String,
        required: [true, 'A tour must have difficulty']
     },
    ratingsAverage: { 
        type: Number,
        required:  [true, 'A tour must have rating average '] ,
        default : 4.5
     },
    ratingsQuantity: { 
        type: Number,
        required: [ true, 'A tour must have rating quantity' ],
        default: 0
     },
    price: {
        type: Number, 
        required: [true, 'Tour must be have price'] 
    },
    summary: { 
        type: String,  
        trim: true,
        required: [ true, 'A tour must have summary' ]
    },
    description: { 
        type: String,
        trim: true,
        required: [ true, 'A tour must have description' ]
     },
    imageCover: { 
        type: String,
        required: [ true, 'A tour must have image cover' ]
     },
    images: [String],
    createAt: { 
        type: Date, 
        default: Date.now() 
    },
    startDates: [Date]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}

);

tourShemas.virtual('durationWeek').get(function() {
    return this.duration / 7;
});

const tourModel = mongoose.model('Tour', tourShemas);

exports.Tour = tourModel;