const mongoose = require("mongoose");
const User = require("./Models/userModel");

class DataProvider {
    createOneUser(username, password, adminStatus) {
        let user = new User({ username, password, adminStatus });
        user.save(function (err, succ) {
            if (err) return console.error(err);
            else {
                console.log("*Save successfully*");
                return succ;
            }
        });
    }

    findSomeOne() {
        return User.findOne().exec();
    }

    findOneUserByFilter(filter) {
        return User.findOne(filter).exec();
    }
}

module.exports = DataProvider;