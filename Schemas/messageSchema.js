const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    maxlength: 200,
  },
  senderUsername: String,
  departureTime: String,
});

module.exports = messageSchema;
