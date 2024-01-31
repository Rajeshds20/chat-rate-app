import React from 'react'
import chatRateLogo from '../assets/chatRateLogo.png';

function LoadingState() {
    return (
        <div>
            <img src={chatRateLogo} alt="logo" style={{ height: '250px' }} />
            <h3>Loading...</h3>
        </div>
    )
}

export default LoadingState
