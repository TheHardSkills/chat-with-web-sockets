const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const socketController = require("./Controllers/SocketController");
const handleConnection = socketController.handleConnection;

mongoose.connect("mongodb://localhost:27017/chat_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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

io.on("connection", handleConnection);

server.listen(3000);
