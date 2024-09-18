const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const Ebuyer = require("../models/Ebuyers");
const Eseller = require("../models/Eseller");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const passport = require("../config/passport")

// User Registration
router.post('/register', async (req, res) => {
    const { email, firstName, lastName, username, password, typeofacc } = req.body;
  
    try {
      // Check if the user already exists by email or username
      const existingBuyer = await Ebuyer.findOne({email});
      const existingSeller = await Eseller.findOne({email});
  
      if (existingBuyer || existingSeller) {
        return res.status(400).json({ message: "User with this email or username already exists" });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user data
      const newUserData = {
        email,
        firstName,
        lastName,
        username,  // Include username
        password: hashedPassword,
      };
  
      let user;
      if (typeofacc === 'buyer') {
        user = new Ebuyer(newUserData);
      } else {
        user = new Eseller(newUserData);
      }
  
      // Save user
      await user.save();
  
      // Token generation and email verification (same as before)
      const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
      });
      await token.save();
  
      const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
      await sendEmail(email, "Verify Email", message);
  
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  });
  






// Email Verification
router.get('/verify/:id/:token', async (req, res) => {
    try {
        // Find the user by ID in either Ebuyer or Eseller collection
        let user = await Ebuyer.findOne({ _id: req.params.id }) || await Eseller.findOne({ _id: req.params.id });
            

        if (!user) {
            console.error("Invalid user ID");
            return res.status(400).send("Invalid link: User not found");

        }
        // Find the token associated with the user
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        console.log(token._id)

        if (!token) {
            console.error("Invalid token");
            return res.status(400).send("Invalid link: Token not found");
        }

        // Mark user as verified
        user.verified = true;
        await user.save();
        
        // Remove the used token from the database
        await Token.findOneAndDelete(token._id);

        res.redirect("http://127.0.0.1:3000/verification-success")
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).send("An error occurred during verification");
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to log out" });
        }
        res.clearCookie("session_id"); // Clear the session cookie
        res.status(200).json({ message: "Logged out successfully" });
    });
});

module.exports = router;