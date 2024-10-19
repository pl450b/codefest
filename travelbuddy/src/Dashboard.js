import { useState } from 'react';
import Challenge from './Challenge';
import './Dashboard.css';
import Navbar from './Navbar';

export default function Dashboard() {
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [centeredChallenge, setCenteredChallenge] = useState(null);
    const [confirmButtonClicked, setConfirmButtonClicked] = useState(false);

    const handleChallengeClick = (event, challenge) => {
        setSelectedChallenge(challenge);
        setShowConfirmButton(true);
    };

    const handleConfirmClick = () => {
        setCenteredChallenge(selectedChallenge);
        setShowConfirmButton(false);
        setConfirmButtonClicked(true);
    };

    return (
        <div class="dashboard-container background-initial">
        <div className="dashboard-container">
            <Navbar />
            <div className="challenges-header-and-container">
                {confirmButtonClicked ? (<h1 className="challenges-header">
                    Selected Quest
                </h1>) : (<h1 className="challenges-header">
                    Available Quests
                </h1>)}
                <div class="challenge-with-confirm-button">

                    <div className="challenges-container">
                        {centeredChallenge ? (
                            <Challenge challengeInfo={centeredChallenge} centered />
                        ) : (
                            <>
                                <div onClick={(e) => handleChallengeClick(e, ["Daybreak Expedition", "+75 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"])}>
                                    <Challenge challengeInfo={["Daybreak Expedition", "+75 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"]}/>
                                </div>
                                <div onClick={(e) => handleChallengeClick(e, ["Tavern Ties", "+50 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"])}>
                                    <Challenge challengeInfo={["Tavern Ties", "+50 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"]}/>
                                </div>
                                <div onClick={(e) => handleChallengeClick(e, ["Tavern Ties", "+50 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"])}>
                                    <Challenge challengeInfo={["Tavern Ties", "+50 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"]}/>
                                </div>
                            </>
                        )}
                    </div>
                    {/* Show the confirm button if a challenge is selected */}
                    {showConfirmButton && (
                        <button 
                            className="confirm-button" 
                            onClick={handleConfirmClick}
                        >
                            Accept {selectedChallenge[0]}
                        </button>
                    )}
                </div>

            </div>
        </div>
        </div>
    </div>       
        
    );
}
