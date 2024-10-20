import { useState, useEffect } from 'react';
import ChallengeCard from './Challenge';
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
    const [completedChallenges, setCompletedChallenges] = useState([]); // Track completed challenges
    const [location, setLocation] = useState({ latitude: null, longitude: null }); // Store user location
    const [city, setCity] = useState(""); // Store city name

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
            // Process fetched challenges
        })
        .catch(error => {
            console.error('Error fetching challenges:', error);
        });
    }, []);

    const generateChallengeUrl = (challengeName) => {
        const baseUrl = `${url}/challenge`;
        return `${baseUrl}?name=${encodeURIComponent(challengeName)}`;
    };

    const handleChallengeClick = (event, challenge) => {
        // Prevent interaction with completed challenges
        if (completedChallenges.includes(challenge[0])) return;
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
        console.log(data);
    };

    const handleCompleteClick = () => {
        setConfirmButtonClicked(false);
        setCenteredChallenge(null);

        // Mark the challenge as completed
        setCompletedChallenges((prev) => [...prev, selectedChallenge[0]]);
    };

    // Function to get and update geolocation
    const updateLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    fetchCityName(latitude, longitude); // Fetch city name based on coordinates
                },
                (error) => {
                    console.error("Error fetching geolocation:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    // Function to fetch city name using OpenCage API
    const fetchCityName = async (latitude, longitude) => {
        const apiKey = '2ca5b650cfb4484aa6ac5e6100b9dcee'; // Replace with your OpenCage API key
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || "Unknown Location";
            setCity(city);
        } catch (error) {
            console.error("Error fetching city name:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="challenges-header-and-container">
                {confirmButtonClicked ? (<h1 className="challenges-header">
                    Selected Quest
                </h1>) : (<h1 className="challenges-header">
                    Available Quests
                </h1>)}
                <div className="challenge-with-confirm-button">
                    <div className="challenges-container">
                        {centeredChallenge ? (
                            <div className="challenge-qr-container">
                                <ChallengeCard 
                                    challengeInfo={centeredChallenge} 
                                    className={completedChallenges.includes(centeredChallenge[0]) ? 'completed' : ''} 
                                />
                                <div className="qr-code-container">
                                    <QRCodeCanvas className="qr-code" value={selectedChallengeUrl} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div
                                    onClick={(e) => handleChallengeClick(e, ["Daybreak Expedition", "+300 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"])}
                                >
                                    <ChallengeCard 
                                        challengeInfo={["Daybreak Expedition", "+300 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"]}
                                        className={completedChallenges.includes("Daybreak Expedition") ? 'completed' : ''}
                                    />
                                </div>
                                <div
                                    onClick={(e) => handleChallengeClick(e, ["Tavern Ties", "+500 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"])}
                                >
                                    <ChallengeCard 
                                        challengeInfo={["Tavern Ties", "+500 Travel Points", "Join a local pub crawl or happy hour to connect with local townsfolk and fellow adventurers"]}
                                        className={completedChallenges.includes("Tavern Ties") ? 'completed' : ''}
                                    />
                                </div>
                                <div
                                    onClick={(e) => handleChallengeClick(e, ["Swift Sights", "+450 Travel Points", "Join a local biking tour and explore the area"])}
                                >
                                    <ChallengeCard 
                                        challengeInfo={["Swift Sights", "+450 Travel Points", "Join a local biking tour and explore the area"]}
                                        className={completedChallenges.includes("Swift Sights") ? 'completed' : ''}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    {/* Show the confirm button if a challenge is selected */}
                    {showConfirmButton && !completedChallenges.includes(selectedChallenge[0]) && (
                        <button 
                            className="confirm-button" 
                            onClick={handleConfirmClick}
                        >
                            Accept {selectedChallenge[0]}
                        </button>
                    )}

                    {confirmButtonClicked && showQRCode && (
                        <button className="complete-button" onClick={handleCompleteClick}>
                            Complete {selectedChallenge[0]}
                        </button>                        
                    )}
                </div>
            </div>

            {/* Container for the location button and info */}
            <div className="location-container">
                <button className="location-button" onClick={updateLocation}></button>
                {city && <p className="location-info">Current Location: {city}</p>}
            </div>
        </div>
    );
}
