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

    const deleteAccount = () => {
        console.log("Your Account Has Been Deleted.")
    }

    const ranks = ["Fledgling", "Wanderer", "Adventurer"];
    const randomIndex = Math.floor(Math.random() * ranks.length);

    const userStats = {
        randomRank: ranks[randomIndex],
        totalPoints: "20,390",
        completedChallenges: 24,
        currentStreak: 7
    };

  // Sample recent challenges data
  const recentChallenges = [
    { id: 1, name: "Tavern Ties", points: 500, completed: "2024-03-15" },
    { id: 2, name: "Daybreak Expedition", points: 300, completed: "2024-03-10" },
    { id: 3, name: "Swift Sights", points: 450, completed: "2024-03-05" }
  ];

  return (
    <div className="profile-container">
        <Navbar />

        <div className="account-info">
            <div className="profile-change-container">
                <h1>Account Settings</h1>
                <div className="update_photo">
                    <div className="profile-picture">
                        <img src={imageUrl} alt="Profile" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Enter image URL..." 
                        value={newImageUrl} 
                        onChange={handleInputChange} 
                    />
                    <button onClick={updateProfilePicture} className="update_btn">Update Picture</button>
                </div>
                <button onClick={deleteAccount} className="delete_btn">Delete Account</button>
            </div>

            <div className="account-stats">
                <div className="heading-container">
                    <h1>Account Stats</h1>
                </div>
                <div className="stats-container">
                    <div className="stat-container">
                        <h3 className="stat-title">Lifetime Points:</h3>
                        <p className="stat-value">{userStats.totalPoints}</p>
                    </div>
                    <div className="stat-container">
                        <h3 className="stat-title">Completed Challenges:</h3>
                        <p className="stat-value">{userStats.completedChallenges}</p>
                    </div>
                    <div className="stat-container">
                        <h3 className="stat-title">Current Streak:</h3>
                        <p className="stat-value">{userStats.currentStreak}</p>
                    </div>
                    <div className="stat-container">
                        <h3 className="stat-title">Current Rank:</h3>
                        <p className="stat-value">{userStats.randomRank}</p>
                    </div>
                </div>

                <div className="heading-container">
                    <h1>Recent Challenges</h1>
                </div>
                <div className="recent-challenges">
                    {recentChallenges.map(challenge => (
                        <div className="challenge-container" key={challenge.id}>
                            <h4>{challenge.name}</h4>
                            <p>+{challenge.points} points</p>
                            <p>Completed on: {challenge.completed}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

};

export default Profile;