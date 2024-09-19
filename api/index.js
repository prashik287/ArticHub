const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OAuthStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const Buyer = require('./models/Buyers');
const Seller = require('./models/Sellers');
const Ebuyer = require('./models/Ebuyers');
const Eseller = require('./models/Eseller');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('./db/conn'); // Ensure connection happens before initializing
const route = require('./routes/users');

const PORT = 9000 || 8000;

// CORS setup - This must be before any routes are defined
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Adjust based on your frontend
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true // Allow credentials (cookies, authorization headers)
}));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session store
const mongoDBstore = new MongoDBStore({
    uri: process.env.MONGOOSE_URL,  // Make sure this URL is correct
    collection: "mySessions",
});

mongoDBstore.on('error', (error) => {
    console.error('Session store error:', error);
});

// Setup session middleware
// Setup session middleware
app.use(session({
    name: "session_id",
    secret: process.env.SESSION_SECRET || "defaultsecret",
    store: mongoDBstore,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3, // 3 hours
        sameSite: "None", // Properly set SameSite
        secure: false, // Set to true in production
        // If you want to experiment with Partitioned cookies, you can add this attribute:
        // partitioned: true, // Uncomment if needed, but be aware of compatibility
    }
}));


// Initialize Passport and use session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', route); // Ensure this comes after middleware

// Other routes and logic here...
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await Ebuyer.findOne({ email }) || await Seller.findOne({ email });
        if (!user) return done(null, false, { message: 'User not found' });
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return done(null, false, { message: 'Invalid password' });
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// OAuth Strategy for Google
passport.use(new OAuthStrategy({
    clientID: process.env.gclient_id,
    clientSecret: process.env.gclient_secret,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await Buyer.findOne({ googleId: profile.id }) ||
                   await Seller.findOne({ googleId: profile.id });

        if (!user) {
            const newUser = new Buyer({
                googleId: profile.id,
                displayname: profile.displayName,
                email: profile.emails[0]?.value || "",
                image: profile.photos[0]?.value || ""
            });
            user = await newUser.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await Ebuyer.findById(id) || 
                   await Seller.findById(id) || 
                   await Buyer.findById(id) || 
                   await Eseller.findById(id);
        done(null, user || false); // Ensure to handle the case where no user is found
    } catch (error) {
        done(error);
    }
});
// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password, acctype } = req.body;
        let user;

        if (acctype === "buyer") {
            user = await Ebuyer.findOne({ email: email });
        } else if (acctype === "seller") {
            user = await Seller.findOne({ email: email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Check if the user is verified
            if (user.verified === false) {
                return res.status(401).json({ message: 'User is not verified' });
            }

            req.session.isLoggedIn = true;
            req.session.user = {
                _id: user._id,
                email: user.email,
                acctype: acctype
            };
            await req.session.save();

            return res.status(200).json({
                message: "Login Success",
                user: {
                    _id: user._id,
                    email: user.email,
                    acctype: acctype
                }
            });
        } 
        else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error logging in' });
    }
});


app.get('/login/success', (req, res) => {
    const isLoggedin = req.session.isLoggedIn
    const user = req.session.user
    if (isLoggedin) {
        res.status(200).json({ message: 'User logged in', user: user });
    } else {
        res.status(401).json({ message: 'User not logged in' });
    }
});
// Google OAuth routes
app.get('/auth/google', passport.authenticate("google", { scope: ["profile", "email"] }));

app.get('/auth/google/callback', passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login"
}), (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
});

// Health check route
app.get("/", (req, res) => {
    res.send("API Running Successfully");
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to log out" });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to destroy session" });
            }
            res.clearCookie("session_id"); // Clear the session cookie
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});
// Start server after MongoDB connection
mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
