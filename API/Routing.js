var express = require("express");
const router = express.Router();

const LoginController = require("../Controllers/LoginController");
// todo
//const loginController = new LoginController();
// router.post("/login", (...args) => loginController.tryLoginUser(...args));
// router.post("/login", loginController.tryLoginUser);

router.post("/login", async (request, response) => {
  const loginController = new LoginController();
  response.send(
    await loginController.tryLoginUser(
      request.body.username,
      request.body.password
    )
  );
});

router.get("/chat", (request, response) => {
  response.sendFile("/chat.html", { root: "./public" });
});

module.exports = router;
