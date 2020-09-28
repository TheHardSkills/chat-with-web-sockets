// -- server.js ---

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chat_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// -- end ---

const LoginController = require("../Controllers/LoginController");

// --- server.js ---
const app = express();

app.use(cors());
app.use(express.static("./public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// -- end --

// app.post("/login", (...args) => LoginController.tryLoginUser(...args));
// app.post("/login", LoginController.tryLoginUser);

app.post("/login", async (request, response) => {
  const loginController = new LoginController();
  let loginResult = await loginController.tryLoginUser(
    request.body.username,
    request.body.password
  );
  console.log("loginResult", loginResult);
  response.send(loginResult);
});

app.get("/chat", async (request, response) => {
  response.sendFile("/chat.html", { root: "./public" });
});

// -- server.js --
app.listen(8000);

//WS

const server = require("http").createServer(app);
const io = require("socket.io", { transports: ["websocket"] })(server);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});
server.listen(3000, () => {
  console.log("listening on :3000");
});

//' -- end
