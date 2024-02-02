const Message = require('../models/Message');
const User = require('../models/User');

const createMessage = async ({ text, sender, receiverEmail, file, chatId, next }) => {
    try {
        if (!(text || file) || !sender || !chatId) {
            return res.status(400).json({ error: 'Text, sender and chat ID are required' });
        }

        const senderId = await User.findOne({ email: sender }).select('_id');
        const message = new Message({ text, sender: senderId, file, chatId });
        await message.save();

        // console.log('Message saved', message);
        next(message);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { createMessage };