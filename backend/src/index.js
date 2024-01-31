// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Define Mongoose schema and model
const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

const Message = mongoose.model('Message', messageSchema);

// Socket.io setup
io.on('connection', (socket) => {
    console.log('A user connected');

    // Load chat history from the database
    Message.find({}, (err, messages) => {
        if (err) throw err;
        socket.emit('chat history', messages);
    });

    // Handle new messages
    socket.on('chat message', (msg) => {
        const newMessage = new Message(msg);
        newMessage.save((err) => {
            if (err) throw err;
            io.emit('chat message', msg);
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
