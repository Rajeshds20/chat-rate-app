import React from 'react'
import { auth, provider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import googleIcon from '../assets/googleIcon.png';
import chatRateLogo from '../assets/chatRateLogo.png';

function Login(props) {

    const handleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                props.setUser(user);
                console.log(user);
            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={chatRateLogo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '200px', marginTop: '50px' }} />
            <h1>Welcome to Chat-Rate App</h1>
            <h2>Sign In to continue to Application</h2>
            <button style={{ fontSize: '25px', padding: '15px', display: 'flex', alignItems: 'center', border: '2px solid gray' }} onClick={handleSignIn}><img src={googleIcon} style={{ height: '40px' }} />Sign In with Google</button>
        </div>
    )
}

export default Login
