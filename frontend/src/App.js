import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './components/Homepage/HomePage';
import Register from './components/Homepage/Register';
import VerifyEmail from './components/Homepage/VerifyEmail';
import Login from './components/Homepage/Login';
import PlayerManagement from './components/PlayerManagement/PlayerManagement';
import StatsDashboard from './components/Stats/StatsDashboard';
import MedicalCenter from './components/MedicalCenter/MedicalCenter';
import Games from './components/GamesManagement/GamesManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the backend to check authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
          method: 'GET',
          credentials: 'include',  // Include cookies in the request
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);  // Update state based on response
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);  // Indicate that the auth check is complete
      }
    };

    checkAuthStatus();
  }, []);

  // Show a loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/players"
            element={isAuthenticated ? <PlayerManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/stats"
            element={isAuthenticated ? <StatsDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path='/medical-center'
            element={isAuthenticated ? <MedicalCenter /> : <Navigate to="/login" />}
          />
          <Route
            path='/games'
            element={isAuthenticated ? <Games /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
