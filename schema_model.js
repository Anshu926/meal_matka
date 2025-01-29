const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 500
    },
    image: {
        type: String, // Store the URL or file path of the image
        required: true,
        trim: true // Removes extra whitespace
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Model', // Match the exact name used in mongoose.model
        required: true,
    }    
});

// Create the model
const Meal = mongoose.model('meal', MealSchema);

module.exports = Meal;
