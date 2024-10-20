import './SignUp.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url = `http://${ipAddress}:${port}`; // Adjust the endpoint if needed

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("User created!");
            window.location.href = '/login'; // Redirect to login screen
        } else {
            setErrorMessage(data.message); // Update error message
        }
    };

    return (
        <div className="signup-page-container">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSignUp}> {/* Add onSubmit here */}
                    <div className="form-header-group">
                        <img className="bonvoy-img" src="./imgs/bonvoy-logo.png" alt="Mariott Bonvoy Logo" width="50%" />
                        <h1 className="testing">Create an Account</h1>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Sign Up</button> {/* Change type to "submit" */}
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </div>
    );
}
