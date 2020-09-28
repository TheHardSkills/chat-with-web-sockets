const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chat_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //подключение к бд

const LoginController = require("../BusinessLogic/LoginController");

const app = express();

app.use(cors());
app.use(express.static("./public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.post("/login", async (request, response) => {
  const loginController = new LoginController();
  let loginResult = await loginController.tryLoginUser(
    request.body.username,
    request.body.password
  );
  response.send(loginResult);
});

app.get("/chat", async (request, response) => {
  response.sendFile("/chat.html", { root: "./public" });
});
app.listen(8000);
