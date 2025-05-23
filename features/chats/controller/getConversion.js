const {
  sendError,
  sendSuccess,
  sendNotFound,
  sendBadRequest,
} = require("../../../config/utils/sharedResponse");
const { valiadateObjectId } = require("../../../config/utils/validateObjectId");
const Conversion = require("../models/conversation_model");
const Message = require("../models/message_model");
module.exports.getConversionById = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log(id);
    

    if (!valiadateObjectId(id)) {
      return sendBadRequest(res , "Invalid Id" );
    }

    const conversion = await Message.find({conversation : id}) ;
    if (!conversion) {
      return sendNotFound(res );
    }
    return sendSuccess(res, conversion);
  } catch (e) {
    return sendError(res, e.message);
  }
};
