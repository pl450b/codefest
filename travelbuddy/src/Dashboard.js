import Challenge from './Challenge'
import './Dashboard.css'

export default function Dashboard() {

    return (

        <div class="dashboard-container">
            <Challenge challengeInfo={["Test Challenge", "$100", "A test challenge!"]}/>
        </div>

    );


}