import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Sheets from './components/Sheets';
import NavBar from './components/NavBar';
import ProtectedRoute from '../src/services/ProtectedRoutes';
import api from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getCurrentUser();
        if (res.data?.handle) {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user after refresh:", err);
      }
    };
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchUser();
    }
  }, [user]);

  return (
    <Router>
      <MainLayout user={user} setUser={setUser} />
    </Router>
  );
}

const MainLayout = ({ user, setUser }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-blue-50">
      {showNav && <NavBar user={user} setUser={setUser} />}
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home user={user} />
            </ProtectedRoute>
          } />
          <Route path="/sheets" element={
            <ProtectedRoute>
              <Sheets user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;
