// RewardsPage.jsx
import React from 'react';
import './Rewards.css';

const RewardsPage = () => {
  // Sample user stats data
  const userStats = {
    totalPoints: 1250,
    completedChallenges: 15,
    currentStreak: 7,
    ranking: 42
  };

  // Sample recent challenges data
  const recentChallenges = [
    { id: 1, name: "30 Days of Code", points: 500, completed: "2024-03-15" },
    { id: 2, name: "Bug Hunter", points: 300, completed: "2024-03-10" },
    { id: 3, name: "Team Challenge", points: 450, completed: "2024-03-05" }
  ];

  return (
    <div className="rewards-page">
      <h1 className="rewards-title">My Rewards</h1>

    <div class="stats-and-challenges">
        <div className="user-stats">
            <h2 className="section-title">User Statistics</h2>
            <div className="stats-info">
            <p>Total Points: <span>{userStats.totalPoints}</span></p>
            <p>Completed Challenges: <span>{userStats.completedChallenges}</span></p>
            <p>Current Streak: <span>{userStats.currentStreak} days</span></p>
            <p>Global Ranking: <span>#{userStats.ranking}</span></p>
            </div>
        </div>

        <div className="recent-challenges">
            <h2 className="section-title">Recent Challenges</h2>
            <ul>
            {recentChallenges.map((challenge) => (
                <li key={challenge.id} className="challenge-item">
                {challenge.name} - <span>+{challenge.points} pts</span>
                <br />
                <small>Completed: {challenge.completed}</small>
                </li>
            ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;