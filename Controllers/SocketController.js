const UserDataProvider = require("../Services/UsersService");
const userDataProvider = new UserDataProvider();

const MessageDataProvider = require("../Services/MessagesService");
const messageDataProvider = new MessageDataProvider();

const userAutentification = require("../Services/TokensService");
const jwtDecoder = userAutentification.jwtDecoder;

const timeService = require("../Services/TimeService");
const currentTime = timeService.getCurrentTime;

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
  }

  if (userInformation.adminStatus) {
    const allUsers = await userDataProvider.getAllUsers();
    connection.emit("show all users", allUsers);
  }

  connection.user = userInformation;

  // connection.on("unmute", async (userId) => {
  //   if (decodedToken.adminStatus) {

  //     await userDataProvider.findUserAndUpdate(
  //       { id: userId },
  //       { onMute: false }
  //     );
  // }});

  connection.on("mute", async (userId) => {
    if (decodedToken.adminStatus) {
      // await userDataProvider.triggerMute(userId);

      const userInformation = await userDataProvider.findUserById(userId);
      let onMute = userInformation.onMute;
      await userDataProvider.findUserAndUpdate(
        { username: userInformation.username },
        { onMute: !onMute }
      );
      const allUsers = await userDataProvider.getAllUsers();
      connection.emit("show all users", allUsers);

      const targer = Object.values(io.sockets.connected).find(
        (conn) => conn.user.id === userId
      );

      //-targer.emit(onMute ? "muted" : "unmuted");
      //-targer.emit('muted', {onMuted});

      let allConnectedId = Object.keys(io.sockets.connected);

      for (let i = 0; i < allConnectedId.length; i++) {
        let connId = allConnectedId[i];

        if (userId == io.sockets.connected[connId].user._id) {
          let connectionId = io.sockets.connected[connId].id;

          if (!onMute) {
            io.sockets.connected[connectionId].emit("muted");
          } else {
            io.sockets.connected[connectionId].emit("unmuted");
          }
        }
      }
    }
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

      let allConnectedId = Object.keys(io.sockets.connected);
      for (let i = 0; i < allConnectedId.length; i++) {
        let connId = allConnectedId[i];
        if (userId == io.sockets.connected[connId].user._id) {
          let connectionId = io.sockets.connected[connId].id;
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

  connection.on("chat message", async (msg) => {
    const userId = decodedToken.id;
    const userInformation = await userDataProvider.findUserById(userId);

    if (!(userInformation.onMute || userInformation.onBan)) {
      const allUsrMssg = await messageDataProvider.getAllMssgByFilter({
        senderUsername: userInformation.username,
      });

      const timeMsg = currentTime();
      if (allUsrMssg.length) {
        let timestampLstMssg = Date.parse(allUsrMssg.pop().addTime);
        let currentTimestamp = Date.parse(timeMsg);

        // console.log("timestampLstMssg", timestampLstMssg);
        // if (timestampLstMssg + 15000 >= currentTimestamp) {
        //   connection.emit("spammer");
        //   return;
        // }
      }
      connection.emit("message", {
        messageText: msg,
        senderUsername: username,
        addTime: timeMsg,
      });
      connection.broadcast.emit("message", {
        messageText: msg,
        senderUsername: username,
        addTime: timeMsg,
      });
      await messageDataProvider.createOneMessage(msg, username, timeMsg);

      const allMessages = await messageDataProvider.getAllMessages();
      connection.emit("download message history", allMessages);
    }
  });

  const allMessages = await messageDataProvider.getAllMessages();
  connection.emit("download message history", allMessages);

  connection.on("disconnect", async () => {
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
