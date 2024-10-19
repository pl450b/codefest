import React, { useState } from 'react';
import { Link }  from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav class="navbar">
            <div class="hamburger-container" onClick={toggleMenu}>
                {isOpen ? (
                    <img src="./imgs/mariott-logo.png" alt="Marriott Logo" className="hamburger-logo" />
                ) : (
                    <div className="hamburger">
                        <span className={isOpen ? 'open' : ''}></span>
                        <span className={isOpen ? 'open' : ''}></span>
                        <span className={isOpen ? 'open' : ''}></span>
                    </div>
                )}
            </div>
            <ul class={`nav-links ${isOpen ? 'active' : ''}`}>
                <li><Link class="nav-link" to="/dashboard">Dashboard</Link></li>
                <li><Link class="nav-link" to="/survey">Survey</Link></li>
                <li><Link class="nav-link" to="/profile">Profile</Link></li>
                <li><Link class="nav-link" to="/login">Sign Out</Link></li>

            </ul>
        </nav>
    );
};

export default HamburgerMenu;