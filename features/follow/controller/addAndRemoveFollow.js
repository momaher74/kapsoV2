const Follow = require('../models/followModel');
const User = require('../../auth/models/userModel');
const {valiadateObjectId} = require("../../../config/utils/validateObjectId");
const {sendBadRequest} = require("../../../config/utils/sharedResponse");

exports.toggleFollow = async (req, res) => {
    try {
        const { userId } = req.params; // User to toggle follow for
        const followerId = req.user._id; // Authenticated user

        if(!valiadateObjectId(userId)){
            return  sendBadRequest(res , "invalid id")
        }
        // Prevent self-follow
        if (userId === followerId.toString()) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        // Check if the user to follow exists
        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already following
        const existingFollow = await Follow.findOne({ follower: followerId, following: userId });

        if (existingFollow) {
            // Unfollow: Delete the follow relationship
            await Follow.findOneAndDelete({ follower: followerId, following: userId });
            return res.json({ message: 'Successfully unfollowed user', action: 'unfollowed' });
        } else {
            // Follow: Create the follow relationship
            await Follow.create({ follower: followerId, following: userId });
            return res.status(201).json({ message: 'Successfully followed user', action: 'followed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


