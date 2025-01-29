const mongoose = require('mongoose');
const User_model = require('./user_schema_model'); // Adjust the path if necessary

const createDummyUser = async () => {
    const userData = {
        username: 'anshu_bongade',
        firstname: 'Anshu',
        lastname: 'Bongade',
        email: 'anshubongade@example.com',
        password: 'Bong@de148', // Password for the new user
    };

    try {
        // Register the user with the provided data
        const newUser = await User_model.register({
            username: userData.username,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email
        }, userData.password);  // Pass the password to the register method

        console.log('Dummy user created successfully!');
        return newUser; // Return the created user
    } catch (err) {
        console.error('Error creating dummy user:', err.message);
        throw err; // Re-throw the error for handling in the main app
    }
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Meal_matka')
    .then(() => {
        console.log('Connected to MongoDB');
        createDummyUser(); // Create the user once the connection is established
    })
    .catch(err => {
        console.error('Connection error:', err.message);
    });