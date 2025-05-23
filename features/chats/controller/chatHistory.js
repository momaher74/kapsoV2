const {
  sendError,
  sendSuccess,
} = require("../../../config/utils/sharedResponse");
const { valiadateObjectId } = require("../../../config/utils/validateObjectId");
const Conversation = require("../models/conversation_model");
module.exports.getChatHistory = async (req, res) => {
  try {
    const { id } = req.headers;

    if (!valiadateObjectId(id)) return sendError(res, "Invalid Id");

const conversations = await Conversation.find({ participants: { $in: [id] } }).populate([
  { path: "lastMessage", select: "message createdAt" }, 
  { path: "participants", select: "username " }       
]);
    return sendSuccess(res, conversations || []);
  } catch (e) {
    return sendError(res, e.message);
  }
};
