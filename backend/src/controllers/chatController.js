const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');
const messageController = require('../controllers/messageController');

const createChat = async (req, res) => {
    const { users } = req.body;

    if (!users || users.length === 0) {
        return res.status(400).json({ error: 'Users are required' });
    }

    const chat = new Chat({ users });

    chat.save()
        .then((chat) => {
            return res.status(201).json(chat);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const getChatsOfUser = (req, res) => {
    const { userId } = req.params;

    Chat.find({ users: userId })
        .then((chats) => {
            return res.status(200).json(chats);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const getChatMessages = (req, res) => {
    const { chatId } = req.params;

    Message.find({ chatId })
        .then((messages) => {
            return res.status(200).json(messages);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

module.exports = { createChat, getChatsOfUser, getChatMessages };