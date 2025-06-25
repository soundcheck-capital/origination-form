import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTicketingInfo } from '../store/form/formSlice';
import TicketingVolumeStep from './TicketingVolumeStep';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://ticketon.cloud/api/v1/ticketon-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      onSuccess();
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h3>Connect to Ticketon</h3>
        <form onSubmit={handleSubmit}>
          <div className="ticketon-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="ticketon-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

const ticketingPartners = [
  'AXS',
  'Shotgun',
  'Dice',
  'Etix',
  'Eventbrite',
  'Fever',
  'Leap Event Technology',
  'See Tickets',
  'SquadUp',
  'TicketMaster',
  'Ticketon',
  'Tixr',
  'Venue Pilot',
  'Other'
];

const settlementPolicies = [
  'Daily payout',
  'Weekly payout',
  'Bi-monthly payout',
  'Monthly payout',
  'Payout after the event'
];



const TicketingStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isTicketonConnected, setIsTicketonConnected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateTicketingInfo({ [name]: value }));
    // Reset connection status if partner changes
    if (name === 'currentPartner' && value !== 'Ticketon') {
      setIsTicketonConnected(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsTicketonConnected(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-gray-600 mb-8 text-2xl font-bold mt-10">Annual ticketing volume</p>




      <p className="text-gray-400 mb-16 text-center px-20">
        We use your historical ticket sales, 3rd party and proprietary data to determine your advance eligibility in minutes. We only collect the information we need to provide you the best possible offer.
      </p>




      <div className="relative w-full max-w-md mb-10">
        <select
          name="currentPartner"
          value={ticketingInfo.currentPartner}
          onChange={handleChange}
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
        >
          <option value=""></option>
          {ticketingPartners.map((partner) => (
            <option key={partner} value={partner}>
              {partner}
            </option>
          ))}
        </select>
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-8 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-8 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Current Ticketing Partner</label>
        {isTicketonConnected && ticketingInfo.currentPartner === 'Ticketon' && (
          <span className="check-icon">✓</span>
        )}
      </div>

      {ticketingInfo.currentPartner === 'Ticketon' && !isTicketonConnected && (
        <div className="space-y-6 mb-10">
          <button
            className="btn btn-primary"
            onClick={() => setShowLoginPopup(true)}
          >
            Connect to Ticketon
          </button>
        </div>
      )}

      <div className="relative w-full max-w-md mb-10">
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-8 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-8 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">What is your ticketing partner settlement/payout policy?</label>

        <select
          name="settlementPolicy"
          value={ticketingInfo.settlementPolicy}
          onChange={handleChange}
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
        >
          <option value=""></option>
          {settlementPolicies.map((policy) => (
            <option key={policy} value={policy}>
              {policy}
            </option>
          ))}
        </select>
      </div>

      <TicketingVolumeStep />

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default TicketingStep; 