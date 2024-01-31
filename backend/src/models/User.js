const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
    },
    photoURL: {
        type: String,
        default: 'https://www.gravatar.com/avatar/?d=mp',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('user', userSchema);

module.exports = User;