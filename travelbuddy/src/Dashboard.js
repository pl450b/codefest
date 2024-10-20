import { useState, useEffect } from 'react';
import Challenge from './Challenge';
import './Dashboard.css';
import Navbar from './Navbar';
import { QRCodeCanvas } from 'qrcode.react';


export default function Dashboard() {
    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url = `http://${ipAddress}:${port}`; 
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [centeredChallenge, setCenteredChallenge] = useState(null);
    const [confirmButtonClicked, setConfirmButtonClicked] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [selectedChallengeUrl, setSelectedChallengeUrl] = useState('');
    const [challengesList, setChallengesList] = useState(null);

    useEffect(() => {
        // Fetch active challenge from the backend
        fetch(`https://${url}/get-challenges`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Token': `${localStorage.getItem('sessionToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.length === 1){
                setCenteredChallenge(data[0]);
                setConfirmButtonClicked(true);
            }
            else{
                setChallengesList(data);
            }
        })
        .catch(error => {
            console.error('Error fetching challenges:', error);
        });


    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        console.log("Your IP address is: ", data.ip);
    })
    .catch(error => {
        console.error('Error fetching IP address:', error);
    });
    });

    const generateChallengeUrl = (challengeName) => {
        // Replace this with your backend endpoint
        const baseUrl = `${url}/challenge`;
        return `${baseUrl}?name=${encodeURIComponent(challengeName)}`;
    };

    const handleChallengeClick = (event, challenge) => {
        setSelectedChallenge(challenge);
        setShowConfirmButton(true);
    };

    const handleConfirmClick = async () => {
        setCenteredChallenge(selectedChallenge);
        const url = generateChallengeUrl(selectedChallenge[0]);
        setSelectedChallengeUrl(url);
        setShowQRCode(true);
        setShowConfirmButton(false);
        setConfirmButtonClicked(true);


    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url2 = `http://${ipAddress}:${port}/confirmchallenge`;   

    const response = await fetch(`${url2}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            sessionToken: localStorage.getItem('sessionToken'), 
            selectedChallenge 
        }),
    });

        const data = await response.json();

        console.log(data)
    };

    const handleCompleteClick = () => {
        setConfirmButtonClicked(false);
        setCenteredChallenge(null);
    }

    return (
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
                            <div class="challenge-qr-container">
                                <Challenge challengeInfo={centeredChallenge} centered />
                                <div className="qr-code-container">
                                    <QRCodeCanvas class="qr-code" value={selectedChallengeUrl} /> {/* Updated Component */}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div onClick={(e) => handleChallengeClick(e, ["Daybreak Expedition", "+75 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"])}>
                                    <Challenge challengeInfo={["Daybreak Expedition", "+300 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"]}/>
                                </div>
                                <div onClick={(e) => handleChallengeClick(e, ["Tavern Ties", "+50 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"])}>
                                    <Challenge challengeInfo={["Tavern Ties", "+500 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"]}/>
                                </div>
                                <div onClick={(e) => handleChallengeClick(e, ["Tavern Ties", "+50 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"])}>
                                    <Challenge challengeInfo={["Swift Sights", "+450 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"]}/>
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

                    {confirmButtonClicked && showQRCode && (
                            <button class="complete-button" onClick={handleCompleteClick}>
                                Complete {selectedChallenge[0]}
                            </button>                        
                    )}
                </div>

            </div>
        </div>
    );
}
