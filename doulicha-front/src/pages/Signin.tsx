import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const loginData = { email, password };

    try {
      // Envoi de la requête de connexion
      const response = await axios.post('http://localhost:5000/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Vérification que la réponse contient bien un accessToken
      if (response.data && response.data.data && response.data.data.accessToken) {
        const { accessToken, user } = response.data.data;

        // Sauvegarder le accessToken et les informations utilisateur dans le localStorage
        localStorage.setItem('authToken', accessToken);

        // Sauvegarder aussi les informations utilisateur si nécessaire
        localStorage.setItem('user', JSON.stringify(user));

        // Rediriger vers la page d'accueil (ou une autre page protégée)
        navigate('/home');
      } else {
        setError('Le serveur n\'a pas retourné de token.');
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || 'Une erreur est survenue');
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  const [emailInput, setEmailInput] = useState(""); // Utilisation de noms différents
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/reset-password', { // Remplacez par l'URL de votre backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      });
  
      if (response.ok) {
        alert('Check your email for reset instructions.');
      } else {
        alert('Error sending reset email. Please try again.');
      }
  
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={toggleModal}>Forgot password?</a>
              </div>
              </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit2}>
            <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
            </form>
            <button
              onClick={toggleModal}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
            </div>
  );
};

export default Signin;
