let currentToken = localStorage.getItem("token");
const socket = io(`http://localhost:3000/?token=${currentToken}`);

socket.on("connection", () => {
  console.log("We are connection");
});

const mssgBlckCreator = (mssgTxt) => {
  const allMssgBlck = document.getElementById("allUsersBlock");
  const mssgBlck = document.createElement("div");
  mssgBlck.id = "mssgBlck";
  mssgBlck.innerText = mssgTxt;

  allMssgBlck.append(mssgBlck);
};

socket.on("message", (msg) => {
  mssgBlckCreator(msg);
});
socket.on("disconnect", () => {
  document.location = "http://localhost:8000/";
});

socket.on("muted", () => {
  console.log("mute");
  const sendMessagePanel = document.getElementById("sendMessagePanel");
  sendMessagePanel.remove();
});

//todo: with map
socket.on("download message history", (allMessages) => {
  allMessages.map((oneMsg) => {
    mssgBlckCreator(oneMsg.messageText);
  });
});

const sendUserMessage = () => {
  const messageText = document.getElementById("inputWithMessageFromClient")
    .value;
  //mssgBlckCreator(messageText)

  socket.emit("chat message", messageText);
};
