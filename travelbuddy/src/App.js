import SignUp from './SignUp';
import Login from './Login';
import PersonalizationForm from './PersonalizationForm'
import Dashboard from './Dashboard'
import Profile from './Profile'
import Rewards from './Rewards'
import './App.css';
import './SignUp.css';
import './Login.css';
import './PersonalizationForm.css';
import './Rewards.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (

    <Router>
      <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/survey" element={<PersonalizationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </Router>
  );
}

export default App;
