import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_white_name.svg';
import background from '../assets/background.jpeg';
const PasswordProtection: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Récupérer le mot de passe depuis les variables d'environnement
      const correctPassword = process.env.REACT_APP_FORM_PASSWORD;
    
      console.log(correctPassword);
      console.log(password);
      if (password === correctPassword) {
        // Stocker l'authentification dans le localStorage
        localStorage.setItem('formAuthenticated', 'true');
        // Rediriger vers le formulaire
        navigate('/form');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('formAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center bg-black/50 bg-blend-overlay" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src={logo} 
            alt="SoundCheck" 
            className="h-24 w-auto  "
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Access Required
        </h2>
        <p className="mt-2 text-center text-sm text-white">
          Please enter the password to access the application form
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Access Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection; 