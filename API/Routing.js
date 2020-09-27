//АПИ ничего не делает, только: извлекает данные из request и отдает куда нужно (БЛ)
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chat_db", { useNewUrlParser: true, useUnifiedTopology: true }); //подключение к бд
const LoginController = require("../BusinessLogic/LoginController");

mongoose.connect("mongodb://localhost:27017/chat_db", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(cors());
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post("/login", async (request, response) => {
  const loginController = new LoginController();
  let loginResult = loginController.tryLoginUser(request.body.username, request.body.password); //isAutorize, Error 
});

app.get("/chat", async (request, response) => {
  response.sendFile("/chat.html", { root: "./public" });
});
app.listen(8000);

