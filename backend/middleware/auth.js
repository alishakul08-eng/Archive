// backend/middleware/auth.js - CORRECTED FOR COOKIE AUTHENTICATION

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user'); 

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 🔑 FIX 1: Check for token in the HTTP-only cookie
    // This is necessary because your login/logout uses res.cookie('jwt', ...)
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } 
    
    // FIX 2: Check for Bearer token in the Authorization header (optional, but good practice)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if (token) {
        try {
            // Verify token and decode user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from database and attach to req.user (excluding the password)
            // Assumes the token payload uses the key 'id' for the user ID.
            req.user = await User.findById(decoded.id).select('-password'); 

            if (!req.user) {
                // This means a valid token was found, but the user ID in the token doesn't exist.
                res.status(401);
                throw new Error('Not authorized, user not found in database.');
            }

            next();
        } catch (error) {
            // Token is invalid, expired, or failed verification
            console.error(error); 
            res.status(401);
            throw new Error('Not authorized, token failed or expired.');
        }
    } else { // No token found in cookie or header
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };