
const {getSocketInstance} = require("../../../config/socket/socket");
const {Conversation} = require("../models/conversation_model");
const Message = require("../models/message_model");

module.exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, message, conversationId, media } = req.body;

    try {
        // Input validation
        if (!senderId || !receiverId || (!message && !media)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Verify conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Verify participants
        if (
            !conversation.participants.includes(senderId) ||
            !conversation.participants.includes(receiverId)
        ) {
            return res.status(403).json({ error: "Invalid participants" });
        }

        // Create message
        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message,
            conversation: conversationId,
            mediaUrl: media,
            deliveredAt: new Date(),
        });

        // Update conversation's last message
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        // Populate sender details for response
        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "username")
            .lean();

        // Emit socket events
        const io = getSocketInstance();
        io.to(conversationId.toString()).emit("new_message", {
            message: populatedMessage,
            conversationId,
        });

        // Emit delivery status to sender
        io.to(senderId).emit("message_delivered", {
            messageId: newMessage._id,
            deliveredAt: newMessage.deliveredAt,
        });

        return res.status(200).json({
            message: "Message sent successfully",
            data: populatedMessage,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};