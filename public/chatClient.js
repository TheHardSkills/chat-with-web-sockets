let currentToken = localStorage.getItem("token");
const socket = io(`http://localhost:3000/?token=${currentToken}`);

socket.on("connection", () => {
  console.log("We are connection");
});

const mssgBlckCreator = (mssgTxt, time, author) => {
  const allMssgBlck = document.getElementById("allMessageBlock");
  const oneMessageBlock = document.createElement("div");
  oneMessageBlock.className = "oneMessageBlock";
  oneMessageBlock.innerText = mssgTxt;

  const p = document.createElement("p");

  const usernameBlock = document.createElement("span");
  usernameBlock.className = "usernameBlock";
  usernameBlock.innerText = author;

  const messageSendingTimeBlock = document.createElement("span");
  messageSendingTimeBlock.className = "messageSendingTimeBlock";
  messageSendingTimeBlock.innerText = time;

  oneMessageBlock.append(p);
  p.append(usernameBlock);
  p.append(messageSendingTimeBlock);
  allMssgBlck.append(oneMessageBlock);
};
const allUsrsBlckCreator = () => {
  const infoContainer = document.getElementById("infoContainer");

  const allUsersBlock = document.createElement("div");
  allUsersBlock.id = "allUsersBlock";

  const blockHeader = document.createElement("p");
  blockHeader.id = "blockHeader";
  blockHeader.innerText = "ALL USERS:";

  allUsersBlock.append(blockHeader);
  infoContainer.append(allUsersBlock);
};
const usersListCreator = (username) => {
  const allUsersBlock = document.getElementById("allUsersBlock");
  if (!document.getElementById("allUsersList")) {
    const ul = document.createElement("ul");
    ul.id = "allUsersList";
    allUsersBlock.append(ul);
  }
  const allUsersList = document.getElementById("allUsersList");
  const li = document.createElement("li");
  li.innerText = username;
  allUsersList.append(li);
};
const listRemover = (listId) => {
  if (document.getElementById(listId)) {
    let list = document.getElementById(listId);
    list.remove();
  }
};
const onlineUsrLstCreator = (username) => {
  const onlineUsersBlock = document.getElementById("onlineUsersBlock");
  if (!document.getElementById("allOnlneUsrsLst")) {
    const ul = document.createElement("ul");
    ul.id = "allOnlneUsrsLst";
    onlineUsersBlock.append(ul);
  }
  const allOnlneUsrsLst = document.getElementById("allOnlneUsrsLst");
  const li = document.createElement("li");
  li.innerText = username;
  allOnlneUsrsLst.append(li);
};

const sendUserMessage = () => {
  const messageText = document.getElementById("inputWithMessageFromClient")
    .value;
  socket.emit("chat message", messageText);
};

socket.on("message", (msgInfo) => {
  //добавить данные о времени и авторе
  mssgBlckCreator(msgInfo.messageText, msgInfo.addTime, msgInfo.senderUsername);
});
socket.on("disconnect", () => {
  document.location = "http://localhost:8000/";
});

socket.on("muted", () => {
  console.log("mute");
  const sendMessagePanel = document.getElementById("sendMessagePanel");
  sendMessagePanel.remove();
});

socket.on("download message history", (allMessages) => {
  allMessages.map((oneMsg) => {
    mssgBlckCreator(oneMsg.messageText, oneMsg.addTime, oneMsg.senderUsername);
  });
});

socket.on("show all users", (allUsers) => {
  // todo: move to back obj parse
  allUsrsBlckCreator();
  allUsers.map((oneUser) => {
    usersListCreator(oneUser.username);
  });
});

socket.on("user online", (allOnlnUsrsArr) => {
  listRemover("allOnlneUsrsLst");
  allOnlnUsrsArr.map((oneOnlnUsrnm) => {
    onlineUsrLstCreator(oneOnlnUsrnm);
  });
});
