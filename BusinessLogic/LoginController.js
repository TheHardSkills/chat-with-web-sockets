const DataProvider = require("../DataProvider/DataProvider");
const dataProvider = new DataProvider();

class LoginController {
  async tryLoginUser(username, password) {
    let loginUserInfo = await this.userCreation(username, password);
    console.log("loginUserInfo", loginUserInfo);
  }
  async userCreation(username, password) {
    let resultObject = { isLogin: false, error: "" };

    let res = await dataProvider.findOneUserByFilter({ username });
    if (res) {
      if (password === res.password) {
        //вход в чат
        resultObject.isLogin = true;
        return resultObject;
      } //ошибка - не совпадает пароль
      resultObject.error = "Incorrect password";
      return resultObject;
    }
    //создвние нового юзера
    if (!(await dataProvider.findSomeOne())) {
      dataProvider.createOneUser(username, password, true);
    } else {
      dataProvider.createOneUser(username, password, false);
    }
    resultObject.isLogin = true;
    return resultObject;
  }
}

module.exports = LoginController;
