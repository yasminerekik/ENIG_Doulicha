import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cities from './pages/Cities';
import Gabes from './pages/Gabes';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cities" element={<Cities />} />
      <Route path="/gabes" element={<Gabes />} />
  
    </Routes>
  </Router>
  )
}



export default App;
