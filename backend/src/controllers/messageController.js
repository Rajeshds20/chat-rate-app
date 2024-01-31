const Message = require('../models/Message');


const createMessage = (req, res) => {
    const { text, sender, chatId } = req.body;

    if (!text || !sender || !chatId) {
        return res.status(400).json({ error: 'Text, sender and chat ID are required' });
    }

    const message = new Message({ text, sender, chatId });

    message.save()
        .then((message) => {
            return res.status(201).json(message);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

module.exports = { createMessage };