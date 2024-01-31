const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
    sender: {
        type: String,
        required: [true, 'Sender is required'],
    },
    receiver: {
        type: String,
        required: [true, 'Receiver is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;