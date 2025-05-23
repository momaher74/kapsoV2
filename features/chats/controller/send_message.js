const Message = require("../../models/message_model");
const { getSocketInstance } = require("../../socket"); // Import function to get io

module.exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, message, conversationId } = req.body;
    
    try {
        const msg = await Message.create({ senderId, receiverId, message, conversationId });
        
        if (msg) {
            const io = getSocketInstance(); // Get socket instance
            io.emit(conversationId, {message : msg.message , senderId : msg.senderId}); // Emit message
            return res.status(200).json({ message: "Message sent successfully" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
