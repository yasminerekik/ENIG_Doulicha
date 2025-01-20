import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { CitiesGrid } from './CitiesGrid';
import { CitiesHeader } from './CitiesHeader';

const Cities = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking the auth token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to sign-in page if the user is not logged in
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <CitiesHeader />

        {/* Cities Grid */}
        <CitiesGrid />
      </div>
    </div>
  );
}

export default Cities;
