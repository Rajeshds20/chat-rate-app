// AuthContext.js

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../config/firebaseConfig';
import io from 'socket.io-client';

// Create an AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const socket = useRef();

    const socketURL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                authUser.getIdToken().then((IdToken) => setToken(IdToken));
                setLoading(false);

                // Socket.io Connection
                authUser.getIdToken().then((IdToken) => io(socketURL, {
                    extraHeaders: {
                        Authorization: `Bearer ${IdToken}`,
                    },
                })).then((skt) => {
                    socket.current = skt;
                    console.log(socket.current);
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const signin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                props.setUser(user);
                console.log(user);
            }).catch((error) => {
                console.log(error);
            });
    }

    const signout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <AuthContext.Provider value={{ user, loading, token, signin, signout, socket }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};



// Check for user authentication state changes
// const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//   if (authUser) {
//     setUser(authUser);
//     localStorage.setItem('user', JSON.stringify(authUser));
//     // console.log(authUser);
//   } else {
//     setUser(null);
//     localStorage.removeItem('user');
//   }
// });

// user?.getIdToken().then((token) => {
//   localStorage.setItem('token', token);
// });
