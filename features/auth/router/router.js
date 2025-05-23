const express = require('express');
const router = express.Router();
const UserServiceClass = require('../controller/authController');

// Instantiate the UserService class
const userService = new UserServiceClass();

// Error-handling middleware for async routes
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', asyncHandler(userService.register.bind(userService)));
router.post('/verify-otp', asyncHandler(userService.verifyOtp.bind(userService)));

module.exports = router;