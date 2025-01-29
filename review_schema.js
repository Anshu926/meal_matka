const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'meal', // Reference the Meal model
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Model', // Reference the User model
        required: false // Make the user field optional
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming ratings are between 1 and 5
    },
    comment: {
        type: String,
        maxlength: 500
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
