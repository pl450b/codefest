import './SignUp.css';
import { Link }  from 'react-router-dom'

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
            <button type="button" onclick="login()">Sign Up</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    </div>
  );
}


