import React from 'react';
import './Challenge.css';

const ChallengeCard = ({ questName, description, reward }) => {
  return (
    <div className="challenge-card">
      <div className="card-header">
        <h2 className="quest-name">{questName}</h2>
      </div>
      <div className="card-body">
        <p className="description">{description}</p>
      </div>
      <div className="reward-section">
        <h3>Reward:</h3>
        <p className="reward">{reward}</p>
      </div>
    </div>
  );
};

export default ChallengeCard;

