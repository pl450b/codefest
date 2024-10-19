import './SignUp.css';
import { Link }  from 'react-router-dom'

function send_signup_credentials() {
    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url = `http://${ipAddress}:${port}/`;

    const fetchRequest = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: 'myTestUsername', pass:'myTestPassword'})
    });

    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 2000)
    );


    Promise.race([fetchRequest, timeout])
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert(`Response: ${data.message}`);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while sending the request.');
        });
    
}

export default function SignUp() {
  return (
    <div class="login-container">
        <form class="login-form">
            <div class="form-header-group">
                <img class="bonvoy-img" src="bonvoy-logo.png" alt="Mariott Bonvoy Logo" width="50%"></img>
                <h1 class="testing">Create an Account</h1>
            </div>
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Enter your username"/>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password"/>
            </div>
            <button type="button" onClick={send_signup_credentials}>Sign Up</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    </div>
  );
}


