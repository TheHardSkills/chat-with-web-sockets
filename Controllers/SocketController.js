const { loadClass } = require("../Schemas/userSchema");
const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;

// const allMessages = await messageDataProvider.getAllMessages();

//senderUsername
const senderUsername = "const_value";

exports.handleConnection = (connection) => {
  //   connection.emit("download message history", allMessages);
  //   connection.broadcast.emit("download message history", allMessages);

  connection.on("chat message", (msg) => {
    //{msg, username}
    //дополнить сообщение перед отправкой клиенту датой и именем автора:
    connection.emit("message", msg);
    connection.broadcast.emit("message", msg);
    //запись сбщ в бд
    messageDataProvider.createOneMessage(msg, senderUsername, currentTime());
  });
};
