const router = require('express').Router();
const userMiddleware = require('../middleware/userMiddleware');

const { getUsers, createUser, getUserByEmail } = require('../controllers/userController');
const userAuth = require('../auth/userAuth');

router.get('/', userAuth, getUsers);
router.post('/', createUser);
router.get('/:email', userMiddleware, getUserByEmail);

module.exports = router;