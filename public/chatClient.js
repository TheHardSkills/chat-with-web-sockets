const socket = io("http://localhost:3000");

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

const sendUserMessage = () => {
  const messageText = document.getElementById("inputWithMessageFromClient")
    .value;
  //mssgBlckCreator(messageText)

  socket.emit("chat message", messageText);
};
