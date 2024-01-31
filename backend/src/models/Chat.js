const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: {
        type: Array,
        required: [true, 'Users are required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;