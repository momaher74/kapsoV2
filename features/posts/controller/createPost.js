const { sendError, sendBadRequest } = require("../../../config/utils/sharedResponse");
const { valiadateObjectId } = require("../../../config/utils/validateObjectId");
const Post = require("../models/postModel")

module.exports.createPost = async (req, res)=> {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message);
    }

    const { userId, content, media, privacy, tags, location } = req.body; 

    if(!valiadateObjectId(userId) ) return sendBadRequest(res , "Invalid Id")

    const post = new Post({
      userId,
      content,
      media: media || [],
      privacy,
      tags: tags || [],
      location: location || ''
    });

    await post.save();
    return sendSuccess(res, post);
  } catch (e) {
    return sendError(res, e.message);
  }
}




const postSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  }),
  content: Joi.string().required().min(1).max(10000).messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content must not exceed 10000 characters'
  }),
  media: Joi.array().items(Joi.object({
    type: Joi.string().valid('image', 'video').required().messages({
      'any.only': 'Media type must be either "image" or "video"'
    }),
    url: Joi.string().uri().required().messages({
      'string.uri': 'Media URL must be a valid URI'
    })
  })).optional(),
  privacy: Joi.string().valid('public', 'friends', 'only_me').default('public').messages({
    'any.only': 'Privacy must be "public", "friends", or "only_me"'
  }),
  tags: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().max(500).optional().messages({
    'string.max': 'Location must not exceed 500 characters'
  })
});