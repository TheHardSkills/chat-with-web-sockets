var express = require("express");
const router = express.Router();

const LoginController = require("../Controllers/LoginController");

router.post("/login", async (request, response) => {
  const loginController = new LoginController();
  response.send(
    await loginController.tryLoginUser(
      request.body.username,
      request.body.password
    )
  );
});

router.get("/chat", async (request, response) => {
  response.sendFile("/chat.html", { root: "./public" });
});

module.exports = router;
