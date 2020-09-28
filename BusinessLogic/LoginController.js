const DataProvider = require("../DataProvider/DataProvider");
const dataProvider = new DataProvider();

const userAutentification = require("../BusinessLogic/UserAuthentication");
const jwtGenerator = userAutentification.jwtGenerator;

class LoginController {
  async tryLoginUser(username, password) {
    return await this.userCreation(username, password);
  }

  async userCreation(username, password) {
    const resultObject = { error: "", token: "" };

    let finderUser = await dataProvider.findOneUserByFilter({ username });
    if (finderUser) {
      if (password === finderUser.password) {
        const token = jwtGenerator({
          username: finderUser.username,
          password: finderUser.password,
        });
        return {
          ...resultObject,
          token,
        };
      }
      return {
        ...resultObject,
        error: "Incorrect password",
      };
    }
    let newUser = await dataProvider.createOneUser(username, password);

    const token = jwtGenerator({
      username: newUser.username,
      password: newUser.password,
    });

    return {
      ...resultObject,
      token,
    };
  }
}

module.exports = LoginController;
