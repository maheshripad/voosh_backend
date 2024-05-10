const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Authentication middleware
exports.authenticate = (req, res, next) => {
    try {
        // Get token from request header
        console.log('request headers details:',req.headers);
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied, token not provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, config.secretKey);
        req.userId = decoded.userId; // Attach user ID to request object
        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Authorization middleware (admin)
exports.authorizeAdmin = async (req, res, next) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied, token not provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, config.secretKey);
        const userId = decoded.userId;

        // Check if user is admin
        const user = await User.findById(userId);
        if (!user || !user.roles.includes('admin')) {
            return res.status(403).json({ message: 'Access denied, admin authorization required' });
        }

        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Replace with your secret
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded; // Attach decoded user data to the request object
        next();
    });
};