const UserDataProvider = require("../Services/UsersService");
const userDataProvider = new UserDataProvider();

const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const userAutentification = require("../Services/TokensService");
const jwtDecoder = userAutentification.jwtDecoder;

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;
// const usersMap = {};

exports.handleConnection = (io) => async (connection) => {
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

  if (userInformation.adminStatus) {
    const allUsers = await userDataProvider.getAllUsers();
    connection.emit("show all users", allUsers);
  }

  connection.user = userInformation; //нарушает имутабельность
  // usersMap[connection.id] = userInformation;

  connection.on("mute", async (userId) => {
    if (decodedToken.adminStatus) {
      const userInformation = await userDataProvider.findUserById(userId);
      let onMute = userInformation.onMute;
      await userDataProvider.findUserAndUpdate(
        { username: userInformation.username },
        { onMute: !onMute }
      );
      const allUsers = await userDataProvider.getAllUsers();
      connection.emit("show all users", allUsers);
      ///////

      let allConnectedId = Object.keys(io.sockets.connected);
      console.log("-----", allConnectedId);

      console.log("allConnectedId", allConnectedId);
      console.log("userId", userId);
      // console.log("allConnectedId", io.sockets.connected);

      //let user = users.find(item => item.id == 1);
      for (let i = 0; i < allConnectedId.length; i++) {
        let connId = allConnectedId[i];
        //console.log(allConnectedId[i].user._id);
        console.log(
          "allConnectedId[connId]",
          io.sockets.connected[connId].user._id
        );

        if (userId == io.sockets.connected[connId].user._id) {
          console.log("userId", io.sockets.connected[connId].id);

          console.log("Mute user name: ", connection.user.username);
          console.log("connection id: ", connection.id);
        }
      }
    }
    // console.log("*******", allConnectedId);

    // console.log("connected", Object.keys(connection));
  });

  connection.on("ban", async (userId) => {
    if (decodedToken.adminStatus) {
      const userInformation = await userDataProvider.findUserById(userId);
      let onBan = userInformation.onBan;
      await userDataProvider.findUserAndUpdate(
        { username: userInformation.username },
        { onBan: !onBan }
      );

      const allUsers = await userDataProvider.getAllUsers();
      connection.emit("show all users", allUsers);

      //disconn
      console.log("admin connection.id", connection.id);
      let allConnectedId = Object.keys(io.sockets.connected);
      for (let i = 0; i < allConnectedId.length; i++) {
        let connId = allConnectedId[i];

        if (userId == io.sockets.connected[connId].user._id) {
          console.log("userId", io.sockets.connected[connId].id);
          console.log(
            "Ban user name: ",
            io.sockets.connected[connId].user.username
          );
          let connectionId = io.sockets.connected[connId].id;
          console.log("connection id: ", connectionId);
          io.sockets.connected[connectionId].disconnect();
        }
      }
    }
  });

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

  connection.on("chat message", async (msg) => {
    console.log("msg", msg);
    // check 15sec and mute status
    // .....
    const userId = decodedToken.id;
    const userInformation = await userDataProvider.findUserById(userId);
    console.log("username", userInformation.username);
    console.log("userInformation.onMute", userInformation.onMute);

    if (!(userInformation.onMute || userInformation.onBan)) {
      //?
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
    }
  });

  connection.on("disconnect", async () => {
    // delete usersMap[connection.id];

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
