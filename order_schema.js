const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Model', // Reference the user model for the customer
        required: true,
    },
    meal: { // Single meal reference instead of an array
        type: mongoose.Schema.Types.ObjectId,
        ref: 'meal', // Reference the Meal model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    deliveryAddress: { // Add the delivery address field
        type: String,
        required: true, // Make delivery address mandatory
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
