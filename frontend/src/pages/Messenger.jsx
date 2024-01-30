import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Messenger(props) {

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                props.setUser(null);
            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            Hello {props.user.displayName}
            <button onClick={handleSignOut}>Sign Out</button>
        </>
    )
}

export default Messenger
