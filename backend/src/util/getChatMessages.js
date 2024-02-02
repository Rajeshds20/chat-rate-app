const Message = require('../models/Message');

const getChatMessages = async (chatId) => {
    try {
        const messages = await Message.find({ chatId });
        return messages;
    } catch (error) {
        console.log(error.message);
        return;
    }
}

module.exports = { getChatMessages };