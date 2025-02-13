const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.authUser = async (req, res, next) => {
    // Extract token from cookies or authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Token received:", token); // Log the token for debugging

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });
    console.log("Token blacklisted:", isBlacklisted); // Log whether the token is blacklisted

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Log the decoded token for debugging

        // Fetch the user from the database using the decoded user ID
        const user = await userModel.findById(decoded._id);
        console.log("User fetched from DB:", user); // Log the user object fetched from DB

        if (!user) {
            console.log("User not found in DB for ID:", decoded._id); // Log if user not found
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Attach the user to the request object for further use
        req.user = user;

        // Continue to the next middleware or route handler
        return next();
    } catch (err) {
        // Log the error for debugging
        console.error("JWT verification error:", err.message); // Log the error message
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
