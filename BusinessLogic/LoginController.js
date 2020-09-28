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
          isOnline: finderUser.isOnline,
          adminStatus: finderUser.adminStatus,
          onMute: finderUser.onMute,
          onBan: finderUser.onBan,
          username: finderUser.username,
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
      isOnline: newUser.isOnline,
      adminStatus: newUser.adminStatus,
      onMute: newUser.onMute,
      onBan: newUser.onBan,
      username: newUser.username,
    });

    return {
      ...resultObject,
      token,
    };
  }
}

module.exports = LoginController;
