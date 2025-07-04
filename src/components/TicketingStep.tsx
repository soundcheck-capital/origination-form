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
  'Etix',
  'Eventbrite',
  'EventLive',
  'Fever',
  'Leap Event Technology',
  'PreKindle',
  'See Tickets',
  'Shotgun',
  'Showpass',
  'SquadUp',
  'TicketFairy',
  'Ticketmaster',
  'Ticketon',
  'TicketTailor',
  'Ticketspice',
  'Tixr',
  'Venue Pilot',  
  'Various',
  'Other',

];

const settlementPolicies = [
  'Daily payout',
  'Weekly payout',
  'Bi-monthly payout',
  'Monthly payout',
  'Payout after the event'
];

const ticketingPayouts = [
  'Ticketing Partner',
  'Venue (i.e. post show settlement)',
  'Payment Processor (e.g. Stripe)',
  'Other'
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

  let otherPartner = '';

  return (
    <div className="flex flex-col items-center justify-center w-full mt-16">

    
      <DropdownField label="Who do you receive the Ticket Sales payouts from?" name="ticketingPayout" value={ticketingInfo.ticketingPayout} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPayouts} />
      {ticketingInfo.ticketingPayout === 'Other' && (
      <TextField label="Other Ticketing Payout" name="otherTicketingPayout" value={ticketingInfo.otherTicketingPayout} onChange={handleChange} error='' onBlur={() => { }} type='text' />
     )}
      <DropdownField label="Ticketing Partner" name="currentPartner" value={ticketingInfo.currentPartner} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPartners} />
     
     {ticketingInfo.currentPartner === 'Other' && (
      <TextField label="Other Ticketing Partner" name="otherPartner" value={ticketingInfo.otherPartner} onChange={handleChange} error='' onBlur={() => { }} type='text' />
     )}

      <DropdownField label="What is your ticketing partner settlement/payout policy?" name="settlementPolicy" value={ticketingInfo.settlementPolicy} onChange={handleChange} error='' onBlur={() => { }} options={settlementPolicies} />

      {/* <TicketingVolumeStep /> */}


      <StepTitle title="Last 12 Months" />
      <NumberInput label="Number of Events" value={ticketingVolume.lastYearEvents.toString()} onChange={(value) => handleNumberChange('lastYearEvents', value)} placeholder="Fill in" id="lastYearEvents" />
      <NumberInput label="Number of Tickets sold online" value={ticketingVolume.lastYearTickets.toString()} onChange={(value) => handleNumberChange('lastYearTickets', value)} placeholder="Fill in" id="lastYearTickets" />
      <CurrencyField label="Online Gross Tickets Sales" value={ticketingVolume.lastYearSales.toString()} onChange={(value) => handleCurrencyChange('lastYearSales', value)} placeholder="Fill in" id="lastYearSales" />

      {/* Colonne 3 : Next 12 Months */}
      <StepTitle title="Next 12 Months" />
          <NumberInput label="Number of Events" value={ticketingVolume.nextYearEvents.toString()} onChange={(value) => handleNumberChange('nextYearEvents', value)} placeholder="Fill in" id="nextYearEvents" />
      <NumberInput label="Number of Tickets sold online" value={ticketingVolume.nextYearTickets.toString()} onChange={(value) => handleNumberChange('nextYearTickets', value)} placeholder="Fill in" id="nextYearTickets" />
      <CurrencyField label="Online Gross Tickets Sales" value={ticketingVolume.nextYearSales.toString()} onChange={(value) => handleCurrencyChange('nextYearSales', value)} placeholder="Fill in" id="nextYearSales" />
      {/* <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      /> */}
    </div>
  );
};

export default TicketingStep; 