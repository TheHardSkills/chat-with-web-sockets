const Message = require("../Models/messageModel");

class MessagesService {
  createOneMessage(messageText, senderUsername, addTime) {
    let message = new Message({ messageText, senderUsername, addTime });
    return message.save();
  }
  getAllMessages() {
    return Message.find({});
  }
}

module.exports = MessagesService;
