const DataProvider = require("../DataProvider/DataProvider");
const dataProvider = new DataProvider();

class LoginController {
    async tryLoginUser(username, password) {
        let resultObject = { isLogin: "", error: "" };

        if (!await dataProvider.findSomeOne()) dataProvider.createOneUser(username, password, true);
        else dataProvider.createOneUser(username);
        //return resultObject
    }
    // checkUserExistence
}

module.exports = LoginController;