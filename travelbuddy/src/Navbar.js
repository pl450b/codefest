import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const profilePic = localStorage.getItem('profilePicture') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png' // Load from localStorage or use default

    const SignOut = () => {
        localStorage.removeItem('sessionToken');
        window.location.href = "/login"
    }

    return (
        <div class="navbar">
            <img src="./imgs/mariott-logo.png" alt="" class="company_logo"/>
            <ul>
                <Link to="/dashboard" class="nav-link"><li>Dashboard</li></Link>
                <Link to="/survey" class="nav-link"><li>Survey</li></Link>
                <Link to="/profile" class="nav-link"><li>Profile</li></Link>                
                <Link to="/login" onCick={SignOut} class="nav-link"><li>Sign Out</li></Link>
            </ul>
            <img src={profilePic} alt="" class="profile_pic"/>

        </div>
    );
};

export default Navbar;
