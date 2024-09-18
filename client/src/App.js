import React, { useState } from 'react';
import './App.css';
import Navbar from './Components/header/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Signup } from './Components/pages/Signup';
import { Login } from './Components/pages/Login';
import { Dashboard } from './Components/pages/Dashboard';
import { Home } from './Components/pages/Home';
import NotFound from './Components/pages/NotFound';
import CompleteSignup from './Components/pages/CompleteSignup';
import VerificationFailed from './Components/pages/VerificationFailed';
import Verificationsuccess from './Components/pages/Verificationsuccess';

function App() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [userdata, setUserdata] = useState(null);

  return (
    <Router>
<Navbar 
  selectedCurrency={selectedCurrency} 
  setSelectedCurrency={setSelectedCurrency} 
  userdata={userdata} 
  setUserdata={setUserdata} 
/>

      <Routes>
        <Route path='/' element={<Home selectedCurrency={selectedCurrency} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login setUserdata={setUserdata} />} />
        <Route path='/complete-signup' element={<CompleteSignup />} />
        <Route path='/dashboard' element={<Dashboard setUserdata={setUserdata} />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/verification-failed' element={<VerificationFailed />} />
        <Route path='/verification-success' element={<Verificationsuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
