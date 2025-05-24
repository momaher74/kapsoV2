const Follow = require('../models/followModel');
const User = require('../../auth/models/userModel');

exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Find followers with pagination
        const followers = await Follow.find({ following: userId })
            .populate('follower', 'username email')
            .select('follower createdAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        res.json(followers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
