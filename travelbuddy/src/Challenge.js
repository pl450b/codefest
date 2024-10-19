import './Challenge.css'

export default function Challenge( {challengeInfo} ) {

    const challengeName = challengeInfo[0];
    const challengeReward = challengeInfo[1];
    const challengeDesc = challengeInfo[2];

    return(
        <div class="challenge-container">
            <div class="challenge-name-container">
                <h1> {challengeName} </h1>
                <div class="challenge-name-line"></div>
            </div>

            <div class="challenge-description-container">
                <h1> Description </h1>
                <div class="challenge-name-line"></div>
                <p> {challengeDesc} </p>
            </div>

            <div class="challenge-reward-container">
                <h1> Reward </h1>
                <div class="challenge-reward-line"></div>
                <p> {challengeReward} </p>
            </div>

            
        </div>
    );


}