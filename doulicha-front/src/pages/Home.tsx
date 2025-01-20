import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../components/Navbar.css';
import { AnimatedText } from './AnimatedText';

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
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
         {/* Content */}
         <div className="relative z-10">
          <AnimatedText />
        </div>
      </section>
    </div>
  );
};

export default Home;
