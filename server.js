const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chat_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());
app.use(express.static("./public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(require("./API/Routing"));

app.listen(8000);

//WS:

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg); //запись в БД
    socket.emit("message", msg);
    socket.broadcast.emit("message", msg);
  });
});
server.listen(3000, () => {
  console.log("listening on :3000");
});
