import SignUp from './SignUp';
import Login from './Login';
import PersonalizationForm from './PersonalizationForm'
import Dashboard from './Dashboard'
import Profile from './Profile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  const token = localStorage.getItem('sessionToken')

  return (

    <Router>
      <Routes>
          <Route path="/" element={token ? <Dashboard /> : <SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/personalize" element={token ? <PersonalizationForm /> : <SignUp />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <SignUp />} />
          <Route path="/profile" element={token ? <Profile /> : <SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
