const Message = require("../Models/messageModel");

class MessagesService {
  createOneMessage(messageText, senderUsername, addTime) {
    let message = new Message({ messageText, senderUsername, addTime });
    return message.save();
  }

  getAllMessages() {
    return Message.find({});
  }

  getAllMssgByFilter(filter) {
    return Message.find(filter).exec();
  }
}

module.exports = MessagesService;
