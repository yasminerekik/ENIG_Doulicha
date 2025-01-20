import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mail, Lock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isResetMode, setIsResetMode] = useState(false); // Mode réinitialisation du mot de passe
  const [isCodeVerified, setIsCodeVerified] = useState(false); // Flag pour savoir si le code est vérifié
  const [resetCode, setResetCode] = useState('');

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

  // Envoi de la demande de réinitialisation de mot de passe
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/reset-password', { email: emailInput });
      setMessage('A reset code has been sent to your email.');
      setIsModalOpen(false);
      setIsResetMode(true); // Passer en mode réinitialisation après envoi du code
      console.log("email recuperee", emailInput);
      console.log("isResetMode après demande : ", isResetMode); // Vérifier que l'état a changé
    } catch (error) {
      setMessage('Error sending code.');
    }
  };
  const handleVerifyCode = async () => {
    
    // Vérification si l'email et le code sont valides
    if (!emailInput || !resetCode) {
      setMessage('The email or code is missing.');
      return;
    }
  
    try {
      // Envoi du code de réinitialisation et de l'email à l'API pour vérification
      const response = await axios.post('http://localhost:5000/reset-password/verify-code', {
        email: emailInput, // Email passé en paramètre dans l'URL de réinitialisation
        code: resetCode,   // Code saisi par l'utilisateur
      });
  
      // Si le code est vérifié avec succès, on met à jour l'état
      setIsCodeVerified(true);
      setMessage('Code verified successfully.');
    } catch (err: any) {
      // Gestion des erreurs
      if (err.response) {
        // Afficher un message d'erreur spécifique si l'API retourne un message
        setMessage(err.response.data.message || 'The reset code is incorrect.');
      } else {
        // Message d'erreur générique si l'erreur n'est pas liée à la réponse de l'API
        setMessage('An error occurred while verifying the code.');
      }
    }
  };
  

  // Réinitialisation du mot de passe après avoir reçu le code
  const handleResetPassword = async () => {
    try {
      if (emailInput && resetCode && isCodeVerified) {
        await axios.put('http://localhost:5000/auth/reset-password', {
          email: emailInput,
          newPassword,
          code: resetCode,
        });
        setMessage('Password reset successfully.');
        setIsResetMode(false); // Retour au mode de connexion
      } else {
        setMessage('Invalid code or email.');
        console.log(emailInput);
        console.log(resetCode);
      }
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-fuchsia-50 flex flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Logo />
      {!isResetMode ? (
        <div className="mt-10 bg-gray-800 shadow-xl rounded-2xl p-8 border-2 border-purple-100">
          <h2 className="text-center text-2xl font-bold text-gray-100 mb-8">
          Sign in to your account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-100">
              Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-100">
              Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="mt-2 flex justify-end">
                <a href="#"
                  onClick={toggleModal}
                  className="text-sm font-semibold text-gray-100 hover:text-purple-500 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="mt-2 flex justify-end">
                          <Link to="/signup" className="text-sm font-semibold text-gray-100 hover:text-purple-500 transition-colors"
                          >
                            Haven't an account? Sign Up
                          </Link>
                        </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Send className="h-5 w-5" />
              Sign In
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-sm text-center border border-red-100">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 bg-white shadow-xl rounded-2xl p-8 border-2 border-purple-100">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
          Password reset
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter the code of reset password"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
            />
            <button
              onClick={handleVerifyCode}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Verify the code
            </button>

            {isCodeVerified && (
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
                />
                <button
                  onClick={handleResetPassword}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Reset the password
                </button>
              </div>
            )}
          </div>
          {message && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg text-purple-700 text-sm text-center border border-purple-100">
              {message}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reset the password</h2>
          <form onSubmit={handleRequestResetCode} className="space-y-4">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              required
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-all"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
export default Signin;
