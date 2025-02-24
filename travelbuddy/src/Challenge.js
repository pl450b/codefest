import React from 'react';
import './Challenge.css';

const ChallengeCard = ({ challengeInfo, className }) => {
  const challengeName = challengeInfo[0];
  const challengeReward = challengeInfo[2];
  const challengeDescription = challengeInfo[1];

  return (
    <div className={`challenge-card ${className}`}>
      <div className="card-header">
        <h2 className="quest-name">{challengeName}</h2>
      </div>
      <div className="card-body">
        <p className="description">{challengeDescription}</p>
      </div>
      <div className="reward-section">
        <h3>Reward:</h3>
        <p className="reward">{challengeReward}</p>
      </div>
    </div>
  );
};

export default ChallengeCard;
