import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaPlusCircle, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import '../components/Navbar.css';

const Gabes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Get user information and token
  const [userData, setUserData] = useState<{ role: string } | null>(null);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userFromStorage = localStorage.getItem('user');

    if (token && userFromStorage) {
      setAccessToken(token);
      setUserData(JSON.parse(userFromStorage));
    }
  }, []);

  const userRole = userData?.role;

  const [destination, setDestination] = useState<{
    photos: string[]; // URL strings
    name: string;
    description: string;
    address: string;
  }>({
    photos: [],
    name: '',
    description: '',
    address: '',
  });

  const [destinations, setDestinations] = useState<{
    _id: string;
    name: string;
    description: string;
    address: string;
    photos: string[];
  }[]>([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    try {
      // Créez un objet FormData pour envoyer au backend
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));
      
      // Ajouter les autres données du formulaire (nom, description, etc.)
      formData.append('name', destination.name);
      formData.append('description', destination.description);
      formData.append('address', destination.address);

      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const response = await fetch(`${apiUrl}dests`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      // Vérifiez si la réponse est correcte avant de tenter de la lire
      if (!response.ok) {
        const result = await response.text(); // lire la réponse en texte brut si ce n'est pas OK
        console.error('Error uploading images:', result);
        alert('Erreur lors du téléchargement des images: ' + result);
        return;
      }

      // Lire la réponse en JSON seulement si elle est OK
      const result = await response.json();
      const photoUrls = result.photos; // Supposons que le backend renvoie un tableau d'URL d'images
      setDestination({ ...destination, photos: photoUrls });
      setImagePreviews(photoUrls);
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const response = await fetch(`${apiUrl}dests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(destination),
      });
      const newDest = await response.json();
      setDestinations([...destinations, newDest]);
      closeModal();
    } catch (error) {
      console.error('Error adding destination:', error);
    }
  };

  const handleEdit = (index: number) => {
    console.log('Edit destination at index:', index);
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
    console.log(`Reserve destination at index: ${index}`);
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
              <FaEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEdit(index)}
                title="Edit"
              />
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(index)}
                title="Delete"
              />
              <FaCheckCircle
                className="text-green-500 cursor-pointer"
                onClick={() => handleReserve(index)}
                title="Reserve"
              />
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

              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Add Destination
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Gabes;
