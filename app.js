// Load environment variables from .env file if not in production
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL; // MongoDB connection string from .env
const path = require("path");
const methodOverride = require("method-override"); // For supporting PUT/DELETE in forms
const ejsMate = require("ejs-mate"); // Layout support for EJS
const ExpressError = require("./utils/ExpressError.js"); // Custom error class
const listingsRouter = require("./routes/listing.js"); // Listings routes
const reviewsRouter = require("./routes/review.js"); // Reviews routes
const usersRouter = require("./routes/user.js"); // Users routes
const session = require("express-session"); // Session management
const MongoStore = require("connect-mongo"); // Store sessions in MongoDB
const flash = require("connect-flash"); // Flash messages
const passport = require("passport"); // Authentication
const localStrategy = require("passport-local"); // Local auth strategy
const User = require("./models/user.js"); // User model


// Set up EJS as the view engine and views directory
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Parse incoming request bodies and support method override
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Use ejs-mate for layouts
app.engine("ejs",ejsMate);

// Serve static files from /public
app.use(express.static(path.join(__dirname,"/public")));

// Connect to MongoDB
main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

// Configure session store in MongoDB
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600
});
store.on("error", function(e) {
    console.log("Session store error:", e);
});

// Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};

// Enable sessions and flash messages
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages and current user available in all templates
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // make currentUser available in templates
    next();
});

// Mount routers for different resources
app.use("/listings", listingsRouter); // Listings CRUD
app.use("/listings/:id/reviews", reviewsRouter); // Reviews for listings
app.use("/users", usersRouter); // User authentication and profile

// Catch-all for invalid routes (404)
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

// Start the server
app.listen(8080,() => {
    console.log("server is listening to port 8080");
});