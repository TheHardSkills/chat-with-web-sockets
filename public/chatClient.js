const socket = io("http://localhost:3000");

socket.on("connection", () => {
  console.log("We are connection");
});

const sendUserMessage = () => {
  const messageText = document.getElementById("inputWithMessageFromClient")
    .value;
  mssgBlckCreator(messageText);
  socket.emit("chat message", messageText);
};

const mssgBlckCreator = (mssgTxt) => {
  const allMssgBlck = document.getElementById("allUsersBlock");
  const mssgBlck = document.createElement("div");
  mssgBlck.id = "mssgBlck";
  mssgBlck.innerText = mssgTxt;

  allMssgBlck.append(mssgBlck);
};
