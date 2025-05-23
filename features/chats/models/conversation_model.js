const mongoose = require("mongoose");

const schema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const Conversation = mongoose.model("Conversation", schema); // Use PascalCase for models
module.exports = { Conversation }; // Corrected export