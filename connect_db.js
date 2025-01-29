const mongoose = require('mongoose');

async function Connect_db() {
    try {
        const success = await mongoose.connect('mongodb://localhost:27017/Meal_matka');
        if(success){
            console.log('DB is connected successfully !')
        }    
    } catch (error) {
        console.log(`Error during mongo connect :- ${error}`);
    }
};

module.exports = Connect_db;