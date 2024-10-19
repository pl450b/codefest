import './Login.css';
import { Link }  from 'react-router-dom';
import React, { useState } from 'react';


export default function Login() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url = `http://${ipAddress}:${port}/login`;

    const handleLogin = async () => {
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('sessionToken', data.token);
            alert('Login successful!');
            window.location.href = '/dashboard'; // Redirect to dashboard or survey
        } else {
            alert(data.message);
        }
    };


    return (
        <div class="login-page-container">
            <div class="login-container">
                <form class="login-form">
                    <div class="form-header-group">
                        <img class="bonvoy-img" src="./imgs/bonvoy-logo.png" alt="Mariott Bonvoy Logo" width="50%"></img>
                        <h1 class="testing">Login</h1>
                    </div>
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="button" onClick={handleLogin}>Login</button>
                    <p>Need an account? <Link to="/">Sign Up</Link></p>
                </form>
            </div>
        </div>
        
  );
}


