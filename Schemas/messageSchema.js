const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageText: {
    type: String,
    required: true,
    maxlength: 200,
  },
  senderUsername: String,
  addTime: String,
});

module.exports = messageSchema;
