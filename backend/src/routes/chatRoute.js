const router = require('express').Router();

const { createChat, getChatsOfUser, getChatMessages } = require('../controllers/chatController');

router.post('/', createChat);
router.get('/:chatId', getChatMessages);
router.get('/mychats', getChatsOfUser);

module.exports = router;
