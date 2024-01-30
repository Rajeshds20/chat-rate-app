import React, { useState } from 'react';
import './App.css';
import Messenger from './pages/Messenger';
import Login from './pages/Login';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';

function App() {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    // Check for user authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.setItem('user', JSON.stringify(authUser));
        console.log(authUser);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });
    return () => unsubscribe();
  });

  return (
    <>
      {
        user
          ? <Messenger user={user} setUser={setUser} />
          : <Login setUser={setUser} />
      }
    </>
  )
}

export default App
