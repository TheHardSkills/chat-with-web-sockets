const passwordHash = require("password-hash");

const UserDataProvider = require("../Services/UsersService");
const userDataProvider = new UserDataProvider();

const userAutentification = require("../Services/TokensService");
const jwtGenerator = userAutentification.jwtGenerator;

class LoginController {
  async tryLoginUser(username, password) {
    return await this.userCreation(username, password);
  }

  async userCreation(username, password) {
    const resultObject = { error: "", token: "" };
    let finderUser = await userDataProvider.findOneUserByFilter({ username });

    if (finderUser) {
      if (passwordHash.verify(password, finderUser.password)) {
        const token = jwtGenerator({
          adminStatus: finderUser.adminStatus,
          onMute: finderUser.onMute,
          username: finderUser.username,
          id: finderUser.id,
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
    let newUser = await userDataProvider.createOneUser(
      username,
      passwordHash.generate(password)
    );
    const token = jwtGenerator({
      adminStatus: newUser.adminStatus,
      onMute: newUser.onMute,
      username: newUser.username,
      id: newUser.id,
    });

    return {
      ...resultObject,
      token,
    };
  }
}

module.exports = LoginController;
