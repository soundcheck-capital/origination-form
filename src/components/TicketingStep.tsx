import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTicketingInfo, updateVolumeInfo } from '../store/form/formSlice';
import TicketingVolumeStep from './TicketingVolumeStep';
import StepTitle from './customComponents/StepTitle';
import DropdownField from './customComponents/DropdownField';
import TextField from './customComponents/TextField';
import NumberInput from './customComponents/NumberField';
import CurrencyField from './customComponents/CurrencyField';
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
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
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

  const handleNumberChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  const handleCurrencyChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  const handleLoginSuccess = () => {
    setIsTicketonConnected(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-gray-600 my-8 text-2xl font-bold w-[40%] text-center">Annual ticketing volume</p>

      <p className="text-gray-400 mb-16 text-center px-20 w-[40%]">
        We use your historical ticket sales, 3rd party and proprietary data to determine your advance eligibility in minutes. We only collect the information we need to provide you the best possible offer.
      </p>

      <DropdownField label="Current Ticketing Partner" name="currentPartner" value={ticketingInfo.currentPartner} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPartners} />
      {/* {isTicketonConnected && ticketingInfo.currentPartner === 'Ticketon' && (
          <span className="check-icon">✓</span>
        )} */}


      {/* {ticketingInfo.currentPartner === 'Ticketon' && !isTicketonConnected && (
        <div className="space-y-6 mb-10">
          <button
            className="btn btn-primary"
            onClick={() => setShowLoginPopup(true)}
          >
            Connect to Ticketon
          </button>
        </div>
      )} */}

      <DropdownField label="What is your ticketing partner settlement/payout policy?" name="settlementPolicy" value={ticketingInfo.settlementPolicy} onChange={handleChange} error='' onBlur={() => { }} options={settlementPolicies} />

      {/* <TicketingVolumeStep /> */}


      <StepTitle title="Last 12 Months" />
      <NumberInput label="Number of Events" value={ticketingVolume.lastYearEvents.toString()} onChange={(value) => handleNumberChange('lastYearEvents', value)} placeholder="Fill in" />
      <NumberInput label="Number of Tickets sold online" value={ticketingVolume.lastYearTickets.toString()} onChange={(value) => handleNumberChange('lastYearTickets', value)} placeholder="Fill in" />
      <CurrencyField label="Online Gross Tickets Sales" value={ticketingVolume.lastYearSales.toString()} onChange={(value) => handleCurrencyChange('lastYearSales', value)} placeholder="Fill in" />

      {/* Colonne 3 : Next 12 Months */}
      <StepTitle title="Next 12 Months" />
      <NumberInput label="Number of Events" value={ticketingVolume.nextYearEvents.toString()} onChange={(value) => handleNumberChange('nextYearEvents', value)} placeholder="Fill in" />
      <NumberInput label="Number of Tickets sold online" value={ticketingVolume.nextYearTickets.toString()} onChange={(value) => handleNumberChange('nextYearTickets', value)} placeholder="Fill in" />
      <CurrencyField label="Online Gross Tickets Sales" value={ticketingVolume.nextYearSales.toString()} onChange={(value) => handleCurrencyChange('nextYearSales', value)} placeholder="Fill in" />
      {/* <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      /> */}
    </div>
  );
};

export default TicketingStep; 