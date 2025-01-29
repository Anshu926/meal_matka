const meal_model = require('./schema_model');
const connect_db = require('./connect_db');
connect_db();

async function dummy_data() {
    try {
        const data = [
            {
                name: 'Chicken Biryani',
                price: 250,
                description: 'Aromatic basmati rice with tender chicken and spices.',
                image: 'https://media.istockphoto.com/id/1271533769/photo/delicious-chicken-biryani-top-view-biryani-rice-dish-beautiful-indian-rice-dish-delicious.jpg?s=612x612&w=0&k=20&c=lfWZeBgJ3ppDVXqtq2GER3r2sQ23-gUfQsGAG1jleg8=',
                owner: '678df8e8ea37da90bdf20366', // Replace with your desired ObjectId

            },
            {
                name: 'Margherita Pizza',
                price: 500,
                description: 'Classic Italian pizza with fresh mozzarella and basil.',
                image: 'https://preview.redd.it/unexpected-best-margherita-of-my-life-v0-lornuit8rc2d1.jpeg?width=640&crop=smart&auto=webp&s=ae1c85774bbd49a765197c95d128ac583cf5fb55',
                owner: '678df8e8ea37da90bdf20366', // Replace with your desired ObjectId

            },
            {
                name: 'Caesar Salad',
                price: 300,
                description: 'Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan.',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP7bIsMWNzWH5wY36kp5lpT-uzbYqvXhLIqA&s',
                owner: '678df8e8ea37da90bdf20366', // Replace with your desired ObjectId

            },
            {
                name: 'Pasta Alfredo',
                price: 400,
                description: 'Creamy Alfredo sauce with fettuccine pasta and grated Parmesan.',
                image: 'https://media.istockphoto.com/id/506916161/photo/homemade-fettucini-aflredo-pasta.jpg?s=612x612&w=0&k=20&c=Pa3dwlsqnPfOKgldMXuHVy5Aqmtbp8wThbj6V_4u5us=',
                owner: '678df8e8ea37da90bdf20366', // Replace with your desired ObjectId

            },
            {
                name: 'Grilled Salmon',
                price: 700,
                description: 'Fresh salmon grilled to perfection with herbs and spices.',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqvJDfv-j1Ji1qexc8_L3NSzIwt4iEvQmfA&s',
                owner: '678df8e8ea37da90bdf20366', // Replace with your desired ObjectId
            }
        ];

        for (const item of data) {
            // Check if the meal already exists
            const existingMeal = await meal_model.findOne({ name: item.name });

            if (existingMeal) {
                console.log(`Meal "${item.name}" is already published!`);
            } else {
                // Insert the new meal
                await meal_model.create(item);
                console.log(`Meal "${item.name}" added successfully!`);
            }
        }
    } catch (error) {
        console.error('Error adding dummy data:', error.message);
    }
}

dummy_data();
