const UserDataProvider = require("../Services/UsersService");
const userDataProvider = new UserDataProvider();

const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const userAutentification = require("../Services/TokensService");
const jwtDecoder = userAutentification.jwtDecoder;

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;

// const getAllMessages = async () => {
//   return await messageDataProvider.getAllMessages();
// };
// console.log("getAllMessages", getAllMessages());

//senderUsername

exports.handleConnection = async (connection) => {
  const token = connection.handshake.query.token;

  // 1. verification
  let decodedToken = jwtDecoder(token);
  if (!decodedToken) {
    connection.emit("disconnect");
    connection.disconnect();
  }

  // 2. get user id
  let userInformation = await userDataProvider.findUserById(decodedToken.id);

  // 3. check banned status
  if (userInformation.onBan) {
    connection.emit("disconnect");
    connection.disconnect();
  }
  // if any false - disconnect

  const username = decodedToken.username;
  // connection.emit("download message history", getAllMessages);
  // connection.broadcast.emit("download message history", getAllMessages);

  connection.on("chat message", (msg) => {
    // {msg, username}
    // дополнить сообщение перед отправкой клиенту датой и именем автора:
    connection.emit("message", msg);
    connection.broadcast.emit("message", msg);
    // запись сбщ в бд
    messageDataProvider.createOneMessage(msg, username, currentTime());
  });
};
