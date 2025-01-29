const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
});

// Add the passport-local-mongoose plugin
// This automatically adds username and password fields and simplifies authentication logic
UserSchema.plugin(passportLocalMongoose);

// Create the User Model
const User_Model = mongoose.model('User_Model', UserSchema);

// Export the User Model
module.exports = User_Model;
