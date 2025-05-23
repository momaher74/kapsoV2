const {Conversation} = require("../models/conversation_model");
const {Message} = require("../models/message_model");
module.exports.createConversation = async (req, res) => {
  try {
    const { sender, receiver } = req.body; // Corrected spelling
    // Check if a conversation already exists
    const existingConversation = await Conversation.findOne({
      $or: [
        { sender, receiver },
        { senderId: receiver, receiverId: sender }, // Check both directions
      ],
      
    }, {senderId : 0 , receiverId : 0  , });

    if (existingConversation) {
      const messages = await Message.find({ conversationId: existingConversation._id })
      .select("message senderId -_id").populate("senderId");  
          return res.status(200).json({
        message: "Conversation already exists",
        conversationId: existingConversation._id, 
        messages :messages 
      });
    }

    // Create a new conversation
    const newConversation = new Conversation({ senderId, receiverId });
    await newConversation.save();

    return res.status(201).json({
      message: "Conversation created successfully",
      conversationId: newConversation._id,
      messages :[]
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};