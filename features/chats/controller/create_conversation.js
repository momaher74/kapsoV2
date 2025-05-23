const { Conversation } = require("../models/conversation_model");
const Message = require("../models/message_model");
const { getSocketInstance } = require("../../socket");

module.exports.createConversation = async (req, res) => {
  try {
    const { senderId, receiverId, initialMessage } = req.body;

    // Validate input
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender and receiver IDs required" });
    }

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    let messages = [];
    let conversationId;

    if (conversation) {
      conversationId = conversation._id;

      // Fetch messages for the conversation
      messages = await Message.find({ conversation: conversationId })
          .populate("sender", "username")
          .select("message sender mediaUrl isSeen seenBy deliveredAt createdAt")
          .lean();

      // Mark messages as seen for the requesting user (if they are the receiver)
      const unseenMessages = await Message.find({
        conversation: conversationId,
        receiver: senderId, // Assuming senderId is the user requesting the conversation
        isSeen: false,
      });

      for (const message of unseenMessages) {
        if (!message.seenBy.some((seen) => seen.userId.toString() === senderId)) {
          message.seenBy.push({ userId: senderId, seenAt: new Date() });
          message.isSeen = true;
          await message.save();

          // Emit seen status update to the conversation participants
          const io = getSocketInstance();
          io.to(conversationId.toString()).emit("message_seen", {
            messageId: message._id,
            userId: senderId,
            seenAt: new Date(),
          });
        }
      }

      // Refresh messages after updating seen status
      messages = await Message.find({ conversation: conversationId })
          .populate("sender", "username")
          .select("message sender mediaUrl isSeen seenBy deliveredAt createdAt")
          .lean();

      return res.status(200).json({
        message: "Conversation already exists",
        conversationId,
        messages,
      });
    }

    // Create new conversation
    conversation = new Conversation({
      participants: [senderId, receiverId],
    });

    await conversation.save();
    conversationId = conversation._id;

    // Create initial message if provided
    if (initialMessage) {
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message: initialMessage,
        conversation: conversationId,
        deliveredAt: new Date(),
      });

      conversation.lastMessage = newMessage._id;
      await conversation.save();

      messages = [
        await Message.findById(newMessage._id)
            .populate("sender", "username")
            .lean(),
      ];

      // Emit new message event
      const io = getSocketInstance();
      io.to(conversationId.toString()).emit("new_message", {
        message: messages[0],
        conversationId,
      });

      // Emit delivery status to sender
      io.to(senderId).emit("message_delivered", {
        messageId: newMessage._id,
        deliveredAt: newMessage.deliveredAt,
      });
    }

    // Emit conversation creation event
    const io = getSocketInstance();
    io.to([senderId, receiverId]).emit("conversation_created", {
      conversationId,
      participants: [senderId, receiverId],
    });

    return res.status(201).json({
      message: "Conversation created successfully",
      conversationId,
      messages,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};