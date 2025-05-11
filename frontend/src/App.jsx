import React from 'react';
import Home from '../src/pages/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './components/Dashboard';
import { isAuthenticated } from './utils/auth';

const PrivateRoute = ({ children }) => {
  const auth = isAuthenticated();
  return auth ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<OTPVerification />} />
        <Route path='/' element={<Home />} />
        <Route 
          path='/dashboard' 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/profile' 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
