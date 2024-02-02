const admin = require('../config/firebase');

const userAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    // console.log(authorization);

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authorization.split(' ')[1];


    try {
        admin.auth().verifyIdToken(idToken)
            .then((decodedToken) => {
                // console.log('decodedToken', decodedToken);
                req.user = decodedToken;
                next();
            })
            .catch((error) => {
                console.log(error.message);
            });
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = userAuth;
