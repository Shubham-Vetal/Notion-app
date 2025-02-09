const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user from the database using decoded user ID
        const user = await userModel.findById(decoded._id);
        
        // Attach the user to the request object for further use
        req.user = user;

        // Continue to the next middleware or route handler
        return next();

    } catch (err) {
        // Log error for debugging
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
