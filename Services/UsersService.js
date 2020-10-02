const User = require("../Models/userModel");

class UsersService {
  createOneUser(username, password) {
    let user = new User({ username, password });
    return user.save();

    // return (new User({ username, password })).save();
  }

  findOneUserByFilter(filter) {
    return User.findOne(filter).exec();
  }

  findAllUserByFilter(filter) {
    return User.find(filter).exec();
  }

  findUserById(id) {
    return User.findById(id).exec();
  }

  getAllUsers() {
    return User.find({});
  }

  findUserAndUpdate(samplingСriterion, updateParameter) {
    return User.findOneAndUpdate(samplingСriterion, updateParameter);
  }

  triggerMute(id) {
    return this.findUserById(id).then((user) => {
      return User.findOneAndUpdate({ id }, { onMute: !user.onMute });
    });
    // return User.findOneAndUpdate({id}, {onMute});
  }
}

module.exports = UsersService;
