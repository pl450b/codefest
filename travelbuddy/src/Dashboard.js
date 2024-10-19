import Challenge from './Challenge';
import './Dashboard.css';
import Navbar from './Navbar';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="challenges-container">
                <Challenge challengeInfo={["Test Challenge", "$100", "A test challenge!"]}/>
            </div>
        </div>
    );
}