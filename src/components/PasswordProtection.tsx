import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_white_bold.svg';
import background from '../assets/background.jpeg';
import { getCompanyNameFromUrl } from '../utils/urlParams';

const PasswordProtection: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      if (e.target.value.trim() === '') {
        setError('Password cannot be empty or contain only spaces');
      } else if (e.target.value.length < 6) {
        setError('Password must be at least 6 characters long');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const companyName = getCompanyNameFromUrl();
      const webhookUrl = process.env.REACT_APP_CHECK_PASSWORD_CUSTOMER_LINK_WEBHOOK?.trim();

      if (!webhookUrl) {
        setError('Configuration error. Please contact support.');
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, password }),
      });

      if (!response.ok) {
        setError('Incorrect password');
        return;
      }

      const data = await response.json();
      const isValid = data === true || data === 'true' || data?.valid === true || data?.success === true || data?.isPasswordValid === true;

      if (isValid) {
        localStorage.setItem('formAuthenticated', 'true');
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
        Please enter your password to access the application form
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (!error) handleSubmit(e); }}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  title='Please enter the password to access the application form'
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full rounded-[14px] border border-[#dfe3e8] bg-white px-[18px] py-3.5 text-base text-[#1f2a37] placeholder:text-[#aab1bb] focus:outline-none focus:ring-[3px] focus:ring-violet-500/10 focus:border-violet-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={onChangePassword}
                />
              </div>
              
            </div>
            {error && (
            <div className="">
              <div className="text-xs text-red-600">{error}</div>
            </div>
          )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-full border-0 bg-gradient-to-r from-[#f78fa7] to-[#fbbf7a] px-4 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(247,143,167,0.4)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
