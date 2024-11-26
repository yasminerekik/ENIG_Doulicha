import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">CITIES</h2>
  
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <a href="gabes" className="group">
              <img 
                src="\images\gabes.jpg" 
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Gabes</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\sfax.jpg" 
                alt="Olive drab green insulated bottle with flared screw lid and flat top" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Sfax</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\sousse.jpg" 
                alt="Person using a pen to cross a task off a productivity paper card" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Sousse</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\monastir.jpg" 
                alt="Hand holding black machined steel mechanical pencil with brass tip and top" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Monastir</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\tunis.jpg" 
                alt="Hand holding black machined steel mechanical pencil with brass tip and top" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Tunis</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\hammamet.jpg" 
                alt="Hand holding black machined steel mechanical pencil with brass tip and top" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Hammamet</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\djerba.jpg" 
                alt="Hand holding black machined steel mechanical pencil with brass tip and top" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Djerba</h3></center>
            </a>
            <a href="#" className="group">
              <img 
                src="\images\mahdia.jpg" 
                alt="Hand holding black machined steel mechanical pencil with brass tip and top" 
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" 
              />
              <center><h3 className="mt-4 text-sm text-gray-700 custom-bold">Mahdia</h3></center>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cities;
