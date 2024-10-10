import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/Assets/LoginSignUpForm/LoginSignUpForm';
import HomePage from './Components/Assets/HomePage/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router> 
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm/>} />
          <Route path="/homepage" element={<HomePage/>} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;

