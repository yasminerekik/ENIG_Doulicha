import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ firstname: '', lastname: '' });

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const token = localStorage.getItem('authToken');
    const userFromStorage = localStorage.getItem('user');

    if (token && userFromStorage) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userFromStorage)); // Charger les infos utilisateur depuis le localStorage
    }
  }, []);

  const navigateToSignIn = () => {
    navigate('/signin');
  };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getInitials = (firstname: string, lastname: string) => {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : '';
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser({ firstname: '', lastname: '' });

    // Rediriger vers la même page après la déconnexion
    navigate(0);  // Cela recharge la page actuelle
  };

  return (
    <div>
      <nav className="bg-gray-800 fixed w-full top-0 z-10">
        <div className="max-w-full px-2 sm:px-4 lg:px-6">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4 ml-2">
              <span className="text-white text-2xl font-bold tracking-wide shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-3 py-1 rounded-lg">
                Doulicha
              </span>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* Afficher les liens seulement si l'utilisateur n'est pas connecté */}
                  {!isLoggedIn && (
                    <>
                      <a
                        href="#welcome"
                        onClick={() => scrollToSection('welcome')}
                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white custom-bold"
                        aria-current="page"
                      >
                        Welcome
                      </a>
                      <a
                        href="#about-us"
                        onClick={() => scrollToSection('about-us')}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white custom-bold"
                      >
                        About Us
                      </a>
                      <a
                        href="#contact"
                        onClick={() => scrollToSection('contact')}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white custom-bold"
                      >
                        Contact
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="button-container flex space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    className="sign-in-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={navigateToSignIn}
                  >
                    Sign In
                  </button>
                  <button
                    className="sign-up-button bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={navigateToSignUp}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="relative ml-3 flex items-center space-x-4">
                  <div>
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <span className="inline-block h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                        {getInitials(user.firstname, user.lastname)}
                      </span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg">
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 custom-bold"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
      {!isLoggedIn && (
        <>
         <section
      id="welcome"
      className="h-screen flex flex-col items-center justify-center bg-blue-200 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fond.jpg')" }}
    >
      <div className="text-center text-white p-4">
        <h1 className="display-4 custom-bold">
          {"WELCOME TO DOULICHA".split('').map((letter, index) => (
            <span key={index} className="letter">
              {letter === ' ' ? '\u00A0' : letter} {/* Ceci permet de garder l'espace */}
            </span>
          ))}
        </h1>
        <p className="lead custom-bold">
          {"Your destination for unforgettable experiences!".split('').map((letter, index) => (
            <span key={index} className="letter1">
              {letter === ' ' ? '\u00A0' : letter} {/* Ceci permet de garder l'espace */}
            </span>
          ))}
        </p>
      </div>
    </section>

    <section id="about-us" className="py-16 bg-yellow-200">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-5xl font-bold text-gray-800 mb-6 custom-bold">About Our Leisure Location Management</h1>
    <p className="text-lg text-gray-700 mb-12 custom-bold">Our platform helps you efficiently manage leisure spaces, making it easier to track, organize, and optimize your location-based resources.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Mission Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v22M1 12h22" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 custom-bold">Our Mission</h2>
        <p className="text-gray-600 custom-bold">To provide an easy-to-use platform that empowers leisure location managers to streamline their operations and focus on delivering great experiences.</p>
      </div>

      {/* Key Features Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 custom-bold">Key Features</h2>
        <ul className="text-gray-600 space-y-2 custom-bold">
          <li>- Quick creation of leisure location profiles</li>
          <li>- Automated notifications for space availability</li>
          <li>- Real-time tracking of reservations</li>
          <li>- Detailed reports and analytics</li>
        </ul>
      </div>

      {/* Benefits Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4 ">
          <svg className="w-16 h-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 custom-bold">Benefits</h2>
        <ul className="text-gray-600 space-y-2 custom-bold">
          <li>- Time-saving management tools</li>
          <li>- Improved customer satisfaction</li>
          <li>- Reduced human errors</li>
          <li>- Better visibility of your locations and schedules</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="contact" className="h-screen bg-pink-100 flex flex-col items-center justify-center">
  <h1 className="text-5xl font-bold text-brown-800">
    <span className="text-brown-600 custom-bold">Dou</span>licha
  </h1>
  <p className="text-center text-brown-700 text-lg mt-2 custom-bold">
  Doulicha is your complete solution to discover the best leisure space.
  </p>
  <div className="flex space-x-4 mt-4 custom-bold">
    <a href="#" className="text-brown-500 text-2xl hover:text-brown-700">
      <i className="fab fa-facebook"></i>
    </a>
    <a href="#" className="text-brown-500 text-2xl hover:text-brown-700">
      <i className="fab fa-instagram"></i>
    </a>
  </div>
  <p className="text-brown-600 text-sm mt-6 custom-bold">
    Designed By <a href="#" className="text-brown-800 underline">Rahma & Yasmine</a>
  </p>
</section>
        </>
      )}
    </div>
  );
};

export default Navbar;
