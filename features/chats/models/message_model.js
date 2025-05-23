const mongoose = require("mongoose");

const schema = mongoose.Schema({
    message: String,
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    conversation: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Conversion",
    },
});

const message = mongoose.model("message", schema);
module.exports = message;
