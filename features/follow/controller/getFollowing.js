const Follow = require('../models/followModel');
const User = require('../../auth/models/userModel');
exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Find following with pagination
        const following = await Follow.find({ follower: userId })
            .populate('following', 'username email')
            .select('following createdAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        res.json(following);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
