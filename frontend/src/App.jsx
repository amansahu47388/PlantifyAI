import React from 'react';
import Home from '../src/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Dashboard from './components/Dashboard';





function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/about' element={<About />} />
       
      </Routes>
    </Router>
  )
}

export default App
