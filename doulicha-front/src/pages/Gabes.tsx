import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import '../components/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Gabes = () => {
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
    navigate('/gabes');
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

  }>({
    photos: [],
    existingPhotos: [],
    name: '',
    description: '',
    address: '',
    createdBy: null,
  });

  const [destinations, setDestinations] = useState<{
    _id: string;
    name: string;
    description: string;
    address: string;
    photos: string[];
    createdBy?: { _id: string } | null; // Allow null for initial state
  }[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      try {
        const response = await fetch(`${apiUrl}dests`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setDestinations(data);
        console.log('Fetched destinations:', data);
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

    // Append existing photos (strings)
    destination.existingPhotos.forEach(photo => formData.append('existingPhotos', photo));

    // Append new photos (File objects)
    destination.photos.forEach(file => formData.append('photos', file));

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
      closeModal();
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
            message: `New reservation for ${reservationDetails.fullname} from ${reservationDetails.startDate} to ${reservationDetails.endDate} for the place : ${data.destination.name}.`,
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
  

  return (
    <>
      <Navbar />
      <br />
      <br />
      {userRole === 'owner' && (
        <div className="add-icon-container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <FaPlusCircle size={50} color="green" onClick={openModal} />
        </div>
      )}
      {/* Reservation success message centered and small */}
      {reservationSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-2 rounded text-center text-sm">
          Reservation sent successfully!
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 destinations-container">
        {destinations.map((dest, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-md destination-card flex flex-col justify-between"
            style={{ height: '350px', width: '100%' }}
          >
            <div>
              <h3 className="font-bold text-lg">{dest.name}</h3>
              <p>{dest.description}</p>
              <p>{dest.address}</p>
              <p>
                <a href={getGoogleMapsLink(dest.address)} target="_blank" rel="noopener noreferrer">
                  View on Google Maps
                </a>
              </p>
              <div className="flex">
                {dest.photos.length > 0 && (
                  <img
                    src={dest.photos[0]}
                    alt="First photo"
                    className="image-preview h-20 w-20 mr-2 cursor-pointer"
                    onClick={() => openGallery(dest.photos)}
                  />
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between">
            {dest.createdBy && typeof dest.createdBy === 'object' && dest.createdBy._id === userId && (
              <FaEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEdit(index)}
                title="Edit"
                
              />)}
            {dest.createdBy && typeof dest.createdBy === 'object' && dest.createdBy._id === userId && (
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(index)}
                title="Delete"
              />)}
              
              <button
                className="text-green-500 cursor-pointer"
                onClick={() => handleReserve(index)}
                title="Reserve"
              >
              Reserver</button>
            </div>
          </div>
        ))}
      </div>

      {isGalleryOpen && (
        <div className="fixed top-0 left-0 bg-gray-800 opacity-90 h-screen w-full flex items-center justify-center">
          <div className="w-2/6 max-h-screen bg-gray-900 p-4 rounded overflow-auto">
            <div className="flex justify-end">
              <button className="text-2xl text-white" onClick={closeGallery}>
                <RxCross2 />
              </button>
            </div>
            <div className="gallery flex flex-wrap justify-center">
              {selectedPhotos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Photo ${i}`}
                  className="h-40 w-40 m-2 rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {isReservationFormOpen && (
        <div className="fixed top-0 left-0 bg-gray-800 opacity-90 h-screen w-full flex items-center justify-center">
          <div className="w-2/6 max-h-screen bg-gray-900 p-4 rounded overflow-auto">
            <div className="flex justify-end">
              <button className="text-2xl text-white" onClick={closeReservationForm}>
                <RxCross2 />
              </button>
            </div>
            <h3 className="text-lg font-bold mb-4 text-white">Reservation Form</h3>
            <form onSubmit={handleReservationSubmit}>
              <label className="text-white">Full Name:</label>
              <input
                type="text"
                name="fullname"
                value={reservationDetails.fullname}
                onChange={handleReservationChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Email:</label>
              <input
                type="email"
                name="email"
                value={reservationDetails.email}
                onChange={handleReservationChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={reservationDetails.phone}
                onChange={handleReservationChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={reservationDetails.startDate}
                onChange={handleReservationChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">End Date:</label>
              <input
                type="date"
                name="endDate"
                value={reservationDetails.endDate}
                onChange={handleReservationChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Number of Persons:</label>
              <input
                type="number"
                name="numberOfPersons"
                value={reservationDetails.numberOfPersons}
                onChange={handleReservationChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Submit Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed top-0 left-0 bg-gray-800 opacity-90 h-screen w-full flex items-center justify-center">
          <div className="w-2/6 max-h-screen bg-gray-900 p-4 rounded overflow-auto">
            <div className="flex justify-end">
              <button className="text-2xl text-white" onClick={closeModal}>
                <RxCross2 />
              </button>
            </div>
            <h3 className="text-lg font-bold mb-4 text-white">Add a new Destination</h3>
            <form onSubmit={handleSubmit}>
              <label className="text-white">Name:</label>
              <input
                type="text"
                name="name"
                value={destination.name}
                onChange={handleChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Description:</label>
              <textarea
                name="description"
                value={destination.description}
                onChange={handleChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Address:</label>
              <input
                type="text"
                name="address"
                value={destination.address}
                onChange={handleChange}
                className="w-full p-2 mb-4 rounded"
                required
              />

              <label className="text-white">Photos:</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 mb-4 rounded"
              />

              <div className="flex flex-wrap">
                {destination.existingPhotos.map((url, i) => (
                  <img key={i} src={url} alt={`Photo ${i}`} className="h-20 w-20 mr-2" />
                ))}
                {destination.photos.map((file, i) => (
                  <img key={i} src={URL.createObjectURL(file)} alt={`Photo ${i}`} className="h-20 w-20 mr-2" />
                ))}
              </div>

              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                {destination._id ? 'Update Destination' : 'Add Destination'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Gabes;
