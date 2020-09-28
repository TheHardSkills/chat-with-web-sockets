const mongoose = require("mongoose");
const User = require("./Models/userModel");

class DataProvider {
  createOneUser(username, password, adminStatus) {
    let user = new User({ username, password, adminStatus });
    return user.save();
  }

  findSomeOne() {
    return User.findOne().exec();
  }

  findOneUserByFilter(filter) {
    return User.findOne(filter).exec();
  }
}

module.exports = DataProvider;
