import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../components/Navbar.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking the auth token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to sign-in page if the user is not logged in
      navigate('/');
    }
  }, [navigate]);

  const handleClick = () => {
    // Navigate to the /cities page when the section is clicked
    navigate('/cities');
  };

  return (
    <div>
      <Navbar />
      <section 
        onClick={handleClick}  // Call handleClick for navigation
        style={{
          backgroundImage: "url('/images/home.png')",
          height: '900px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <p 
          style={{
            position: 'absolute',
            zIndex: 1,
            height: '400px',  // Exemple de hauteur
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
          className='custom-bold'
        >
          Tap here to explore breathtaking locations.
        </p>
      </section>
    </div>
  );
};

export default Home;
