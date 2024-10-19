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

  
  const token = localStorage.getItem('sessionToken')

  return (

    <Router>
      <Routes>
          <Route path="/" element={token ? <Dashboard /> : <SignUp />} />
          <Route path="/login" element={<Login />} />
<<<<<<< HEAD
          <Route path="/survey" element={<PersonalizationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rewards" element={<Rewards />} />
=======
          <Route path="/survey" element={token ? <PersonalizationForm /> : <SignUp />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <SignUp />} />
          <Route path="/profile" element={token ? <Profile /> : <SignUp />} />
>>>>>>> 06d0ad379cffa1e786821cae07fcdcd43df1fb6b
      </Routes>
    </Router>
  );
}

export default App;
