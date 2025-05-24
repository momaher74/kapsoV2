const Follow = require('../models/followModel');
const User = require('../../auth/models/userModel');

exports.getMutualFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Check if users follow each other
        const mutual = await Follow.find({
            $or: [
                { follower: currentUserId, following: userId },
                { follower: userId, following: currentUserId }
            ]
        }).lean();

        if (mutual.length === 2) {
            // Both follow each other, find mutual followers
            const mutualFollowers = await Follow.find({
                following: currentUserId,
                follower: { $in: (await Follow.find({ following: userId }).select('follower').lean()).map(doc => doc.follower) }
            })
                .populate('follower', 'username email')
                .select('follower')
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            return res.json(mutualFollowers);
        }

        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};