// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const admin = require('./config/firebase');
const { createMessage } = require("./controllers/messageController");
const User = require('./models/User');
const getChatMessages = require('./util/getChatMessages');

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

let socketIds = {};

// Socket Auth Middleware with firebase
io.use(function (req, next) {
    const { authorization } = req.handshake.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        // console.log('No authorization');
        return
    }

    const idToken = authorization.split(' ')[1];

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            // console.log('decodedToken', decodedToken);
            User.findOne({ email: decodedToken.email })
                .then((user) => {
                    if (!user) {
                        const newUser = new User({
                            email: decodedToken.email,
                            displayName: decodedToken.name,
                            photoURL: decodedToken.picture,
                        });
                        newUser.save();
                        // console.log('newUser', newUser)
                        req.user = newUser;
                        return next();
                    }
                    req.user = user;
                    return next();
                })
                .catch((error) => {
                    console.log(error.message);
                    return
                });
            next();
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// Socket.io
io.on('connection', (socket) => {
    try {
        if (socket.user.email in socketIds) {
            console.log('User already connected');
            // Send error message to client
            socket.emit('error', { message: 'User already connected' });
            return socket.disconnect();
        }
        console.log(`User connected at ${socket.id}`);
        socketIds[socket.user.email] = socket.id;
        // console.log(socketIds);

        socket.on('sendMessage', ({ chatId, message, recieverEmail, senderEmail, file }) => {
            // const receiverSocketId = socketIds[receiver];
            // console.log('sendMessage', { chatId, message, recieverEmail, senderEmail, file });
            // console.log(receiverSocketId);
            // if (receiverSocketId) {
            //     socket.to(receiverSocketId).emit('receiveMessage', { chatId, message });
            // }
            createMessage({
                text: message, sender: senderEmail, file, recieverEmail, chatId, next: async (msg) => {
                    // Send message to recieverId
                    const recieverSocketId = socketIds[recieverEmail];
                    if (recieverSocketId) {
                        socket.to(recieverSocketId).emit('receiveMessage', { chatId, message: msg, senderEmail });
                    }
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            delete socketIds[socket.user.email];
            // console.log(socketIds);
        });
    } catch (error) {
        console.log(error.message)
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
