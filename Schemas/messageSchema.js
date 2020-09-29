const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    maxlength: 200,
  },
  senderUsername: String,
  addTime: String,
});

module.exports = messageSchema;
