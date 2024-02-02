import React, { useEffect, useState } from 'react';
import Messenger from './pages/Messenger';
import Login from './pages/Login';
import LoadingState from './components/LoadingState';
import { useAuth } from './context/authContext';
import './App.css';

function App() {
  const { user, loading, socket } = useAuth();

  useEffect(() => {
    console.log(user?.email);
    if (user?.email) {
      console.log(socket.current.id);
    }
  }, []);

  return (
    <>
      {
        loading
          ?
          <LoadingState />
          : user
            ? <Messenger />
            : <Login />
      }
    </>
  )
}

export default App
