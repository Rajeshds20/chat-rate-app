import React from 'react';
import dummyProfilePic from './dummyProfilePic.jpg'; // Replace with your actual dummy profile picture

const ChatsDisplay = ({ chats }) => {
    return (
        <div>
            <h2>Your Chats</h2>
            {chats.map((chat, index) => (
                <ChatComponent key={index} chat={chat} />
            ))}
        </div>
    );
};

const ChatComponent = ({ chat }) => {
    // Get the other user's information (excluding the current user)
    const otherUser = chat.users.find((user) => user.email !== 'your-email@example.com'); // Replace with the actual email of the current user

    return (
        <div className="chat-container">
            <img src={dummyProfilePic} alt="Profile" className="profile-pic" />
            <div className="chat-info">
                <div className="chat-header">
                    <h3>{otherUser.name}</h3>
                    <p>{formatTimestamp(chat.lastMessage.createdAt)}</p>
                </div>
                <p>{chat.lastMessage.text}</p>
            </div>
        </div>
    );
};

const formatTimestamp = (timestamp) => {
    // Implement your timestamp formatting logic (e.g., using libraries like moment.js)
    // For simplicity, let's assume timestamp is a valid Date object
    return timestamp.toLocaleString();
};

export default ChatsDisplay;
