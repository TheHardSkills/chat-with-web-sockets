const { loadClass } = require("../Schemas/userSchema");
const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;

// const getAllMessages = async () => {
//   return await messageDataProvider.getAllMessages();
// };
// console.log("getAllMessages", getAllMessages());

//senderUsername
const senderUsername = "const_value";

exports.handleConnection = (connection) => {
  //   connection.emit("download message history", getAllMessages);
  //   connection.broadcast.emit("download message history", getAllMessages);

  const token = connection[find_in_doc].token;
  // 1. verification
  // 2. get user id
  // 3. check banned status
  // if any false - disconnect

  connection.on("chat message", (msg) => {
    //{msg, username}
    //дополнить сообщение перед отправкой клиенту датой и именем автора:
    connection.emit("message", msg);
    connection.broadcast.emit("message", msg);
    //запись сбщ в бд
    messageDataProvider.createOneMessage(msg, senderUsername, currentTime());
  });
};
