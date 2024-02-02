const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');
const { createMessage } = require('../controllers/messageController');

const createChat = async (req, res) => {
    try {
        const { reciever } = req.body;
        const { email } = req.user;
        const chat = await isChatExist(email, reciever);
        if (chat) {
            return res.status(200).json({ message: 'Chat already exists', ...chat });
        }
        const newChat = new Chat({ users: [email, reciever] });
        const savedChat = await newChat.save();
        return res.status(201).json(savedChat);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getChatsOfUser = (req, res) => {

    try {
        const { email } = req.user;
        Chat.find({ users: email }).populate('users', 'email displayName photoURL').then((chats) => {
            return res.status(200).json(chats);
        }).catch((error) => {
            return res.status(500).json({ error: error.message });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

};


const getChatUsers = async (req, res) => {
    try {
        const { email } = req.user;
        const chats = await Chat.find({ users: email });
        let users = new Set();
        chats.forEach(chat => {
            chat.users.forEach(user => {
                if (user !== email) {
                    users.add(user);
                }
            });
        });
        let myChatUsers = {};
        for (let user of users) {
            const userData = await User.findOne({ email: user });
            myChatUsers[user] = userData;
        }
        return res.status(200).json(myChatUsers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).populate('sender', 'email displayName photoURL');
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const isChatExist = async (sender, reciever) => {
    const chat = await Chat.findOne({ users: { $all: [sender, reciever] } });
    return chat;
};

module.exports = { createChat, getChatsOfUser, getChatMessages, isChatExist, getChatUsers };


/*
[
{
"_id": "65bbe4efbf8ad0dcf967eee6",
"users": [
"firebaseraj555@gmail.com",
"dsrajesh12@gmail.com"
],
"createdAt": "2024-02-01T18:37:35.728Z",
"__v": 0
}
]
*/