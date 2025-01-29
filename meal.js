// Import or require express package 
const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User_model = require('./user_schema_model');
const LocalStrategy = require('passport-local');
const Review_model = require('./review_schema');
const Order_model = require('./order_schema')
const MongoStore = require('connect-mongo');


// mongo connection
const connect_db = require('./connect_db');
connect_db();
  
// mongo model with schema
const meal_model = require('./schema_model');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Middleware for sessions
app.use(session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,             // Don't save session if unmodified
    saveUninitialized: false,  // Don't create a session until something is stored
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://meal_matka_owner:2005@cluster0.6hhoa.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0',
        ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (default: 14 days)
    })
}));   

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport to use the local strategy
passport.use(new LocalStrategy(User_model.authenticate()));

// Serialize and deserialize users
passport.serializeUser(User_model.serializeUser());
passport.deserializeUser(User_model.deserializeUser());


app.use(flash());

app.use((req, res, next) => {
    res.locals.success_message = req.flash('success');
    res.locals.error_message = req.flash('error');
    res.locals.current_user = req.user; // Add the user object to res.locals
    next();
});


// Home route
app.get('/', (req, res) => {
    res.send('<h1><a href="/home">Go to Home</a></h1>');
});

// Home page showing all meals
app.get('/home', async (req, res) => {
    try {
        const meal_array = await meal_model.find({}).populate('owner', 'username'); // Populating the owner with only 'username'
        res.render('home.ejs', { 
            meal_array,
            user: req.user // Pass the authenticated user to the view
        });
    } catch (error) { 
        res.status(500).send(error.message);
    }
});  
 
app.get('/view_meal/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const meal = await meal_model.findById(id);
        if (!meal) { 
            return res.status(404).send('Meal not found');
        }

        // Fetch reviews for the meal
        const reviews = await Review_model.find({ meal: id }).populate('user', 'username');

        // Render the meal details page with meal and reviews
        res.render('show', { meal, reviews, current_user: req.user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/create', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.render('create.ejs');
        } else {
            req.flash('error', 'You must be logged in to create a meal!');
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Handle create form submission
app.post('/create', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            req.flash('error', 'You must be logged in to create a meal');
            return res.redirect('/login');
        }

        const meal_data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            owner: req.user.id // Set the owner to the authenticated user’s ID
        };
  
        // Create a new meal with the data
        const new_meal = new meal_model(meal_data);
        await new_meal.save();  // Save the new meal in the database
 
        // Flash message on success
        req.flash('success', 'Meal created successfully!');
        res.redirect('/home');
    } catch (error) {
        // Flash message on error
        req.flash('error', 'Error creating meal');
        res.status(500).send(error.message);
    }
});

// Delete all meals
app.post('/delete/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.query.method_ === 'delete') {
            try {
                const id = req.params.id;
                const del_meal = await meal_model.findByIdAndDelete(id);
                if (del_meal) {
                    req.flash('success', 'Meal deleted successfully!');
                    res.redirect('/home');
                } else {
                    req.flash('error', 'Error while deleting meal');
                    res.status(404).send('Meal not found');
                }
            } catch (error) {
                res.status(500).send(error.message);
            }
        } else {
            res.status(400).send('Invalid method');
        }
    } else {
        req.flash('error', 'You must be logged in to delete a meal!');
        res.redirect('/login');
    }
});
   
app.get('/modify/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const id = req.params.id;
            const meal = await meal_model.findById(id);
            res.render('modify.ejs', { meal });
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else { 
        req.flash('error', 'You must be logged in to modify a meal!');
        res.redirect('/login');
    } 
});

// Handle modify form submission
app.post('/modify/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const mealData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image
        };

        const updatedMeal = await meal_model.findByIdAndUpdate(id, mealData, { new: true });

        if (updatedMeal) {
            req.flash('success', 'Meal modified successfully!');
            res.redirect(`/view_meal/${id}`);
        }
    } catch (error) {
        req.flash('error', 'Error during updating meal');

        res.status(500).send(error.message);
    }
});

app.get('/signup',(req,res)=>{
    res.render('signup.ejs');
}); 

app.post('/signup', async (req, res) => {
    try {
        let {username , firstname , lastname , email , password} = req.body ;
        const new_user = new User_model({username , firstname , lastname , email});
        const register_user = await User_model.register(new_user,password);
        if(register_user){
            req.flash('success', 'User successfully registered! now its time to login !');
            res.redirect('/login');
        }
    } catch (error) {
        // Set an error message if registration fails
        req.flash('error', error.message);
        
        // Redirect to signup page to show the error message
        res.redirect('/signup');
    }
});

app.get('/login',(req,res)=>{
    res.render('login.ejs');   
}); 

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login', // Redirect back to login page on failure
    failureFlash: true         // Show flash message on failure
}), async (req, res) => {
    req.flash('success', 'User successfully logged in!');
    res.redirect('home');
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Logout failed');
            return res.redirect('/home'); // Redirect to home or any other page on error
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/home'); // Redirect to login page after logout
    });
});
 
