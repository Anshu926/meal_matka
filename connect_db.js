const mongoose = require('mongoose');

async function Connect_db() {
    try {
        const success = await mongoose.connect('mongodb+srv://meal_matka_owner:2005@cluster0.6hhoa.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');
        if(success){
            console.log('DB is connected successfully !')
        }    
    } catch (error) {
        console.log(`Error during mongo connect :- ${error}`);
    }
};

module.exports = Connect_db;
