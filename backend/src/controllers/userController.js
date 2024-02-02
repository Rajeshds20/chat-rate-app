const User = require('../models/User');

const getUsers = (req, res) => {

    User.find()
        .then((users) => {
            if (!users) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(users);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const createUser = (req, res) => {
    const { email, password, displayName, photoURL } = req.body;

    if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Email, password and display name are required' });
    }

    const user = new User({ email, password, displayName, photoURL });

    user.save()
        .then((user) => {
            return res.status(201).json(user);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const getUserByEmail = (req, res) => {
    const { email } = req.params;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
}

module.exports = { getUsers, createUser, getUserByEmail };