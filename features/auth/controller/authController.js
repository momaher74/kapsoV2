const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');

console.log('User Model:', User); // Debug to confirm User is a Mongoose models

class UserService {
    async register(req, res) {
        const { username, phoneNumber, role } = req.body;

        const existing = await User.findOne({ phoneNumber });

        const generateOtp = () =>
            Math.floor(100000 + Math.random() * 900000).toString();

        const otp = generateOtp();

        if (existing) {
            existing.otp = otp;
            await existing.save();
            return res.status(200).json({ message: 'OTP sent to existing user' });
        } else {
            const newUser = new User({ username, phoneNumber, role, otp });
            await newUser.save();
            return res.status(201).json({ message: 'User registered and OTP sent' });
        }
    }

    async verifyOtp(req, res) {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber) throw new Error('Phone number is required');
        if (!otp) throw new Error('OTP is required');

        const user = await User.findOne({ phoneNumber });

        if (!user || user.otp !== otp) {
            const error = new Error('Invalid OTP or user not found');
            error.name = 'UnauthorizedError';
            throw error;
        }

        user.otp = null;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
        });
    }
}

module.exports = UserService;