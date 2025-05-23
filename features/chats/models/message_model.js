const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        message: {
            type: String,
            trim: true,
        },
        mediaUrl: [
            {
                url: { type: String, trim: true },
                type: { type: String, enum: ["image", "video", "document"] },
            },
        ],
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Conversation",
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
        seenBy: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                seenAt: { type: Date, default: Date.now },
            },
        ],
        deliveredAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;