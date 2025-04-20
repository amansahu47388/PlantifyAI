import React from 'react';
import Home from '../src/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';

import About from './pages/About';
// import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* <Route path='/profile' element={<Profile />} /> */}
       
       
        <Route path='/About' element={<About />} />

      </Routes>
    </Router>
  )
}

export default App
