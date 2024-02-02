const router = require('express').Router();

const { createChat, getChatsOfUser, getChatMessages, getChatUsers } = require('../controllers/chatController');
const userAuth = require('../auth/userAuth');

router.post('/', userAuth, createChat);
router.get('/:chatId', getChatMessages);
router.get('/', userAuth, getChatsOfUser);
router.get('/mychats/users', userAuth, getChatUsers);

module.exports = router;
