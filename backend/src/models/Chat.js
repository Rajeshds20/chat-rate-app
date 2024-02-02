const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: {
        type: Array,
        required: [true, 'Users are required'],
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;