import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTicketingInfo } from '../store/formSlice';

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
  'Paid daily',
  'Paid weekly',
  'Paid monthly',
  'Paid bi-monthly',
  'Paid after the event(s)'
];

const memberships = [
  'NATO (National Association of Theater Owners)',
  'NIVA (National Independent Venue Association)',
  'Promotores Unidos',
  'Other'
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
    <div className="form-step">
      <h2 className="step-title">Tell us about your business</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Company &lt;&gt; Ticketing co</h3>
      
      <div className="form-group">
        <div className="select-with-icon">
          <select
            name="currentPartner"
            value={ticketingInfo.currentPartner}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Current Ticketing Partner</option>
            {ticketingPartners.map((partner) => (
              <option key={partner} value={partner}>
                {partner}
              </option>
            ))}
          </select>
          {isTicketonConnected && ticketingInfo.currentPartner === 'Ticketon' && (
            <span className="check-icon">✓</span>
          )}
        </div>
      </div>

      {ticketingInfo.currentPartner === 'Ticketon' && !isTicketonConnected && (
        <div className="form-group">
          <button 
            className="btn btn-primary"
            onClick={() => setShowLoginPopup(true)}
          >
            Connect to Ticketon
          </button>
        </div>
      )}

      <div className="form-group">
        <select
          name="settlementPolicy"
          value={ticketingInfo.settlementPolicy}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">What is your ticketing partner settlement/payout policy?</option>
          {settlementPolicies.map((policy) => (
            <option key={policy} value={policy}>
              {policy}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <select
          name="membership"
          value={ticketingInfo.membership}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Are you a member of?</option>
          {memberships.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
      </div>

      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default TicketingStep; 