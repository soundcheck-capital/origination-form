import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTicketingInfo } from '../store/formSlice';

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
  'We are paid monthly',
  'We are paid weekly',
  'We are paid after the event(s)'
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateTicketingInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Company &lt;&gt; Ticketing co</h3>
      
      <div className="form-group">
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
      </div>

      <div className="form-group">
        <select
          name="settlementPolicy"
          value={ticketingInfo.settlementPolicy}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">What is your ticketing partner settlement/policy?</option>
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
    </div>
  );
};

export default TicketingStep; 