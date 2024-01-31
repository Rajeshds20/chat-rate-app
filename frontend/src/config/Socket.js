// socket.js

import io from 'socket.io-client';

const createSocketConnection = (socketURL) => {
    const socket = io(socketURL);

    socket.on('connect', () => {
        console.log('Connected to the Socket.IO server');
    });

    socket.on('message', (message) => {
        // messageHandler(message);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from the server');
        // disconnectHandler();
    });

    return {
        disconnectSocket: () => {
            socket.disconnect();
        }
    };
};

export default createSocketConnection;
