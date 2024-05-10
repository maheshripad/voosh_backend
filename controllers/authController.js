const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');


const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// Register a new user (including admin user)
exports.register = async (req, res, next) => {
    try {
        // Check if email is already registered
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            photo: req.body.photo,
            bio: req.body.bio,
            phone: req.body.phone,
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

// Login user (both admin and regular users)
exports.login = async (req, res, next) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with user ID
        const token = jwt.sign({ userId: user._id }, config.secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

// Social login
exports.socialLogin = async (req, res, next) => {
    // Implement social login logic here (OAuth)
    // For example, authenticate with Google, Facebook, etc.
    // Generate JWT token and send it back to the client
};

// Logout user
exports.logout = async (req, res, next) => {
    // Implement logout logic here
    // For example, invalidate JWT token
    res.status(200).json({ message: 'Logout successful' });
};

// Create admin user
exports.createAdminUser = async (req, res, next) => {
    try {
        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        // Create a new admin user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const admin = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            photo: req.body.photo,
            bio: req.body.bio,
            phone: req.body.phone,
            role: 'admin' // Set the role to 'admin'
        });

        // Save the admin user to the database
        await admin.save();
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        next(error);
    }
};


const oauth2Client = new OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUrl
);

exports.googleAuthRedirect = (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile'],
    });
    res.redirect(authUrl);
};

exports.googleAuthCallback = async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
        const userInfo = await oauth2.userinfo.get();

        // Process user information and generate JWT token
        const token = generateJwtToken(userInfo.data);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.status(500).json({ message: 'Failed to authenticate with Google' });
    }
};

function generateJwtToken(userInfo) {
    // Generate JWT token logic here

    const payload = {
        userId: userInfo.id, // Assuming user ID is available in userInfo
        email: userInfo.email, // Assuming email is available in userInfo
        // Add any other relevant user information to the payload
    };

    // Generate JWT token with user payload and secret key
    const token = jwt.sign(payload, config.secretKey, { expiresIn: '1h' });
    return token;
}

exports.loginWithGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'] // Request user profile and email
});

// Similar implementations for loginWithFacebook, loginWithTwitter, etc.

exports.loginCallback = (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err) {
            return next(err); // Handle authentication errors appropriately
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }

        // Generate token, handle user session, etc.
        const token = generateToken(user); // Implement token generation logic
        res.json({ token });
    })(req, res, next);
};

// Similar callback functions for other social providers