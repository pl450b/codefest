import Challenge from './Challenge';
import './Dashboard.css';
import Navbar from './Navbar';

export default function Dashboard() {


    return (
        <div className="dashboard-container">
            <Navbar />
            <div class="challenges-header-and-container">
                <h1 className="challenges-header">
                Available Quests
                </h1>
                <div className="challenges-container">
                    <Challenge challengeInfo={["Daybreak Expedition", "+75 Travel Points", "Book a small group day trip through the hotel to explore a nearby destination"]}/>
                    <Challenge challengeInfo={["Tavern Ties", "+50 Travel Points", "Join a local pup crawl or happy hour to connect with local townsfolk and fellow adventurers"]}/>
                    <Challenge challengeInfo={["Tavern Ties", "+50 Travel Points", "Join a local pup crawl or happy hour to connect with local townsfolk and fellow adventurers"]}/>

                </div>
            </div>
        </div>
    );
}