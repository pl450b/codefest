import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const profilePic = localStorage.getItem('profilePicture') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png' // Load from localStorage or use default

    return (
        <div class="navbar">
            <img src="./imgs/mariott-logo.png" alt="" class="company_logo"/>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/survey">Survey</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/">Sign Out</Link></li>

            </ul>
            <img src={profilePic} alt="" class="profile_pic"/>

        </div>
    );
};

export default Navbar;
