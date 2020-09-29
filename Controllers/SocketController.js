const MessagesService = require("../Services/MessagesService");
const messagesService = new MessagesService();

const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;

//senderUsername
const senderUsername = "const_value";

exports.handleConnection = (connection) => {
  connection.on("chat message", (msg) => {
    //{msg, username}
    connection.emit("message", msg);
    connection.broadcast.emit("message", msg);
    //запись сбщ в бд
    messageDataProvider.createOneMessage(msg, senderUsername, currentTime());
  });
};
