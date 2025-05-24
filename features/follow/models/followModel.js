const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
     follower: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     following: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     createdAt: { type: Date, default: Date.now }
}, {
     indexes: [
          { key: { follower: 1, following: 1 }, unique: true }, // Prevent duplicate follows
          { key: { following: 1 } }, // For fast follower list queries
          { key: { follower: 1 } }  // For fast following list queries
     ]
});

module.exports = mongoose.model('Follow', followSchema);