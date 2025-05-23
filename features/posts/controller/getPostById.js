const Joi = require('joi');
const Post = require('../models/post_model');
const { valiadateObjectId } = require('../../../config/utils/validateObjectId');
const { sendBadRequest } = require('../../../config/utils/sharedResponse');

async function getPostById(req, res) {
  try {


    const { id } = req.params; 
    if(!valiadateObjectId(id)) return sendBadRequest(res , "invalid id")
    const post = await Post.findById(id)
      .populate('userId', 'username')
      .populate('tags', 'username');

    if (!post) {
      return sendError(res, 'Post not found');
    }

    return sendSuccess(res, post);
  } catch (e) {
    return sendError(res, e.message);
  }
}

module.exports = { getPostById };