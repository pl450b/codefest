import SignUp from './SignUp';
import Login from './Login';
import PersonalizationForm from './PersonalizationForm'
import './App.css';
import './SignUp.css';
import './Login.css';
import './PersonalizationForm.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (

    <Router>
      <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/survey" element={<PersonalizationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
