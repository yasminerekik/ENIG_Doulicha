import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ firstname: '', lastname: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state to control the dropdown menu
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null); // Notification sélectionnée pour le commentaire
  const [comment, setComment] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null); // Define the user role state
  const [filter, setFilter] = useState('all'); // 'all', 'done', or 'not yet'
  const [dest, setDest] = useState<any>(null); // Assure-toi que dest contient l'information de la destination


  interface Reservation {
    fullname: string;
    email: string;
    phone: string;
    startDate: Date;
    endDate: Date;
    numberOfPersons: number;
    destinationName: string;
    destinationId: string;
  }

  type Notification = {
    message: string;
    type: string;
    ownerId: string; // Assuming this is a string
    createdAt: Date;
    reservationId?: string; // Treat reservationId as a string in the frontend
    etat: 'not yet' | 'done'; // Ajout de l'état de la notification
  };
  
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem('authToken');
      const userFromStorage = localStorage.getItem('user');
  
      if (token && userFromStorage) {
        setIsLoggedIn(true);
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser); 
        setUserRole(parsedUser.role || null); 
      }
    };

    fetchUser();
  }, []); // Exécute une seule fois au chargement du composant

  const fetchNotifications = async () => {
    const token = localStorage.getItem('authToken');
    const userFromStorage = localStorage.getItem('user');

    if (token && userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      const ownerId = parsedUser._id;

      if (ownerId) {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        try {
          const response = await fetch(`${apiUrl}notifications/${ownerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            console.log('Notifications:', data); // Stocker les notifications dans l'état
          } else {
            console.error('Failed to fetch notifications:', response.status);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      } else {
        console.error('OwnerId is undefined');
      }
    } else {
      console.error('Token or user is missing');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications(); // Fetch notifications only when opening
    }
    setSelectedNotification(null);
  };
  // Fonction pour sélectionner une notification
const selectNotification = (notification: any) => {
  if (notification.message && notification.message.startsWith("New reservation")) {
  setSelectedNotification(notification);}
};

// Fonction pour récupérer les détails de la réservation
const fetchReservationDetails = async (reservationId: string) => {
  const token = localStorage.getItem('authToken');
    
  if (!token) {
    console.error('No access token available');
    return;
  }

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  try {
    const response = await fetch(`${apiUrl}reservations/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const reservationData = await response.json();
      setSelectedReservation(reservationData); // Mémoriser les détails de la réservation
      return reservationData; // Afficher la modale avec les détails de la réservation
    } else {
      console.error('Failed to fetch reservation details');
    }
  } catch (error) {
    console.error('Error fetching reservation details:', error);
  }
};

const handleNotificationClick = async (notification: any) => {
  selectNotification(notification);
  
  // Vérifier si le message de la notification commence par "New reservation"
  if (notification.message && notification.message.startsWith("New reservation")) {
    // Si la notification possède un reservationId, récupérer les détails
    const reservationData = await fetchReservationDetails(notification.reservationId);

    // Si la réservation contient un destinationId, appeler handleFetchDestination
    if (reservationData && reservationData.destinationId) {
      handleFetchDestination(reservationData.destinationId);
    }
  }
};

const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setComment(e.target.value);
};



  const handleSubmitComment = async () => {
    if (comment.trim() === '') return;
  
    // Ensure selectedNotification is not null before accessing its properties
    if (!selectedNotification) {
      console.error('No notification selected');
      return;
    }

    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No access token available');
      return;
    }
 
    const apiUrl = import.meta.env.VITE_APP_API_URL;
  
    // Call the backend API to send the comment and create a new notification for the reservation creator
    try {
      const response = await fetch(`${apiUrl}notifications/comment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          reservationId: selectedNotification.reservationId || '', // Ensure reservationId is a string if it exists
        }),
      });
  
      if (response.ok) {
        // Clear the comment input and close the comment box
        setComment('');
        setSelectedNotification(null);
        window.location.reload();

      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  
  

  const closeCommentBox = () => {
    setSelectedNotification(null);
    setComment(''); // Clear comment input when closing
  };

  
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
    navigate(0);  // Reload the current page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else if (filter === 'done' || filter === 'not yet') {
      setFilteredNotifications(
        notifications.filter((n) => 
          n.message.startsWith("New reservation") && n.etat === filter
        )
      );
    }
  }, [filter, notifications]);
  

  const handleCheckNotification = async (notificationId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token available');
      return;
    }

    const apiUrl = import.meta.env.VITE_APP_API_URL;

    try {
      const response = await fetch(`${apiUrl}notifications/${notificationId}/done`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the local state to reflect the change
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n._id === notificationId ? { ...n, etat: 'done' } : n,
          ),
        );
      } else {
        console.error('Failed to mark notification as done');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };
  const fetchDestinationCreator = async (destinationId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No access token available');
      return null; // Retourner null si aucun token n'est trouvé
    }
  
    const apiUrl = import.meta.env.VITE_APP_API_URL;
  
    try {
      const response = await fetch(`${apiUrl}dests/${destinationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const destinationData = await response.json();
        return destinationData.createdBy; // Retourner uniquement createdBy
      } else {
        console.error('Failed to fetch destination data');
        return null; // Retourner null si la requête échoue
      }
    } catch (error) {
      console.error('Error fetching destination data:', error);
      return null; // Retourner null en cas d'erreur
    }
  };
  const handleFetchDestination = async (destinationId: string) => {
    const creator = await fetchDestinationCreator(destinationId);
    if (creator) {
      setDest({ createdBy: creator._id });
      console.log('createdBy', creator._id);
    }
  };
  const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)._id : null;
  console.log('userId:', userId);
   

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
  <button
    aria-expanded={showNotifications}
    aria-haspopup="true"
    onClick={toggleNotifications}
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
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  </button>
  
  {/* Notifications dropdown */}
  {showNotifications && notifications.length > 0 && (
    <div className="absolute right-0 top-10 w-64 bg-white rounded-lg shadow-lg z-10">
      {/* Filtrage uniquement pour l'owner */}
      {userRole === 'owner' && (
        <div className="flex justify-around p-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-primary ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
    <button
      onClick={() => {
        setFilter('done');
      }}
      className={`btn btn-success ${filter === 'done' ? 'active' : ''}`}
    >
      Done
    </button>
    <button
      onClick={() => {
        setFilter('not yet');
      }}
      className={`btn btn-warning ${filter === 'not yet' ? 'active' : ''}`}
    >
      Not Yet
    </button>

        </div>
      )}

      {/* Liste des notifications */}
      <ul className="py-2 max-h-48 overflow-y-auto">
        {filteredNotifications.map((notification) => (
          <li
            className={`px-4 py-2 text-sm text-gray-700 border-b last:border-none ${
              notification.message.startsWith("New reservation") ? "bg-blue-100" : ""
            }`}
            key={notification._id}
          >
            <div>
              <p onClick={() => {
                   handleNotificationClick(notification)}}>{notification.message}</p>
              {/* Show "View details" only for the owner */}
          {dest?.createdBy === userId && notification.message.startsWith("New reservation") && (
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchReservationDetails(notification.reservationId);
              toggleModal(); // Récupérer les détails de la réservation au clic
            }}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View details
          </button>
        )}
            </div>
            {/* Show check button only for 'not yet' notifications and owner */}
      {notification.etat === 'not yet' && dest?.createdBy === userId && notification.message.startsWith("New reservation") && (

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the parent li
            handleCheckNotification(notification._id);
            setSelectedNotification(null); // Reset selected notification to close the comment box
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500 hover:text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Fenêtre modale pour les détails de la réservation */}
  {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-700">Reservation Details</h2>
            <p><strong>Fullname:</strong> {selectedReservation.fullname}</p>
            <p><strong>Email:</strong> {selectedReservation.email}</p>
            <p><strong>Phone:</strong> {selectedReservation.phone}</p>
            <p><strong>Start Date:</strong> {new Date(selectedReservation.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedReservation.endDate).toLocaleDateString()}</p>
            <p><strong>Number of Persons:</strong> {selectedReservation.numberOfPersons}</p>
            <button
              onClick={toggleModal}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              Close
            </button>
          </div>
          </div>
      )}
     

  {/* Comment box */}
  {dest?.createdBy === userId && selectedNotification && (
    <div className="absolute right-0 top-48 w-64 bg-white rounded-lg shadow-lg z-10 p-4 mt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-gray-700">Add comment</h4>
        <button
          onClick={closeCommentBox}
          className="text-gray-500 hover:text-gray-700"
        >
          &#x2715;
        </button>
      </div>
      <textarea
        className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Votre commentaire"
        value={comment}
        onChange={handleCommentChange}
      ></textarea>
      <button
        onClick={handleSubmitComment}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
      >
        Submit
      </button>
    </div>
  )}


                  <div className="relative">
                    <button
                      type="button"
                      className="flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      id="user-menu-button"
                      aria-expanded={isMenuOpen}
                      aria-haspopup="true"
                      onClick={toggleMenu} // Toggle the dropdown menu on click
                    >
                      <span className="sr-only">Open user menu</span>
                      <span className="inline-block h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                        {getInitials(user.firstname, user.lastname)}
                      </span>
                    </button>
                    {isMenuOpen && (
                      <div
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                      >
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 custom-bold"
                        >
                          Logout
                        </button>
                      </div>
                    )}
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