app.get('/view-review/:id', async (req, res) => {
    try {
        const meal_id = req.params.id;

        // Find the meal by ID
        const meal = await meal_model.findById(meal_id);
        if (!meal) {
            req.flash('error', 'Meal not found');
            return res.redirect('/home');
        }

        // Find all reviews for the meal
        const reviews = await Review_model.find({ meal: meal_id }).populate('user', 'username');

        // Render the view with the meal and reviews
        res.render('view_review.ejs', { meal, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send(error.message);
    }
});


// Route to handle review submission
app.post('/review/:id', async (req, res) => {
    try {
        const mealId = req.params.id;
        const { rating, comment } = req.body;

        // Ensure the meal exists before creating the review
        const meal = await meal_model.findById(mealId);
        if (!meal) {
            req.flash('error', 'Meal not found.');
            return res.redirect('/home');
        }

        // Create a new review
        const review = new Review_model({
            meal: mealId,                     // Reference the meal ID
            user: req.user ? req.user._id : null, // Optional: Add the user ID if logged in
            rating: parseInt(rating, 10),    // Ensure the rating is an integer
            comment,                         // Add the comment
        });

        // Save the review in the database
        await review.save();

        req.flash('success', 'Review submitted successfully!');
        // Redirect to the same meal's details page
        res.redirect(`/view_meal/${mealId}`);
    } catch (error) {
        console.error('Error saving review:', error);
        req.flash('error', 'Error submitting review. Please try again.');
        res.redirect(`/meals/${req.params.id}`); // Ensure redirection to the same meal's page in case of an error
    }
});
app.get('/order/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to place an order.');
        return res.redirect('/login'); // Redirect to login if no user is authenticated
    }
    try {
        const current_user = req.user ;
        const id = req.params.id;
        const meal = await meal_model.findById(id); // Retrieve meal by ID
        if (!meal) {
            req.flash('error', 'Meal not found.');
            return res.redirect('/home'); // Redirect if meal not found
        }
        res.render('order.ejs', { meal , current_user }); // Render order.ejs for authenticated users
    } catch (error) {
        console.error(error); // Log error for debugging
        req.flash('error', 'Unable to load meal. Please try again later.');
        res.redirect('/home'); // Redirect on error
    }
});

app.post('/order', async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to place an order.');
        return res.redirect('/login'); // Redirect to login if the user is not authenticated
    }

    try {
        const current_user = req.user; // Retrieve the authenticated user from the session
        const { meal: mealId, quantity, deliveryAddress } = req.body;

        // Validate quantity and delivery address
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            req.flash('error', 'Invalid quantity provided.');
            return res.redirect(`/order/${mealId}`);
        }
        if (!deliveryAddress || deliveryAddress.trim().length === 0) {
            req.flash('error', 'Delivery address cannot be empty.');
            return res.redirect(`/order/${mealId}`);
        }

        // Find the meal using the meal ID
        const meal = await meal_model.findById(mealId);
        if (!meal) {
            req.flash('error', 'Meal not found.');
            return res.redirect('/home');
        }

        // Calculate the total amount
        const totalAmount = meal.price * parsedQuantity;

        // Create a new order based on the new schema (single meal)
        const newOrder = new Order_model({
            customer: current_user._id, // Reference the logged-in user
            meal: mealId, // Reference the single meal
            quantity: parsedQuantity, // Add the quantity
            totalAmount,
            deliveryAddress,
            status: 'Pending',
        });

        // Save the order to the database
        await newOrder.save();

        // Flash success message and redirect to the meal view page
        req.flash('success', 'Your order has been placed successfully!');
        res.redirect(`/view_meal/${mealId}`);
    } catch (error) {
        console.error('Error placing order:', error);
        req.flash('error', 'An error occurred while placing your order. Please try again.');
        res.redirect(`/order/${req.body.meal}`); // Redirect back to the order page on error
    }
});

app.get('/cart', async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please log in to view your orders.');
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    try {
        // Fetch the currently authenticated user
        const current_user = req.user;

        // Fetch orders created by the current user and populate meal details
        const orders = await Order_model.find({ customer: current_user._id })
            .populate('meal', 'name price'); // Populate the 'meal' field with 'name' and 'price' fields

        // Calculate the total cost of all orders
        const totalCost = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Render the orders view and pass required data
        res.render('cart', { current_user, orders, totalCost });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('An error occurred while fetching your orders.');
    }
});

app.post('/order_delete/:id', async(req, res) => {
    try {
        const id = req.params.id ;
        const del_order = await Order_model.findByIdAndDelete(id);
        if (del_order) {
            req.flash('success', 'Order deleted successfully!');
            res.redirect('/cart');
        } else {
            req.flash('error', 'Error while deleting order');
            res.status(404).send('Order not found');
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
});

app.post('/del_review/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Find the review first to get the associated meal ID
        const review = await Review_model.findById(id);
        if (!review) {
            req.flash('error', 'Review not found');
            return res.redirect('/home');
        }

        const mealId = review.meal; // Get the meal ID before deletion

        // Delete the review
        await Review_model.findByIdAndDelete(id);

        req.flash('success', 'Review deleted successfully!');
        res.redirect(`/view_meal/${mealId}`); // Redirect to the meal's page
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Error while deleting review');
        res.status(500).send(error.message);
    }
});


 
app.get('*',(req,res)=>{
    res.render('universal.ejs');
})

// Listen on port
app.listen(port, () => {
    console.log(`Meal app is running on port ${port}`);
});
