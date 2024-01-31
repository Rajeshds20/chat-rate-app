const router = require('express').Router();
const userMiddleware = require('../middleware/userMiddleware');

const { getUser, createUser } = require('../controllers/userController');

router.get('/:userId', userMiddleware, getUser);
router.post('/', createUser);

module.exports = router;