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
  if (!userInformation || userInformation.onBan) {
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

  await userDataProvider.findUserAndUpdate({ username }, { isOnline: true });

  const allOnlineUsers = await userDataProvider.findAllUserByFilter({
    isOnline: true,
  });

  const allOnlnUsrsArr = allOnlineUsers.map((oneUserInfo) => {
    return oneUserInfo.username;
  });
  connection.emit("user online", allOnlnUsrsArr);
  connection.broadcast.emit("user online", allOnlnUsrsArr);

  const allMessages = await messageDataProvider.getAllMessages();
  connection.emit("download message history", allMessages);
  connection.broadcast.emit("download message history", allMessages);

  connection.on("chat message", (msg) => {
    // check 15sec and mute status
    // .....

    const time = currentTime();
    connection.emit("message", {
      messageText: msg,
      senderUsername: username,
      addTime: time,
    });
    connection.broadcast.emit("message", {
      messageText: msg,
      senderUsername: username,
      addTime: time,
    });
    messageDataProvider.createOneMessage(msg, username, time);
  });

  connection.on("disconnect", async () => {
    //изменить статус онлайн
    //отправить новые данные в онлайн юзер на клиент

    await userDataProvider.findUserAndUpdate({ username }, { isOnline: false });

    const allOnlineUsers = await userDataProvider.findAllUserByFilter({
      isOnline: true,
    });
    const allOnlnUsrsArr = allOnlineUsers.map((oneUserInfo) => {
      return oneUserInfo.username;
    });
    connection.emit("user online", allOnlnUsrsArr);
    connection.broadcast.emit("user online", allOnlnUsrsArr);
  });
};
