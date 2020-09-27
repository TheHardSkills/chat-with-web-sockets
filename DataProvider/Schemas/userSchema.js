const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    adminStatus: {
        type: Boolean,
        default: false,
    },
    onMute: {
        type: Boolean,
        default: false,
    },
    onBan: {
        type: Boolean,
        default: false,
    },
});

module.exports = userSchema;
