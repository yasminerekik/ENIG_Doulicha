import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mail, Lock, Send, User } from 'lucide-react';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Créer un objet pour la requête d'inscription
    const signupData = { 
      firstname: firstName,  // Utilisation de 'firstname' au lieu de 'firstName'
      lastname: lastName,    // Utilisation de 'lastname' au lieu de 'lastName'
      email, 
      password, 
      role 
    };

    try {
      // Envoi de la requête POST à l'API NestJS pour l'inscription
      const response = await axios.post('http://localhost:5000/auth/signup', signupData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Réponse backend:', response.data);

      // Si l'inscription est réussie, rediriger vers la page de connexion
      navigate('/signin');
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || 'Une erreur est survenue');
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-fuchsia-50 flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Logo />
      <div className="mt-10 bg-gray-800 shadow-xl rounded-2xl p-8 border-2 border-purple-100">
        <h2 className="text-center text-2xl font-bold text-gray-100 mb-8">Sign up to your account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-100">First Name</label>
            <div className="mt-1 relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                placeholder="firstname"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-100">Last Name</label>
            <div className="mt-1 relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                placeholder="lastname"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
            <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
            <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-100">Role</label>
  <div className="mt-1 relative">
  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    <select
      id="role"
      name="role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      required
      className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
      >
      <option value="guest">Guest</option>
      <option value="owner">Owner</option>
    </select>
  </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
           >
            <Send className="h-5 w-5" />
              Sign Up
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <Link to="/signin" className="text-sm font-semibold text-gray-100 hover:text-purple-500 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
    </div>
  );
};

export default Signup;
