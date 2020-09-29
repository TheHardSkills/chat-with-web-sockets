const Message = require("../Models/messageModel");

class MessagesService {
  createOneMessage(message, senderUsername, addTime) {
    let messageObj = new Message({ message, senderUsername, addTime });
    return messageObj.save();
  }
}

module.exports = MessagesService;
