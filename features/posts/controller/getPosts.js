const Post = require('../models/postModel');


async function getPosts(req, res) {
  try {
    const { page, limit } = req.query;
    const skip = (p(age || 1 )- 1) * (limit || 20);

    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by createdAt descending (newest first)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username') // Populate userId with username
      .populate('tags', 'username'); // Populate tags with usernames

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const response = {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit
      }
    };

    return sendSuccess(res, response);
  } catch (e) {
    return sendError(res, e.message);
  }
}

module.exports = { getPosts };