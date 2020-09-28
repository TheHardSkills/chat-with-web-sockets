const DataProvider = require("../DataProvider/DataProvider");
const dataProvider = new DataProvider();

const userAutentification = require("../BusinessLogic/UserAuthentication");
const jwtGenerator = userAutentification.jwtGenerator;

class LoginController {
  async tryLoginUser(username, password) {
    let loginUserInfo = await this.userCreation(username, password);
    console.log("loginUserInfo", loginUserInfo);
  }

  async userCreation(username, password) {
    const resultObject = { isLogin: false, error: "", token: "" };

    let finderUser = await dataProvider.findOneUserByFilter({ username });
    if (finderUser) {
      console.log("res 1", finderUser);
      if (password === finderUser.password) {
        const token = jwtGenerator({
          username: finderUser.username,
          password: finderUser.password,
        });
        return {
          ...resultObject,
          token,
          isLogin: true,
        };
      }
      return {
        ...resultObject,
        error: "Incorrect password",
      };
    }
    let newUser = await dataProvider.createOneUser(username, password);
    console.log("res 2", newUser);

    const token = jwtGenerator({
      username: newUser.username,
      password: newUser.password,
    });

    return {
      ...resultObject,
      isLogin: true,
      token,
    };
  }
}

module.exports = LoginController;
