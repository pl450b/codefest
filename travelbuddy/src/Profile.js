import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'
import './Profile.css';

const Profile = () => {
    const [imageUrl, setImageUrl] = useState(
        localStorage.getItem('profilePicture') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png' // Load from localStorage or use default
    );
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        // Save the image URL to localStorage whenever it changes
        localStorage.setItem('profilePicture', imageUrl);
    }, [imageUrl]);

    const handleInputChange = (e) => {
        setNewImageUrl(e.target.value);
    };

    const updateProfilePicture = () => {
        if (newImageUrl.trim()) {
            setImageUrl(newImageUrl);
            setNewImageUrl(''); // Clear the input field
        }
    };

    return (
        <div className="profile-container">
            <Navbar />
            <div class="profile-change-container">
                <h1>Update Profile Picture</h1>
                <div className="profile-picture">
                    <img src={imageUrl} alt="Profile" />
                </div>
                <input 
                    type="text" 
                    placeholder="Enter image URL..." 
                    value={newImageUrl} 
                    onChange={handleInputChange} 
                />
                <button onClick={updateProfilePicture}>Update Picture</button>
            </div>
            
        </div>
    );
};

export default Profile;