const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Message is required'],
    },
    sender: {
        type: String,
        required: [true, 'Sender is required'],
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: [true, 'Chat ID is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;