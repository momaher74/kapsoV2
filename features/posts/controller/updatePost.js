const Joi = require('joi');
const Post = require('../models/postModel');

const updateSchema = Joi.object({
  content: Joi.string().min(1).max(10000).optional().messages({
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content must not exceed 10000 characters'
  }),
  media: Joi.array().items(Joi.object({
    type: Joi.string().valid('image', 'video').optional(),
    url: Joi.string().uri().optional()
  })).optional(),
  privacy: Joi.string().valid('public', 'friends', 'only_me').optional().messages({
    'any.only': 'Privacy must be "public", "friends", or "only_me"'
  }),
  tags: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().max(500).optional().messages({
    'string.max': 'Location must not exceed 500 characters'
  })
}).min(1); // Ensure at least one field is provided for update

const paramsSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Post ID is required',
    'any.required': 'Post ID is required'
  })
});

async function updatePost(req, res) {
  try {
    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
      return sendError(res, paramsError.details[0].message);
    }

    const { error: bodyError } = updateSchema.validate(req.body);
    if (bodyError) {
      return sendError(res, bodyError.details[0].message);
    }

    const { id } = req.params;
    const updates = req.body;

    const post = await Post.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
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

module.exports = { updatePost };