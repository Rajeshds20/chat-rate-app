// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello from ChatRate!');
});
app.use('/users', userRoute);
app.use('/chats', chatRoute);
app.use('/messages', messageRoute);

// Connect to MongoDB
connectDB();

// Socket.io
io.on('connection', (socket) => {
    console.log(`User connected to ${socket.id}`);

    socket.on('join', ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
    });

    socket.on('sendMessage', ({ chatId, message }) => {
        io.to(chatId).emit('receiveMessage', { message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
