import SignUp from './SignUp';
import Login from './Login';
import './App.css';
import './SignUp.css'
import './Login.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (

    <Router>
      <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
