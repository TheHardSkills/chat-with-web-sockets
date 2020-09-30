const UserDataProvider = require("../Services/UsersService");
const userDataProvider = new UserDataProvider();

const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const userAutentification = require("../Services/TokensService");
const jwtDecoder = userAutentification.jwtDecoder;

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;

exports.handleConnection = async (connection) => {
  const token = connection.handshake.query.token;

  // 1. verification
  const decodedToken = jwtDecoder(token);
  if (!decodedToken) {
    connection.emit("disconnect");
    connection.disconnect();
  }

  // 2. get user id
  const userInformation = await userDataProvider.findUserById(decodedToken.id);

  // 3. check banned status
  if (userInformation.onBan) {
    connection.emit("disconnect");
    connection.disconnect();
  }

  if (userInformation.onMute) {
    connection.emit("muted");
    //проверка на беке на мьют - нельзя записывать сбщ
  }
  const allUsers = await userDataProvider.getAllUsers();

  if (userInformation.adminStatus) {
    connection.emit("show all users", allUsers);
  }
  const username = decodedToken.username;

  let onlineStatus = userInformation.isOnline;
  await userDataProvider.findUserAndUpdate(
    { username },
    { isOnline: !onlineStatus }
  );

  const allOnlineUsers = await userDataProvider.findAllUserByFilter({
    isOnline: true,
  });
  console.log("allOnlineUsers", allOnlineUsers);

  const allOnlnUsrsArr = allOnlineUsers.map((oneUserInfo) => {
    return oneUserInfo.username;
  });
  connection.emit("user online", allOnlnUsrsArr);
  connection.broadcast.emit("user online", allOnlnUsrsArr);

  const allMessages = await messageDataProvider.getAllMessages();
  connection.emit("download message history", allMessages);
  connection.broadcast.emit("download message history", allMessages);

  connection.on("chat message", (msg) => {
    connection.emit("message", {
      messageText: msg,
      senderUsername: username,
      addTime: currentTime(),
    });
    connection.broadcast.emit("message", {
      messageText: msg,
      senderUsername: username,
      addTime: currentTime(),
    });
    messageDataProvider.createOneMessage(msg, username, currentTime());
  });
};
