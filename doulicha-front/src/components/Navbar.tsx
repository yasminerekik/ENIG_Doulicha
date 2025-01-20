import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Logo1 } from './Logo1';
import { ArrowRight, Bell, Calendar, Check, ChevronDown, LogOut, Mail, Phone, TrashIcon, UserCircle, Users, X } from 'lucide-react';

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
  
  const handleDeleteNotification = async (id: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No access token available');
      return null; // Retourner null si aucun token n'est trouvé
    }
  
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    try {
      const response = await fetch(`${apiUrl}notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Ajoutez l'authentification si nécessaire
        },
      });
  
      if (response.ok) {
        // Notification supprimée avec succès, mettre à jour l'interface utilisateur si nécessaire
        console.log('Notification deleted');
        window.location.reload();
        // Logique pour mettre à jour la liste des notifications
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <nav className="bg-gray-800 fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
              <Logo1 />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {!isLoggedIn && (
                    <>
                      <a
                        href="#welcome"
                        onClick={() => scrollToSection('welcome')}
                         className="text-gray-100 hover:text-purple-600 font-medium transition-colors"
                        aria-current="page"
                      >
                        Welcome
                      </a>
                      <a
                        href="#about-us"
                        onClick={() => scrollToSection('about-us')}
                        className="text-gray-100 hover:text-purple-600 font-medium transition-colors"                      >
                        About Us
                      </a>
                      <a
                        href="#contact"
                        onClick={() => scrollToSection('contact')}
                        className="text-gray-100 hover:text-purple-600 font-medium transition-colors"
                        >
                        Contact
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <div className="flex space-x-3">
                  <button
className="px-4 py-2 text-gray-100 font-medium hover:text-purple-700 transition-colors"                    
onClick={navigateToSignIn}
                  >
                    Sign In
                  </button>
                  <button
className="px-4 py-2 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"                    
onClick={navigateToSignUp}
                  >
                    Sign Up
                  </button>
                  </div>
                </>
              ) : (
                <div className="relative ml-3 flex items-center space-x-4">
  <button
    aria-expanded={showNotifications}
    aria-haspopup="true"
    onClick={toggleNotifications}
    type="button"
    className="group relative rounded-full p-2 transition-all duration-300 hover:bg-gray-700"
  >
    <span className="sr-only">View notifications</span>
    <Bell className="h-6 w-6 text-gray-400 transition-colors group-hover:text-white" />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {notifications.length}
          </span>
        )}
  </button>
  
  {/* Notifications dropdown */}
  {showNotifications && notifications.length > 0 && (
    <div className="absolute right-0 top-12 w-96 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
      {/* Filtrage uniquement pour l'owner */}
      {userRole === 'owner' && (
         <div className="flex gap-2 border-b border-gray-100 p-3">
         {['all', 'done', 'not yet'].map((filterType) => (
           <button
             key={filterType}
             onClick={() => setFilter(filterType)}
             className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
               filter === filterType
                 ? 'bg-indigo-500 text-white'
                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
             }`}
           >
             {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
           </button>
         ))}
       </div>
     )}

      {/* Liste des notifications */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredNotifications.map((notification) => (
          <div
            className={`group relative border-b border-gray-100 p-4 transition-all ${
                  notification.message.startsWith('New reservation')
                    ? 'bg-blue-50'
                    : ''
                }`}
            key={notification._id}
          >
            <div className="flex items-start justify-between">
            <div className="flex-1">
              <p onClick={() => {
                   handleNotificationClick(notification)}} className="text-sm text-gray-700">{notification.message}</p>
              {/* Show "View details" only for the owner */}
          {dest?.createdBy === userId && notification.message.startsWith("New reservation") && (
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchReservationDetails(notification.reservationId);
              toggleModal(); // Récupérer les détails de la réservation au clic
            }}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View details →
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
          className="ml-4 rounded-full p-1 text-gray-400 transition-all hover:bg-green-100 hover:text-green-600"
        >
          <Check className="h-5 w-5" />
        </button>
            )}
             {/* Ajouter l'icône de suppression */}
  <button
    onClick={(e) => {
      e.stopPropagation(); // Prevent click from propagating to the parent li
      handleDeleteNotification(notification._id);
    }}
    className="ml-4 rounded-full p-1 text-red-400 transition-all hover:bg-red-100 hover:text-red-600"
  >
    <TrashIcon className="h-5 w-5" /> {/* Assurez-vous d'avoir une icône de suppression, ex: un TrashIcon */}
  </button>
          </div>
          </div>
        ))}
      </div>
    </div>
  )}

{showModal && selectedReservation && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all overflow-hidden">
      {/* En-tête avec effet de gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <h2 className="text-xl font-bold">Reservation Details</h2>
      </div>

      {/* Corps de la modale avec animation */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <UserCircle className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Guest</p>
              <p className="font-medium text-sm">{selectedReservation.fullname}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-sm">{selectedReservation.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <Phone className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-sm">{selectedReservation.phone}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Stay</p>
              <div className="flex items-center gap-2 text-sm">
                <span>{new Date(selectedReservation.startDate).toLocaleDateString()}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>{new Date(selectedReservation.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Guests</p>
              <p className="font-medium text-sm">{selectedReservation.numberOfPersons} persons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de la modale */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-3">
        <button
          onClick={toggleModal}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-4 rounded-lg 
                   hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
     

        {/* Comment Box */}
        {dest?.createdBy === userId && selectedNotification && (
        <div className="absolute right-0 top-48 w-80 rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Add Comment</h4>
            <button
              onClick={closeCommentBox}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-gray-200 p-3 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Write your comment here..."
            value={comment}
            onChange={handleCommentChange}
          />
          <button
            onClick={handleSubmitComment}
            className="mt-3 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Comment
          </button>
        </div>
      )}


                  {/* User Menu */}
      <div className="relative">
        <button
          type="button"
          className="group flex items-center space-x-2 rounded-full bg-gray-800 p-1.5 text-sm transition-all duration-300 hover:bg-gray-700"
          onClick={toggleMenu}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white ring-2 ring-white">
            {getInitials(user.firstname, user.lastname)}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-300 group-hover:text-white" 
            style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right scale-100 transform rounded-lg bg-white py-1 opacity-100 shadow-lg ring-1 ring-black/5 transition-all">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
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

<section id="contact" className="h-screen bg-green-100 flex flex-col items-center justify-center">
  <h1 className="text-5xl font-bold text-brown-800">
    <span className="text-brown-600 custom-bold">Dou</span>licha
  </h1>
  <p className="text-center text-brown-700 text-lg mt-2 custom-bold">
  Doulicha is your complete solution to discover the best leisure space.
  </p>
  <div className="flex space-x-4 mt-4 custom-bold">
    <a href="#" className="text-purple-500 text-2xl hover:text-purple-700">
      <i className="fab fa-facebook"></i>
    </a>
    <a href="#" className="text-purple-500 text-2xl hover:text-purple-700">
      <i className="fab fa-instagram"></i>
    </a>
  </div>
  <p className="text-brown-600 text-sm mt-6 custom-bold">
    Designed By <a href="#" className="underline text-purple-500 hover:text-purple-500">Rahma & Yasmine</a>
  </p>
</section>
        </>
      )}
    </div>
  );
};

export default Navbar;
