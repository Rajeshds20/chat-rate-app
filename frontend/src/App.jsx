import React, { useState } from 'react';
import Messenger from './pages/Messenger';
import Login from './pages/Login';
import LoadingState from './components/LoadingState';
import createSocketConnection from './config/Socket';
import { useAuth } from './context/authContext';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  const socketURL = import.meta.env.VITE_APP_API_URL;

  React.useEffect(() => {
    const { disconnectSocket } = createSocketConnection(socketURL)

    return () => {
      // unsubscribe();
      disconnectSocket();
    }
  });

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
