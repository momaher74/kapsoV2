const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'police', 'chargeagent'],
    },
    profileImage: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    country: {
        type: String,
    },
    otp: {
        type: String,
    },
    fcmTokens: {
        type: [String],
    },
});

const User = mongoose.model('User', usersSchema);

module.exports = User;