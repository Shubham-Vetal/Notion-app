const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// router.use(express.json()); // This is necessary to parse JSON bodies

// Register Route
router.post('/register', [
    body('fullname.firstname')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    
    body('fullname.lastname')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Email'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.registerUser);

// Login Route
router.post('/login', [
    body('email')
        .isEmail().withMessage('Invalid Email'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, pass control to the controller
    next();
}, userController.loginUser);

// Get User Profile
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

// Logout Route
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;
