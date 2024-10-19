import './SignUp.css';
import { Link }  from 'react-router-dom';
import React, { useState } from 'react';

export default function SignUp() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url = `http://${ipAddress}:${port}`;   

    const handleSignUp = async () => {
        const response = fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // const data = await response.json();
        // if (response.ok) {
        //     // Store the JWT in localStorage
        //     localStorage.setItem('token', data.token);
        //     alert('Login successful!');
        //     window.location.href = '/dashboard'; // Redirect to dashboard or survey
        // } else {
        //     alert(data.message);
        // }
    };

    return (
    <div class="signup-page-container">
        <div class="login-container">
            <form class="login-form">
                <div class="form-header-group">
                    <img class="bonvoy-img" src="./imgs/bonvoy-logo.png" alt="Mariott Bonvoy Logo" width="50%"></img>
                    <h1 class="testing">Create an Account</h1>
                </div>
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="button" onClick={handleSignUp}>Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    </div>
  );
}


