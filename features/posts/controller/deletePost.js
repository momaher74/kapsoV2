const Joi = require('joi');
const Post = require('../models/postModel');

const paramsSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Post ID is required',
    'any.required': 'Post ID is required'
  })
});

async function deletePost(req, res) {
  try {
    const { error } = paramsSchema.validate(req.params);
    if (error) {
      return sendError(res, error.details[0].message);
    }

    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return sendError(res, 'Post not found');
    }

    return sendSuccess(res, { message: 'Post deleted successfully' });
  } catch (e) {
    return sendError(res, e.message);
  }
}

module.exports = { deletePost };