import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../context/authContext';

function UserDisplay({ us, setSelectedUser, setDialogOpen }) {
    const handleClick = () => {
        setSelectedUser(us);
        setDialogOpen(true);
    }
    return (
        <li onClick={handleClick} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', gap: '10px', borderRadius: '5px' }} className='each-user-display'>
            <img style={{ width: '30px', height: '30px' }} src={us.photoURL} alt={us.displayName} onError={e => {
                e.target.src = 'https://www.gravatar.com/avatar/?d=mp'
            }} />
            <h3>{us.displayName}</h3>
        </li>
    )
};

function NewChat({ allUsers, currentChatEmails, setCurrentChatEmails, setCurrentChatUsers, setChats, chats, currentChatUsers }) {

    const { user, token } = useAuth();

    console.log('Current Chat Emails', currentChatEmails);

    const [filteredUsers, setFilteredUsers] = useState(allUsers.filter(u => u.email != user.email && !currentChatEmails.has(u.email)));
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDialogClose = (e) => {
        setDialogOpen(false);
    };

    return (
        <div style={{ backgroundColor: 'beige', color: 'black' }}>
            <h2>New Chat</h2>
            <ul style={{ padding: '0 20px 0 20px' }}>
                {
                    filteredUsers.length > 0 ?
                        filteredUsers.map(us =>
                            // <li onClick={() => {
                            //     setSelectedUser(us);
                            //     setDialogOpen(true);
                            // }} style={{ cursor: 'pointer' }} key={us._id}>{us.displayName}</li>
                            <UserDisplay key={us._id} us={us} setSelectedUser={setSelectedUser} setDialogOpen={setDialogOpen} />
                        )
                        : <p>No New Users to chat</p>
                }
            </ul>
            {
                dialogOpen && <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Start New Chat?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you want to start a new conversation with {selectedUser.displayName}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Disagree</Button>
                        <Button onClick={() => {
                            handleDialogClose();
                            // Start a new chat
                            fetch(API_URL + '/chats',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + token,
                                    },
                                    body: JSON.stringify({ reciever: selectedUser.email })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data);
                                    // Add the new chat to the chats array
                                    setChats([data, ...chats]);
                                    // Add the new user to the currentChatUsers array
                                    setCurrentChatUsers([...currentChatUsers, selectedUser]);
                                    // Add the new user to the currentChatEmails array
                                    setCurrentChatEmails(new Set([...currentChatEmails, selectedUser.email]));
                                    setSelectedUser(null);
                                    setFilteredUsers(filteredUsers.filter(u => u.email != selectedUser.email));
                                });
                        }} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </div>
    )
}

export default NewChat

/*
allUsers = [
{
    "_id": "65bb430f6023ec0278df938c",
    "email": "dsrajesh12@gmail.com",
    "displayName": "D.S. Rajesh",
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocJxFDRKgShiVtdcOGeZ8oqBMUMwdjL-BgsQj3GE_aOE=s96-c",
    "createdAt": "2024-02-01T07:06:55.796Z",
    "__v": 0
},
{
    "_id": "65bb430f6023ec0278df938e",
    "email": "firebaseraj555@gmail.com",
    "displayName": "Firebase Raj",
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocLsjagXHoBuckG_pD4xjcAp2Hhr1woNLPWvyeKdLfGw=s96-c",
    "createdAt": "2024-02-01T07:06:55.904Z",
    "__v": 0
}
]
*/