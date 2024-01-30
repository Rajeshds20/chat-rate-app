// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// MongoDB setup
mongoose.connect('mongodb+srv://testuser:test123@mycluster.hpr4gt6.mongodb.net/chatApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(function () {
    console.log('MongoDB connected');
}).catch(function (err) {
    console.log(err);
});

// Define Mongoose schema and model
const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
});

const Message = mongoose.model('Message', messageSchema);

// Express setup
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

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
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
