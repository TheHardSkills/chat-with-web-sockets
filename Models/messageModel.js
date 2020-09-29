const mongoose = require("mongoose");
const messageSchema = require("../Schemas/messageSchema");

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
