import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { FaPlusCircle, FaEdit, FaTrash, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import '../../components/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Calendar, Car, ChevronDown, Clock, Coffee, DumbbellIcon, MapPin, Navigation, PawPrint, PenSquare, Search, Shirt, SlidersHorizontal, Sparkles, Trash2, Tv, Utensils, Waves, Wifi, Wind, X } from 'lucide-react';
import { getFeatureIcon } from '../featureIcons';

const Tataouein = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false); // New state for reservation form
  const [reservationDetails, setReservationDetails] = useState({
    fullname: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    numberOfPersons: 1,
    destinationId: ''  // Add destinationId
  });
  const navigate = useNavigate();
  

  // Get user information and token
  const [userData, setUserData] = useState<{ id: string , role: string } | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
  }
  
  

  useEffect(() => {
    // Check if the user is logged in by checking the auth token and user information
    const authToken = localStorage.getItem('authToken');
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const parsedUser: User = JSON.parse(userFromStorage);  // Utilisation de l'interface User
      console.log('Parsed user:', parsedUser);

      if (parsedUser._id) {
        setUserData({
          id: parsedUser._id,
          role: parsedUser.role
        });
        console.log('User ID:', parsedUser._id);  // Affichage de l'ID de l'utilisateur
      } else {
        console.error('User ID is missing');
      }
    }
  
    if (authToken && userFromStorage) {
      setAccessToken(authToken); // Store the token in the state
      setUserData(JSON.parse(userFromStorage)); // Load the user information
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // If the user is not logged in, redirect to the login page
      navigate('/');
    }
  }, [navigate]);
  
  const handleClick = () => {
    // Navigate to the /gabes page when the section is clicked
    navigate('/tataouein');
  };
  

  const userRole = userData?.role;
  const userId = (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)._id : null);


  const [destination, setDestination] = useState<{
    _id?: string;
    photos: File[];
    existingPhotos: string[];
    name: string;
    description: string;
    address: string;
    createdBy?: { _id: string } | null; // Allow null for initial state
    features: string[];
  }>({
    photos: [],
    existingPhotos: [],
    name: '',
    description: '',
    address: '',
    createdBy: null,
    features: [],
  });

  const [destinations, setDestinations] = useState<{
    _id: string;
    name: string;
    description: string;
    address: string;
    photos: string[];
    createdBy?: { _id: string } | null; // Allow null for initial state
    features?: string[];
  }[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      try {
        const response = await fetch(`${apiUrl}dests/city/tataouein`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setDestinations(data);
        console.log('Fetched destinations:', data);
        
      // Log each destination's createdBy field
      data.forEach((destination: any) => {
        console.log('createdBy:', destination.createdBy);
      });
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [accessToken]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openGallery = (photos: string[]) => {
    setSelectedPhotos(photos);
    setIsGalleryOpen(true);
  };
  const closeGallery = () => setIsGalleryOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDestination({ ...destination, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDestination({ ...destination, photos: files });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = destination._id ? 'PUT' : 'POST';
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const url = destination._id ? `${apiUrl}dests/${destination._id}` : `${apiUrl}dests`;

    const formData = new FormData();
    formData.append('name', destination.name);
    formData.append('description', destination.description);
    formData.append('address', destination.address);
    formData.append('cityName', "tataouein");


    // Append existing photos (strings)
    destination.existingPhotos.forEach(photo => formData.append('existingPhotos', photo));

    // Append new photos (File objects)
    destination.photos.forEach(file => formData.append('photos', file));

    destination.features.forEach(feature => formData.append('features', feature));


    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const newDest = await response.json();
      const updatedDestinations = method === 'PUT'
        ? destinations.map(dest => dest._id === newDest._id ? newDest : dest)
        : [...destinations, newDest];

      setDestinations(updatedDestinations);
      setFilteredDestinations(updatedDestinations);
      closeModal();
      window.location.reload();

    } catch (error) {
      console.error('Error adding or updating destination:', error);
    }
  };

  const handleEdit = (index: number) => {
    const selectedDest = destinations[index];
    setDestination({
      _id: selectedDest._id,
      name: selectedDest.name,
      description: selectedDest.description,
      address: selectedDest.address,
      photos: [],
      existingPhotos: selectedDest.photos,
      features: selectedDest.features || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    const destId = destinations[index]._id;
    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const response = await fetch(`${apiUrl}dests/${destId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete destination');
      }

      const updatedDestinations = destinations.filter((_, i) => i !== index);
      setDestinations(updatedDestinations);
      setFilteredDestinations(updatedDestinations);
      window.location.reload();

    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };

  const getGoogleMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const handleReserve = (index: number) => {
    const selectedDest = destinations[index];
    setReservationDetails({
      ...reservationDetails,
      destinationId: selectedDest._id  // Set the destinationId
    });
    setIsReservationFormOpen(true); // Open the reservation form
  };
  

  const closeReservationForm = () => {
    setIsReservationFormOpen(false);
    setReservationDetails({
      fullname: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
      numberOfPersons: 1,
      destinationId: ''  // Réinitialiser également le destinationId
    });
  };
  const [reservationSuccess, setReservationSuccess] = useState(false);


  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservationDetails({ ...reservationDetails, [name]: value });
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      alert('Token is missing. Please log in again.');
      return;
    }
    
    // Vérifiez que les informations de la réservation sont complètes
    if (!reservationDetails.fullname || !reservationDetails.email || !reservationDetails.phone || !reservationDetails.destinationId) {
      alert('Please fill in all the fields, including selecting a destination.');
      return;
    }
  
    // Envoyer les informations de la réservation au backend
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    try {
      console.log('Access Token:', accessToken); 
      const response = await fetch(`${apiUrl}reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,  // Token d'authentification
        },
        body: JSON.stringify(reservationDetails),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Reservation created successfully:', data);

        setReservationSuccess(true);
        setTimeout(() => {
          setReservationSuccess(false); // Cacher le message de succès après 3 secondes
        }, 1000);  // Set success state to true
        closeReservationForm();   // Fermer le formulaire de réservation
         // Récupérer l'ID de l'owner de la destination (présumé présent dans la réponse)
         const ownerId = data.destination ? data.destination.createdBy : null;

      if (ownerId) {
        await fetch(`${apiUrl}notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: `New reservation for ${reservationDetails.fullname} from ${reservationDetails.startDate} to ${reservationDetails.endDate} for the place : ${data.destination.name} in ${data.destination.cityName}.`,
            ownerId: ownerId,
            type: 'reservation',  // Ajoutez ici le type
          }),
        });
      } 
    } else {
      console.error('Error making reservation:', response);
      setReservationSuccess(false);
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    setReservationSuccess(false);
  }
};
const [currentImageIndex, setCurrentImageIndex] = useState(0);

const nextImage = () => {
  setCurrentImageIndex((prev) => 
    prev === selectedPhotos.length - 1 ? 0 : prev + 1
  );
};

const previousImage = () => {
  setCurrentImageIndex((prev) => 
    prev === 0 ? selectedPhotos.length - 1 : prev - 1
  );
};

const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value, checked } = event.target;
  const updatedFeatures = checked
    ? [...destination.features, value] // Ajoute la fonctionnalité sélectionnée
    : destination.features.filter((feature: string) => feature !== value); // Supprime la fonctionnalité décochée
  
  setDestination((prev) => ({
    ...prev,
    features: updatedFeatures,
  }));
};

const [searchQuery, setSearchQuery] = useState('');
const [filteredDestinations, setFilteredDestinations] = useState<{ 
  _id: string; 
  name: string; 
  description: string; 
  address: string; 
  photos: string[]; 
  createdBy?: { _id: string } | null; 
  features?: string[]; 
}[]>([]);

  // Ajouter useEffect pour filtrer les destinations
  useEffect(() => {
    const filtered = destinations.filter(dest => 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.features?.some(feature => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredDestinations(filtered);
  }, [searchQuery, destinations]);

  const [isExpanded, setIsExpanded] = useState(false);


return (
  <>
      <Navbar />
      {userRole === 'owner' && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={openModal}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-purple-500/25"
          >
            <FaPlusCircle size={32} />
          </button>
        </div>
      )}
    
      {reservationSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded text-center text-lg z-50">
        ✨ Reservation sent successfully! ✨
        </div>
      )}


      {/* Nouvelle barre de recherche */}
      <div className="max-w-7xl mx-auto px-2 pt-24 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, features, or descriptions..."
              className="w-full px-12 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RxCross2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
   
       

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden group">
                {dest.photos.length > 0 && (
                  <img
                    src={dest.photos[0]}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onClick={() => {
                      setCurrentImageIndex(0);
                      openGallery(dest.photos);
                    }}
                  />
                )}
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{dest.name}</h3>
                </div>
                <div className="relative group">
  <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-2xl transform -translate-x-10 -translate-y-10" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-xl transform translate-x-5 translate-y-5" />
    
    {/* Content container */}
    <div className={`relative transition-all duration-500 ease-out ${
      isExpanded ? 'h-auto' : 'h-[4.5em] mask-linear-gradient'
    }`}>
      <div className="flex items-start space-x-2 mb-3">
        <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
          {dest.description}
        </p>
      </div>
    </div>
    
    {/* Enhanced button */}
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="absolute bottom-0 left-0 w-full h-16 flex items-end justify-center pb-2 transition-all duration-300"
    >
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group/btn border border-indigo-100/50">
        <span className={`text-sm font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent transform transition-transform duration-300 ${
          isExpanded 
            ? 'group-hover/btn:-translate-y-0.5' 
            : 'group-hover/btn:translate-y-0.5'
        }`}>
          {isExpanded ? 'Replier le texte' : 'Découvrir plus'}
        </span>
        <span className={`transform transition-transform duration-300 ${
          isExpanded 
            ? 'rotate-180 group-hover/btn:-translate-y-0.5' 
            : 'group-hover/btn:translate-y-0.5'
        }`}>
          <ChevronDown size={16} className="text-indigo-600" />
        </span>
      </div>
    </button>
  </div>

  <style>{`
    .mask-linear-gradient {
      mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
    }
  `}</style>
</div>

                {dest.features && dest.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dest.features.map((feature, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105"
                      >
                        {getFeatureIcon(feature)}
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={18} className="text-purple-500" />
                    <p className="text-sm">{dest.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-purple-500" />
                    <span className="text-sm text-gray-700">Open Now</span>
                  </div>

                  <a 
                    href={getGoogleMapsLink(dest.address)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-all group"
                  >
                    <Navigation size={16} className="group-hover:translate-x-1 transition-transform" />
                    View on Google Maps
                  </a>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-4">
                    {dest.createdBy === userId && (
                      <>
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-purple-500 hover:text-purple-600 transition-all duration-300 hover:scale-110"
                          title="Edit"
                        >
                          <PenSquare size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleReserve(index)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                  >
                    <Calendar size={18} />
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isGalleryOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
        <button 
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10" 
          onClick={closeGallery}
        >
          <RxCross2 size={32} />
        </button>
        
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
          onClick={previousImage}
        >
          <FaChevronLeft size={40} />
        </button>

        <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center">
          <img
            src={selectedPhotos[currentImageIndex]}
            alt={`Photo ${currentImageIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {selectedPhotos.length}
          </div>
        </div>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
          onClick={nextImage}
        >
          <FaChevronRight size={40} />
        </button>
      </div>
    )}
      {/* Reservation Modal */}
      {isReservationFormOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-t-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464618663641-bbdd760ae84a')] opacity-20 bg-cover bg-center" />
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-bold">Make a Reservation</h3>
                  <button 
                    onClick={closeReservationForm}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <RxCross2 size={24} />
                  </button>
                </div>
                <p className="text-white/80">Fill in the details below to book your stay</p>
              </div>
            </div>
            
            <form onSubmit={handleReservationSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    name="fullname"
                    value={reservationDetails.fullname}
                    onChange={handleReservationChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer placeholder-transparent"
                    placeholder="Full Name"
                    required
                  />
                  <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                    Full Name
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={reservationDetails.email}
                      onChange={handleReservationChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer placeholder-transparent"
                      placeholder="Email"
                      required
                    />
                    <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                      Email
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={reservationDetails.phone}
                      onChange={handleReservationChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer placeholder-transparent"
                      placeholder="Phone"
                      required
                    />
                    <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                      Phone
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={reservationDetails.startDate}
                      onChange={handleReservationChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                    <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2">
                      Check-in Date
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      value={reservationDetails.endDate}
                      onChange={handleReservationChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                    <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2">
                      Check-out Date
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    name="numberOfPersons"
                    value={reservationDetails.numberOfPersons}
                    onChange={handleReservationChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer placeholder-transparent"
                    placeholder="Number of Persons"
                    required
                  />
                  <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                    Number of Persons
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transform"
              >
                Complete Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-t-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')] opacity-20 bg-cover bg-center" />
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-bold">
                    {destination._id ? 'Edit Destination' : 'Add New Destination'}
                  </h3>
                  <button 
                    onClick={closeModal}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <RxCross2 size={24} />
                  </button>
                </div>
                <p className="text-white/80">
                  {destination._id ? 'Update the details of your destination' : 'Create an amazing new destination'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={destination.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer placeholder-transparent"
                    placeholder="Destination Name"
                    required
                  />
                  <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                    Destination Name
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    name="description"
                    value={destination.description}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-32 resize-none peer placeholder-transparent"
                    placeholder="Description"
                    required
                  />
                  <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                    Description
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={destination.address}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer placeholder-transparent"
                    placeholder="Address"
                    required
                  />
                  <label className="absolute left-6 -top-3 text-sm font-medium text-gray-600 bg-white px-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600">
                    Address
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Photos</label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {destination.existingPhotos.map((url, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-md">
                        <img 
                          src={url} 
                          alt={`Photo ${i + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                    {destination.photos.map((file, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-md">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`New photo ${i + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Features</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Wifi size={16} />, label: 'Free WiFi' },
                      { icon: <Car size={16} />, label: 'Parking' },
                      { icon: <Wind size={16} />, label: 'Air Conditioning' },
                      { icon: <Tv size={16} />, label: 'TV' },
                      { icon: <Coffee size={16} />, label: 'Coffee Machine' },
                      { icon: <Utensils size={16} />, label: 'Kitchen' },
                      { icon: <Waves size={16} />, label: 'Pool' },
                      { icon: <DumbbellIcon size={16} />, label: 'Gym' },
                      { icon: <PawPrint size={16} />, label: 'Pet Friendly' },
                      { icon: <Shirt size={16} />, label: 'Laundry' }
                    ].map((feature, i) => (
                      <label 
                        key={i} 
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          destination.features?.includes(feature.label)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="features"
                          value={feature.label}
                          onChange={handleFeatureChange}
                          checked={destination.features?.includes(feature.label)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2">
                          {feature.icon}
                          <span className="font-medium">{feature.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transform"
              >
                {destination._id ? 'Update Destination' : 'Add Destination'}
              </button>
            </form>
          </div>
        </div>
    )}
  </>
);
};

export default Tataouein;