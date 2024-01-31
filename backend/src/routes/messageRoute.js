const router = require('express').Router();

const { createMessage } = require('../controllers/messageController');

router.post('/', createMessage);

module.exports = router;