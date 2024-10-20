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
    const [completedChallenges, setCompletedChallenges] = useState([]); // Track completed challenges
    const [location, setLocation] = useState({ latitude: null, longitude: null }); // Store user location
    const [city, setCity] = useState(""); // Store city name
    const [challengesList, setChallengesList] = useState(null);

    useEffect(() => {
        // Fetch active challenge from the backend
        fetch(`${url}/get-challenges`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'sessionToken': `${localStorage.getItem('sessionToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.challenges.length === 1) {

                    let arr = data.challenges[0]
                    // let placeholder = data.challenges[0][1]

                    // arr[1] = arr[2]
                    // arr[2] = placeholder

                    console.log(data.challenges[0][0])
                    setCenteredChallenge(arr);
                    setConfirmButtonClicked(true);
                    setSelectedChallenge(arr)
                    setShowQRCode(true)
                }
                else {
                    setChallengesList(data.challenges);
                    
                    console.log("challenges")
                    console.log(challengesList)
                }
            })
            .catch(error => {
                console.error('Error fetching challenges:', error);
            });
    }, []);

    useEffect(() => {
        if (challengesList) {
            console.log("Updated challengesList:", challengesList);
        }
    }, [challengesList]);

    const generateChallengeUrl = async (challengeName) => {
        try {
            const response = await fetch(`${url}/get_user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionToken': `${localStorage.getItem('sessionToken')}`
                },
            });
            const data = await response.json();

            // Generate URL for completing the challenge with user-specific info
            return `http://${ipAddress}:${port}/complete-challenge?user=${data.username}&challenge=${encodeURIComponent(challengeName)}`;
        } catch (error) {
            console.error('Error getting username:', error);
            return null; // Return null or handle error as needed
        }
    };


    const handleChallengeClick = (event, challenge) => {
        setSelectedChallenge(challenge);
        setShowConfirmButton(true);
    };

    const handleConfirmClick = async () => {
        setCenteredChallenge(selectedChallenge);
        console.log("generating challenge url")
        const url = await generateChallengeUrl(selectedChallenge[0]);
        console.log("URL: " + url)
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

    const handleCompleteClick = async () => {
        setConfirmButtonClicked(false);
        setCenteredChallenge(null);
        setCompletedChallenges((prev) => [...prev, selectedChallenge[0]]);

        const ipAddress = '172.31.104.7';
        const port = '5000';
        
        await fetch(`'http://${url}/completechallenge'`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionToken: localStorage.getItem('sessionToken'),
            }),
        });

        await fetch(`${url}/get-challenges`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'sessionToken': `${localStorage.getItem('sessionToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.challenges.length === 1) {
                    console.log(data.challenges);
                    setCenteredChallenge(data.challenges[0]);
                    setConfirmButtonClicked(true);
                    setShowQRCode(true);
                }
                else {
                    setChallengesList(data.challenges);
                }
            })
            .catch(error => {
                console.error('Error fetching challenges:', error);
            });
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
                <div class="challenge-with-confirm-button">

                <div className="challenges-container">
                    {centeredChallenge ? (
                        <div class="challenge-qr-container">
                            <Challenge challengeInfo={selectedChallenge} centered />
                        <div className="qr-code-container">
                        <QRCodeCanvas class="qr-code" value={selectedChallengeUrl} />
                </div>
            </div>
            ) : (
            // Only render challenges if challengesList is not null and has elements
            challengesList && challengesList.length > 0 && (
                    <>
                        {challengesList[0] && (
                            <div onClick={(e) => handleChallengeClick(e, challengesList[0])}>
                                <Challenge challengeInfo={challengesList[0]} />
                            </div>
                        )}
                        {challengesList[1] && (
                            <div onClick={(e) => handleChallengeClick(e, challengesList[1])}>
                                <Challenge challengeInfo={challengesList[1]} />
                            </div>
                        )}
                        {challengesList[2] && (
                            <div onClick={(e) => handleChallengeClick(e, challengesList[2])}>
                                <Challenge challengeInfo={challengesList[2]} />
                            </div>
                        )}
                    </>
                )
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

            {/* Container for the location button and info */}
            <div className="location-container">
                <button className="location-button" onClick={updateLocation}></button>
                {city && <p className="location-info">Current Location: {city}</p>}
            </div>
        </div>
    );
}
