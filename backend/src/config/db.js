const mongoose = require('mongoose');
require('dotenv').config();

// Connection to MongoDB
module.exports = function () {
    mongoose.connect(process.env.DB_URI).then(function (c) {
        console.log('Connected to MongoDB at', c.connection.host);
    }).catch(function (err) {
        console.log('Could not connect to DB:', err.message);
    });
}