const User = require('../models/User');
const userAuth = require('../auth/userAuth');

const userMiddleware = (req, res, next) => {
    userAuth(req, res, () => {

        const userEmail = req.user.email;
        User.findById({ email: userEmail })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                req.user = user;
                return next();
            })
            .catch(async (error) => {
                const newUser = new User({
                    email: userEmail,
                    displayName: req.user.name,
                    photoURL: req.user.picture,
                });
                await newUser.save();
                console.log('newUser', newUser)
                req.user = newUser;
                // await User.findOneAndDelete({ email: userEmail });
                // return next();
            })
            .catch((err) => {
                return res.status(500).json({ error: err.message });
            });
    });
};

module.exports = userMiddleware;