const User = require("../Models/userModel");

class UsersService {
  createOneUser(username, password) {
    let user = new User({ username, password });

    return user.save();
  }

  findOneUserByFilter(filter) {
    return User.findOne(filter).exec();
  }
}

module.exports = UsersService;
