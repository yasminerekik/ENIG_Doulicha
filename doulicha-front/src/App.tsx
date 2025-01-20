import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cities from './pages/Cities';
import Gabes from './pages/villes/Gabes';
import Sousse from './pages/villes/Sousse';
import Monastir from './pages/villes/Monastir';
import Tunis from './pages/villes/Tunis';
import Sfax from './pages/villes/Sfax';
import Djerba from './pages/villes/Djerba';
import Hammamet from './pages/villes/Hammamet';
import Mahdia from './pages/villes/Mahdia';
import Tabarka from './pages/villes/Tabarka';
import Nabeul from './pages/villes/Nabeul';
import Kairouan from './pages/villes/Kairouan';
import Bizerte from './pages/villes/Bizerte';
import Beja from './pages/villes/Beja';
import Tataouein from './pages/villes/Tataouein';
import Tozeur from './pages/villes/Tozeur';
import Zaghouan from './pages/villes/Zaghouan';


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
      <Route path="/sfax" element={<Sfax />} />
      <Route path="/sousse" element={<Sousse />} />
      <Route path="/djerba" element={<Djerba />} />
      <Route path="/hammamet" element={<Hammamet />} />
      <Route path="/tunis" element={<Tunis />} />
      <Route path="/monastir" element={<Monastir />} />
      <Route path="/mahdia" element={<Mahdia />} />
      <Route path="/beja" element={<Beja />} />
      <Route path="/bizerte" element={<Bizerte />} />
      <Route path="/kairouan" element={<Kairouan />} />
      <Route path="/nabeul" element={<Nabeul />} />
      <Route path="/tabarka" element={<Tabarka />} />
      <Route path="/tataouein" element={<Tataouein />} />
      <Route path="/tozeur" element={<Tozeur />} />
      <Route path="/zaghouan" element={<Zaghouan />} />

  
    </Routes>
  </Router>
  )
}



export default App;
