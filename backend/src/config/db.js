const mongoose = require('mongoose');
require('dotenv').config();
// Connect to MongoDB
mongoose.connect(process.env.DB_URI).then(function (c) {
    console.log('MongoDB connected to', c.connection.host);
}).catch(function (err) {
    console.log('Could not connect to DB:', err.message);
});