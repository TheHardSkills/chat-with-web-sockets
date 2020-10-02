let currentToken = localStorage.getItem("token");
const socket = io(`http://localhost:3000/?token=${currentToken}`);

socket.on("connection", () => {
  console.log("We are connection");
});

let allUsersObj = {};
const idKeeper = (username, userId) => {
  allUsersObj[username] = userId;
};
console.log("allUsersObj", allUsersObj);

//del start
const allMsgBlck = () => {
  const allMessageBlock = document.createElement("div");
  allMessageBlock.id = "allMessageBlock";
};
//del end

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
const usersListCreator = (username, muteStatus, banStatus, adminStatus) => {
  const allUsersBlock = document.getElementById("allUsersBlock");
  if (!document.getElementById("allUsersList")) {
    const ul = document.createElement("ul");
    ul.id = "allUsersList";
    allUsersBlock.append(ul);
  }
  const allUsersList = document.getElementById("allUsersList");
  const li = document.createElement("li");
  li.innerText = username;
  if (!adminStatus) {
    const muteBttn = document.createElement("button");
    let muteBttnValue = "Mute";
    if (muteStatus) {
      muteBttnValue = "Unmute";
    }
    muteBttn.innerText = muteBttnValue;
    muteBttn.className = "muteBttn";
    muteBttn.onclick = () => {
      const liText = li.innerText;
      console.log(liText);
      const liInfo = liText.split(muteBttnValue);
      const userId = allUsersObj[liInfo[0]];
      muteUser(userId); // **
      // let className = muteBttnValue.toLowerCase();
      // sendMssgBttn.className=className;
    };

    const banBttn = document.createElement("button");
    let banBttnValue = "Ban";
    if (banStatus) {
      banBttnValue = "Unban";
    }
    banBttn.innerText = banBttnValue;
    banBttn.className = "banBttn";
    banBttn.onclick = () => {
      const liText = li.innerText;
      const liInfo = liText.split(muteBttnValue);
      const userId = allUsersObj[liInfo[0]];
      banUser(userId);
    };

    li.append(muteBttn);
    li.append(banBttn);
  }
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

const muteUser = (muteUserId) => {
  socket.emit("mute", muteUserId);
};

const banUser = (banUserId) => {
  socket.emit("ban", banUserId);
};

socket.on("message", (msgInfo) => {
  mssgBlckCreator(msgInfo.messageText, msgInfo.addTime, msgInfo.senderUsername);
});

socket.on("spammer", () => {
  alert("You can send messages no more than once every 15 seconds");
});

socket.on("disconnect", () => {
  document.location = "http://localhost:8000/";
});

socket.on("muted", () => {
  const sendMssgBttn = document.getElementById("sendMssgBttn");
  sendMssgBttn.disabled = true;
});

socket.on("unmuted", () => {
  const sendMssgBttn = document.getElementById("sendMssgBttn");
  sendMssgBttn.disabled = false;
});

socket.on("download message history", (allMessages) => {
  allMessages.map((oneMsg) => {
    mssgBlckCreator(oneMsg.messageText, oneMsg.addTime, oneMsg.senderUsername);
  });
});

socket.on("show all users", (allUsers) => {
  listRemover("allUsersBlock");
  allUsrsBlckCreator();
  allUsers.map(({ _id, username, onMute, onBan, adminStatus }) => {
    usersListCreator(username, onMute, onBan, adminStatus);
    idKeeper(username, _id);
  });
});

socket.on("user online", (allOnlnUsrsArr) => {
  listRemover("allOnlneUsrsLst");
  allOnlnUsrsArr.map((oneOnlnUsrnm) => {
    onlineUsrLstCreator(oneOnlnUsrnm);
  });
});
