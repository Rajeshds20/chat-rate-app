import React from 'react';
import { useAuth } from '../context/authContext';
import ChatsDisplay from '../components/ChatsDisplay';

function Messenger() {

    const { user, signout, token } = useAuth();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '90%' }}>
                <h2>Hello {user?.displayName}</h2>
                <div>
                    <button style={{ backgroundColor: 'red' }} onClick={signout}>Sign Out</button>
                </div>
            </div>
            <ChatsDisplay />
        </div>
    )
}

export default Messenger
