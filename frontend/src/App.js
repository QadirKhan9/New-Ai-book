import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import ProfilePage from './pages/Profile';
import DashboardPage from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h1>Welcome to the User Authentication System</h1>
      <p>This application demonstrates user authentication with profile collection.</p>
      <p>Features include:</p>
      <ul>
        <li>User registration with profile data</li>
        <li>Secure authentication</li>
        <li>Profile management</li>
        <li>Personalized content</li>
      </ul>
    </div>
  );
}

export default App;