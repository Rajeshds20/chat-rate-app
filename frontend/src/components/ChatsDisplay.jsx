import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import NewChat from './NewChat';

const ChatsDisplay = () => {

    const { token, user, socket } = useAuth();
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [newChats, setNewChats] = useState(false);
    const [currentChatUsers, setCurrentChatUsers] = useState([]);
    const [currentChatEmails, setCurrentChatEmails] = useState([]);
    const [myChatUsers, setMyChatUsers] = useState([]);
    const [myChatMessages, setMyChatMessages] = useState({});
    const [inputText, setInputText] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');

    useEffect(() => {
        fetch(API_URL + '/users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
            .then(response => response.json())
            .then(data => setAllUsers(data));

        fetch(API_URL + '/chats', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                setChats(data);
                let curusers = [];
                let curEmails = new Set();
                // console.log(data)
                data.forEach(chat => {
                    // console.log(chat.users)
                    chat.users.forEach(u => {
                        if (u !== user.email) {
                            curusers.push(u);
                            curEmails.add(u);
                        }
                    });
                });
                setCurrentChatUsers(curusers);
                setCurrentChatEmails(curEmails);
            });

        fetch(API_URL + '/chats/mychats/users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => setMyChatUsers(data));
    }, []);

    const handleKeyDown = React.useCallback((e) => {
        // Handle escape key press
        if (e.key === 'Escape') {
            // console.log(newChats);

            if (newChats) {
                setNewChats(false);
            } else {
                // console.log('Selected Chat on key down', selectedChat);
                if (selectedChat) {
                    setSelectedChat(null);
                }
            }
        }
    }, [newChats, selectedChat]);

    useEffect(() => {
        // Subscribe to messages from the server
        socket.current.on('receiveMessage', async ({ chatId, message, senderEmail }) => {
            console.log('Message received from server', chatId, message, senderEmail);
            // console.log('Message from server', chatId, message, senderEmail);
            const newChatMessages = await fetch(API_URL + '/chats/' + chatId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => response.json());
            setMyChatMessages({ ...myChatMessages, [selectedChat._id]: newChatMessages });
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.current.off('receiveMessage');
        };
    }, [socket, myChatMessages]);

    useEffect(() => {
        if (selectedChat) {
            if (selectedChat._id in myChatMessages) {
                // console.log('Already fetched');
            }
            else {
                fetch(API_URL + '/chats/' + selectedChat._id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data);
                        setMyChatMessages({ ...myChatMessages, [selectedChat._id]: data });
                    });
            }
        }
    }, [selectedChat]);


    useEffect(() => {
        const handleKeyDownEvent = (e) => handleKeyDown(e);
        document.addEventListener('keydown', handleKeyDownEvent);
        return () => {
            document.removeEventListener('keydown', handleKeyDownEvent);
        };
    }, [handleKeyDown]);

    const sendMessage = async (inputText) => {
        const otherUser = selectedChat.users.filter((us) => us !== user.email);
        socket.current.emit('sendMessage', { message: inputText, chatId: selectedChat._id, senderEmail: user.email, recieverEmail: otherUser[0] });
        // setMessages((prevMessages) => [...prevMessages, { text: message, user: 'You' }]);
        // myChatMessages[selectedChat._id] = [...myChatMessages[selectedChat._id], { text: inputText, user: user.email }];
        // console.log(inputText);
        const newChatMessages = await fetch(API_URL + '/chats/' + selectedChat._id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json());
        setMyChatMessages({
            ...myChatMessages, [selectedChat._id]: [...newChatMessages, {
                text: inputText,
                sender: user,
                createdAt: new Date().toISOString(),
                _id: selectedChat._id + 'efeb',
            }]
        });
        setInputText('');
    };


    return (
        <div>
            <h2>Your Chats</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '50px', flexDirection: 'row', width: '100%', height: '500px', overflow: 'hidden', border: '2px solid white', marginBottom: '30px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'flex-start', border: '2px solid black', height: '500px', alignItems: 'center' }}>
                    {
                        chats.length > 0
                            ? chats.map(ch => <ChatComponent key={ch._id} chat={ch} user={user} myChatUsers={myChatUsers} setSelectedUserName={setSelectedUserName} setSelectedChat={setSelectedChat} myChatMessages={myChatMessages} token={token} />)
                            : <p>No chats yet</p>
                    }
                </div>
                <div className='chat-space'>
                    {
                        selectedChat ? <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center', width: '100%', height: '400px', justifyContent: 'flex-end' }}>
                            <h2>{selectedUserName}</h2>
                            {/* <p>{JSON.stringify(myChatMessages[selectedChat._id])}</p> */}
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                {
                                    myChatMessages[selectedChat._id]?.map((msg) => {
                                        // console.log(msg.sender, user.email)
                                        return (
                                            <div key={msg?._id} style={{ margin: '3px', maxWidth: '80%', alignSelf: msg.sender.email === user.email ? 'flex-end' : 'flex-start' }}>
                                                {msg.sender.email == user.email ? 'You' : selectedUserName}
                                                <div style={{ backgroundColor: 'black', borderRadius: '5px', padding: '5px' }}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '10px', paddingTop: '10px' }}>
                                <input type="text" placeholder="Type a message" value={inputText} onChange={(e) => setInputText(e.target.value)} style={{ fontSize: '20px', width: '70%' }} />
                                <button onClick={() => sendMessage(inputText)} style={{ width: '15%', minWidth: '60px' }}>Send</button>
                            </div>
                        </div> : <p>Select a Chat from left to Start Conversation</p>
                    }
                </div>
            </div>
            <button onClick={() => setNewChats(!newChats)}>{newChats ? '^ New Chat' : '+ New Chat'}</button>
            {
                newChats
                    ? <NewChat allUsers={allUsers} currentChatEmails={currentChatEmails} setChats={setChats} chats={chats} currentChatUsers={currentChatUsers} setCurrentChatEmails={setCurrentChatEmails} setCurrentChatUsers={setCurrentChatUsers} />
                    : null
            }
        </div>
    );
};

const ChatComponent = ({ chat, user, myChatUsers, setSelectedChat, setSelectedUserName }) => {
    // Get the other user's information (excluding the current user)
    const otherUser = chat.users.filter((us) => us !== user.email);

    /* {
    "_id": "65bb430f6023ec0278df938c",
    "email": "dsrajesh12@gmail.com",
    "displayName": "D.S. Rajesh",
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocJxFDRKgShiVtdcOGeZ8oqBMUMwdjL-BgsQj3GE_aOE=s96-c",
    "createdAt": "2024-02-01T07:06:55.796Z",
    "__v": 0
} */

    // console.log(myChatUsers[otherUser]);

    // console.log('other user', otherUser, user.email);
    return (
        <div className="chat-container-profile"
            onClick={() => {
                setSelectedChat(chat);
                setSelectedUserName(myChatUsers[otherUser]?.displayName);
            }}>
            <div className="chat-user">
                <img src={myChatUsers[otherUser]?.photoURL} alt="user" onError={e => {
                    e.target.src = 'https://www.gravatar.com/avatar/?d=mp'
                }} />
                <p>{myChatUsers[otherUser]?.displayName}</p>
            </div>
            <div className="chat-info">
                <p>{formatTimestamp(new Date(chat?.createdAt))}</p>
            </div>
        </div >
    );
};

const formatTimestamp = (timestamp) => {
    // Implement your timestamp formatting logic (e.g., using libraries like moment.js)
    // For simplicity, let's assume timestamp is a valid Date object
    return timestamp.toLocaleString();
};

export default ChatsDisplay;
